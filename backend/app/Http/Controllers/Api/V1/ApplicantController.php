<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Applicant\StoreApplicationRequest;
use App\Http\Requests\Applicant\UploadDocumentRequest;
use App\Models\Application;
use App\Models\Division;
use App\Models\Document;
use App\Models\Notification;
use App\Services\SupabaseStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    protected SupabaseStorageService $storage;

    public function __construct(SupabaseStorageService $storage)
    {
        $this->storage = $storage;
    }

    /**
     * GET /api/v1/divisions
     *
     * List all divisions with quota information.
     */
    public function divisions(): JsonResponse
    {
        $divisions = Division::all()->map(function ($division) {
            return [
                'id'                => $division->id,
                'name'              => $division->name,
                'max_quota'         => $division->max_quota,
                'active_applicants' => $division->active_applicants,
                'remaining_quota'   => $division->remaining_quota,
                'is_locked'         => $division->is_locked,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $divisions,
        ])->header('Cache-Control', 'public, max-age=60');
    }

    /**
     * POST /api/v1/applications
     *
     * Submit a new internship application.
     */
    public function storeApplication(StoreApplicationRequest $request): JsonResponse
    {
        $user = $request->user();

        // 1. Check if user has an ongoing/active application or ongoing internship
        $hasActiveApp = Application::where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereIn('status', ['pending', 'reviewing'])
                    ->orWhere(function ($q) {
                        $q->where('status', 'accepted')
                            ->where(function ($sub) {
                                $sub->whereNull('internship_end')
                                    ->orWhere('internship_end', '>=', now()->toDateString());
                            });
                    });
            })
            ->exists();

        if ($hasActiveApp) {
            return response()->json([
                'success' => false,
                'message' => 'Anda masih memiliki pengajuan aktif atau masa magang yang sedang berjalan.',
            ], 422);
        }

        // 2. Check if user was previously rejected in this specific division
        $rejectedOnThisDivision = Application::where('user_id', $user->id)
            ->where('division_id', $request->division_id)
            ->where('status', 'rejected')
            ->exists();

        if ($rejectedOnThisDivision) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah pernah mengajukan ke divisi ini dan ditolak. Silakan pilih divisi lain.',
            ], 422);
        }

        // Check if division is locked
        $division = Division::findOrFail($request->division_id);
        if ($division->is_locked) {
            return response()->json([
                'success' => false,
                'message' => 'Kuota divisi ini sudah penuh.',
            ], 422);
        }

        $application = Application::create([
            'user_id'          => $user->id,
            'division_id'      => $request->division_id,
            'status'           => 'pending',
            'institution_name' => $request->institution_name,
            'study_program'    => $request->study_program,
            'skills'           => $request->skills,
            'experience'       => $request->experience,
            'projects'         => $request->projects,
            'portfolio_url'    => $request->portfolio_url,
            'internship_start' => $request->internship_start,
            'internship_end'   => $request->internship_end,
        ]);

        $application->load(['division', 'documents']);

        try {
            app(AdminController::class)->evaluateApplicationAlgorithm($application, false);
            $application->refresh();
        } catch (\Throwable $e) {}

        // Send notification
        sendNotification(
            $user->id,
            'Pengajuan Terkirim',
            "Pengajuan magang ke divisi {$division->name} berhasil dikirim. Silakan unggah dokumen yang diperlukan."
        );

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dibuat.',
            'data'    => $application,
        ], 201);
    }

    /**
     * POST /api/v1/applications/{id}/documents
     *
     * Upload documents (CV, cover letter, ID card) for an application.
     */
    public function uploadDocuments(UploadDocumentRequest $request, int $id): JsonResponse
    {
        $user        = $request->user();
        $application = Application::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if (!$application->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Dokumen hanya bisa diunggah saat status pengajuan masih pending.',
            ], 422);
        }

        $uploadedDocs = [];
        $documentTypes = ['cv', 'cover_letter', 'id_card', 'proposal'];

        foreach ($documentTypes as $type) {
            if ($request->hasFile($type)) {
                $file   = $request->file($type);
                $folder = "applications/{$application->id}/{$type}";

                try {
                    $result = $this->storage->upload($file, $folder);

                    // Upsert document record
                    $document = Document::updateOrCreate(
                        [
                            'application_id' => $application->id,
                            'type'           => $type,
                        ],
                        [
                            'file_path' => $result['path'],
                            'file_name' => $result['file_name'],
                        ]
                    );

                    $uploadedDocs[] = $document;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => "Gagal mengunggah {$type}: " . $e->getMessage(),
                    ], 500);
                }
            }
        }

        if (empty($uploadedDocs)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada file yang diunggah. Pilih minimal satu dokumen.',
            ], 422);
        }

        $application->load('documents');

        try {
            app(AdminController::class)->evaluateApplicationAlgorithm($application, false);
            $application->refresh();
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => count($uploadedDocs) . ' dokumen berhasil diunggah.',
            'data'    => [
                'application' => $application,
                'uploaded'    => $uploadedDocs,
            ],
        ]);
    }

    /**
     * DELETE /api/v1/applications/{id}
     *
     * Cancel (rollback) a pending application — used when document upload fails.
     * Force-deletes the application and any partially uploaded documents.
     */
    public function cancelApplication(Request $request, int $id): JsonResponse
    {
        $user        = $request->user();
        $application = Application::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($application->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan tidak bisa dibatalkan karena sudah diproses.',
            ], 422);
        }

        // Hapus dokumen yang sudah terunggah (rollback partial upload)
        foreach ($application->documents as $doc) {
            try {
                if ($doc->file_path) {
                    $this->storage->delete($doc->file_path);
                }
            } catch (\Exception $e) {
                // Abaikan error storage, tetap lanjut hapus dari DB
            }
            $doc->delete();
        }

        // Hapus notifikasi terkait
        Notification::where('user_id', $user->id)
            ->where('message', 'like', '%' . ($application->division->name ?? '') . '%')
            ->where('created_at', '>=', $application->created_at)
            ->delete();

        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dibatalkan.',
        ]);
    }

    /**
     * GET /api/v1/applications/my
     *
     * Get the current user's applications with full details.
     */
    public function myApplications(Request $request): JsonResponse
    {
        $user = $request->user();

        $applications = Application::where('user_id', $user->id)
            ->with(['division', 'recommendedDivision', 'documents'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($app) {
                return [
                    'id'                    => $app->id,
                    'division'              => $app->division,
                    'status'                => $app->status,
                    'institution_name'      => $app->institution_name,
                    'study_program'         => $app->study_program,
                    'internship_start'      => $app->internship_start?->format('Y-m-d'),
                    'internship_end'        => $app->internship_end?->format('Y-m-d'),
                    'is_completed'          => $app->is_completed,
                    'r1_passed'             => $app->r1_passed,
                    'r2_passed'             => $app->r2_passed,
                    'r2_score'              => $app->r2_score,
                    'r3_passed'             => $app->r3_passed,
                    'r4_passed'             => $app->r4_passed,
                    'r4_score'              => $app->r4_score,
                    'algorithm_score'       => $app->algorithm_score,
                    'recommended_division'  => $app->recommendedDivision,
                    'rejection_reason'      => $app->rejection_reason,
                    'documents'             => $app->documents,
                    'created_at'            => $app->created_at,
                    'updated_at'            => $app->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $applications,
        ]);
    }

    /**
     * GET /api/v1/notifications
     *
     * Get all notifications for the current user.
     */
    public function notifications(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $notifications,
        ]);
    }

    /**
     * PATCH /api/v1/notifications/{id}/read
     *
     * Mark a notification as read.
     */
    public function markNotificationRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai sudah dibaca.',
            'data'    => $notification,
        ]);
    }
}
