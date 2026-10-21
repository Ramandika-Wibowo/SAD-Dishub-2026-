<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DecideApplicationRequest;
use App\Http\Requests\Admin\UpdateDivisionRequest;
use App\Models\Application;
use App\Models\Division;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * GET /api/v1/admin/applications
     *
     * List all applications with filters, search, and pagination.
     */
    public function listApplications(Request $request): JsonResponse
    {
        $query = Application::with(['user', 'division', 'documents', 'recommendedDivision']);

        // ─── Filters ───────────────────────────────────
        if ($request->filled('division_id')) {
            $query->where('division_id', $request->division_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('applicant_type')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('applicant_type', $request->applicant_type);
            });
        }

        // ─── Search (by applicant name or email) ───────
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // ─── Sorting ───────────────────────────────────
        $sortField = $request->input('sort', '-created_at');
        $sortDirection = 'desc';

        if (str_starts_with($sortField, '-')) {
            $sortField = substr($sortField, 1);
            $sortDirection = 'desc';
        } else {
            $sortDirection = 'asc';
        }

        $allowedSorts = ['created_at', 'status', 'algorithm_score', 'updated_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $applications = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $applications,
        ]);
    }

    /**
     * GET /api/v1/admin/applications/{id}
    /**
     * Format rule results consistently for both showApplication and executeSort.
     */
    private function formatRuleResults(Application $application, ?array $warnings = null, ?bool $allPassed = null): array
    {
        $threshold = (float) config('services.algorithm.score_threshold', 60);

        $r1Passed       = $application->r1_passed;
        $r2Passed       = $application->r2_passed;
        $r2Score        = $application->r2_score !== null ? round((float) $application->r2_score, 2) : null;
        $r3Passed       = $application->r3_passed;
        $r4Passed       = $application->r4_passed;
        $r4Score        = $application->r4_score !== null ? round((float) $application->r4_score, 2) : null;
        $algorithmScore = $application->algorithm_score !== null ? round((float) $application->algorithm_score, 2) : null;

        $hasCvDetails = !empty(trim($application->skills ?? ''))
            || !empty(trim($application->experience ?? ''))
            || !empty(trim($application->projects ?? ''));

        // Reconstruct warnings if not passed and application was already evaluated
        if ($warnings === null && $r1Passed !== null) {
            $warnings = [];
            if (!$r1Passed) {
                $warnings[] = 'R1 - Dokumen persyaratan belum lengkap';
            }
            if ($r2Passed === false) {
                if (!$hasCvDetails) {
                    $warnings[] = 'R2 - Pelamar belum mengisi detail CV & kualifikasi';
                } else {
                    $warnings[] = "R2 - Skor Detail CV & Kualifikasi ({$r2Score}/100) di bawah ambang batas ({$threshold})";
                }
            }
            if ($r3Passed === false) {
                $warnings[] = 'R3 - Kuota divisi sudah penuh atau terkunci';
            }
            if ($r4Passed === false) {
                $warnings[] = "R4 - Skor kesesuaian Program Studi ({$r4Score}/100) di bawah ambang batas ({$threshold})";
            }
            if ($algorithmScore !== null && $algorithmScore < $threshold) {
                $warnings[] = "Skor kesesuaian akhir ({$algorithmScore}/100) di bawah ambang batas ({$threshold})";
            }
        }

        $r1Detail = null;
        if ($r1Passed !== null) {
            $r1Detail = $r1Passed ? 'Semua dokumen lengkap' : 'Dokumen persyaratan belum lengkap';
        }

        $r2Detail = null;
        if ($r2Passed !== null || $r2Score !== null) {
            if (!$hasCvDetails && ($r2Score === null || $r2Score === 0.0)) {
                $r2Detail = 'Belum mengisi detail CV & kualifikasi (Skor: 0/100)';
            } else {
                $scoreText = $r2Score !== null ? $r2Score : ($r2Passed ? 100 : 0);
                $r2Detail = "Skor: {$scoreText}/100 (threshold: {$threshold})";
            }
        }

        $r3Detail = null;
        if ($r3Passed !== null) {
            $r3Detail = $r3Passed ? 'Kuota tersedia' : 'Kuota divisi penuh atau terkunci';
        }

        $r4Detail = null;
        if ($r4Passed !== null || $r4Score !== null) {
            $scoreText = $r4Score !== null ? $r4Score : ($algorithmScore ?? ($r4Passed ? 100 : 0));
            $r4Detail = "Skor: {$scoreText}/100 (threshold: {$threshold})";
        }

        if ($allPassed === null && $r1Passed !== null) {
            $allPassed = $r1Passed
                && ($r2Passed ?? true)
                && $r3Passed
                && $r4Passed
                && ($algorithmScore === null || $algorithmScore >= $threshold);
        }

        $recommendation = null;
        if ($r1Passed !== null) {
            $recommendation = $allPassed
                ? 'Semua aturan terpenuhi. Disarankan untuk MENERIMA pengajuan ini.'
                : 'Terdapat catatan yang perlu diperhatikan. Silakan tinjau sebelum mengambil keputusan.';
        }

        return [
            'r1_passed'       => $r1Passed,
            'r1_description'  => 'Kelengkapan Dokumen (CV, Surat Pengantar, Kartu Identitas)',
            'r1_detail'       => $r1Detail,
            'r2_passed'       => $r2Passed,
            'r2_description'  => 'Kesesuaian Detail CV & Kualifikasi',
            'r2_detail'       => $r2Detail,
            'r2_score'        => $r2Score,
            'r3_passed'       => $r3Passed,
            'r3_description'  => 'Ketersediaan Kuota Divisi',
            'r3_detail'       => $r3Detail,
            'r4_passed'       => $r4Passed,
            'r4_description'  => 'Kesesuaian Program Studi & Kata Kunci',
            'r4_detail'       => $r4Detail,
            'r4_score'        => $r4Score,
            'algorithm_score' => $algorithmScore,
            'all_passed'      => $allPassed,
            'recommendation'  => $recommendation,
            'warnings'        => $warnings ?? [],
        ];
    }

    /**
     * GET /api/v1/admin/applications/{id}
     *
     * Get full application detail.
     */
    public function showApplication(int $id): JsonResponse
    {
        $application = Application::with([
            'user',
            'division',
            'recommendedDivision',
            'documents',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => [
                'application'  => $application,
                'rule_results' => $this->formatRuleResults($application),
            ],
        ]);
    }

    /**
     * POST /api/v1/admin/applications/{id}/execute-sort
     *
     * Run the rule-based sorting algorithm on a single application.
     * This is for DECISION SUPPORT only — it does NOT auto-reject.
     * Admin makes the final accept/reject decision.
     *
     * R1: Document completeness check
     * R2: CV Details & Qualifications matching (Skills, Pengalaman, Projek)
     * R3: Division quota availability check
     * R4: Study program & academic relevance check
     */
    public function executeSort(int $id): JsonResponse
    {
        $application = Application::with(['documents', 'division', 'user'])->findOrFail($id);

        if (!in_array($application->status, ['pending', 'reviewing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Algoritma hanya dapat dijalankan pada pengajuan berstatus pending atau reviewing.',
            ], 422);
        }

        $warnings = [];
        $threshold = (float) config('services.algorithm.score_threshold', 60);

        // ═══════════════════════════════════════════════
        // R1: Document Completeness
        // ═══════════════════════════════════════════════
        $requiredTypes = ['cv', 'cover_letter', 'id_card'];
        $uploadedTypes = $application->documents->pluck('type')->toArray();
        $missingTypes  = array_diff($requiredTypes, $uploadedTypes);

        $r1Passed = empty($missingTypes);
        if (!$r1Passed) {
            $missingLabels = [
                'cv'           => 'CV',
                'cover_letter' => 'Surat Pengantar',
                'id_card'      => 'Kartu Identitas',
            ];
            $missing = array_map(fn($t) => $missingLabels[$t] ?? $t, $missingTypes);
            $warnings[] = 'R1 - Dokumen belum lengkap: ' . implode(', ', $missing);
        }

        // ═══════════════════════════════════════════════
        // R2: CV Details & Qualifications (Skills, Pengalaman, Projek)
        // ═══════════════════════════════════════════════
        $division = $application->division;
        $hasCvDetails = !empty(trim($application->skills ?? ''))
            || !empty(trim($application->experience ?? ''))
            || !empty(trim($application->projects ?? ''));

        $r2Score = $this->calculateCvScore($application, $division);
        $r2Passed = $hasCvDetails && ($r2Score >= $threshold);

        if (!$hasCvDetails) {
            $warnings[] = 'R2 - Pelamar belum mengisi detail CV & kualifikasi';
        } elseif (!$r2Passed) {
            $warnings[] = "R2 - Skor Detail CV & Kualifikasi ({$r2Score}/100) di bawah ambang batas ({$threshold})";
        }

        // ═══════════════════════════════════════════════
        // R3: Division Quota Availability
        // ═══════════════════════════════════════════════
        $r3Passed = !$division->is_locked && $division->active_applicants < $division->max_quota;

        if (!$r3Passed) {
            $warnings[] = 'R3 - Kuota divisi ' . $division->name . ' sudah penuh atau terkunci';
        }

        // ═══════════════════════════════════════════════
        // R4: Study Program & Academic Relevance
        // ═══════════════════════════════════════════════
        $r4Score = $this->calculateRelevanceScore($application, $division);
        $r4Passed = $r4Score >= $threshold;

        if (!$r4Passed) {
            $warnings[] = "R4 - Skor kesesuaian Program Studi ({$r4Score}/100) di bawah ambang batas ({$threshold})";
        }

        // ═══════════════════════════════════════════════
        // Composite Overall Algorithm Score
        // ═══════════════════════════════════════════════
        if ($hasCvDetails) {
            $finalScore = ($r4Score * 0.4) + ($r2Score * 0.6);
        } else {
            $finalScore = ($r4Score * 0.6) + ($r2Score * 0.4);
        }

        // Base score minimum 30 if valid student/applicant data
        if ($application->study_program && $application->institution_name) {
            $finalScore = max($finalScore, 30.0);
        }
        $finalScore = round(min($finalScore, 100.0), 2);

        if ($finalScore < $threshold) {
            $warnings[] = "Skor kesesuaian akhir ({$finalScore}/100) di bawah ambang batas ({$threshold})";
        }

        // ═══════════════════════════════════════════════
        // Save Results (decision support only, no auto-reject)
        // ═══════════════════════════════════════════════
        $allPassed = $r1Passed && $r2Passed && $r3Passed && $r4Passed && ($finalScore >= $threshold);

        $application->update([
            'r1_passed'       => $r1Passed,
            'r2_passed'       => $r2Passed,
            'r2_score'        => $r2Score,
            'r3_passed'       => $r3Passed,
            'r4_passed'       => $r4Passed,
            'r4_score'        => $r4Score,
            'algorithm_score' => $finalScore,
            'status'          => 'reviewing',
        ]);

        // ─── Notification ─────────────────────────────
        notifyStatusChange($application->user_id, 'reviewing');

        $application->load(['user', 'division', 'documents', 'recommendedDivision']);

        $recommendation = $allPassed
            ? 'Semua aturan terpenuhi. Disarankan untuk MENERIMA pengajuan ini.'
            : 'Terdapat catatan yang perlu diperhatikan. Silakan tinjau sebelum mengambil keputusan.';

        return response()->json([
            'success' => true,
            'message' => 'Evaluasi algoritma selesai. ' . $recommendation,
            'data'    => [
                'application'  => $application,
                'rule_results' => $this->formatRuleResults($application, $warnings, $allPassed),
            ],
        ]);
    }

    /**
     * PATCH /api/v1/admin/applications/{id}/decide
     *
     * Admin final decision: accept or reject.
     */
    public function decideApplication(DecideApplicationRequest $request, int $id): JsonResponse
    {
        $application = Application::with(['user', 'division'])->findOrFail($id);

        if (!in_array($application->status, ['pending', 'reviewing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Keputusan hanya dapat diberikan pada pengajuan berstatus pending atau reviewing.',
            ], 422);
        }

        $decision = $request->decision;

        if ($decision === 'accepted') {
            // ─── Accept ────────────────────────────────
            $divisionId = $request->division_id ?? $application->division_id;
            $division   = Division::findOrFail($divisionId);

            $application->update([
                'status'                  => 'accepted',
                'recommended_division_id' => $divisionId,
                'rejection_reason'        => null,
                'admin_note'              => $request->admin_note,
            ]);

            // Increment active applicants
            $division->increment('active_applicants');

            // R5: Lock check
            $division->evaluateR5();

            // Notification
            $startDateStr = $application->internship_start 
                ? \Carbon\Carbon::parse($application->internship_start)->locale('id')->translatedFormat('d F Y')
                : '';
            notifyStatusChange($application->user_id, 'accepted', $division->name, $request->admin_note ?? '', $startDateStr);

            $message = "Pengajuan diterima di divisi {$division->name}.";

        } else {
            // ─── Reject ────────────────────────────────
            $application->update([
                'status'           => 'rejected',
                'rejection_reason' => $request->rejection_reason,
            ]);

            // Notification
            notifyStatusChange($application->user_id, 'rejected', $request->rejection_reason);

            $message = 'Pengajuan ditolak.';
        }

        $application->load(['user', 'division', 'recommendedDivision', 'documents']);

        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $application,
        ]);
    }

    /**
     * GET /api/v1/admin/divisions
     *
     * List all divisions with quota statistics.
     */
    public function listDivisions(): JsonResponse
    {
        $divisions = Division::all();
        
        $counts = \Illuminate\Support\Facades\DB::table('applications')
            ->select('division_id', 'status', \Illuminate\Support\Facades\DB::raw('count(*) as aggregate'))
            ->groupBy('division_id', 'status')
            ->get()
            ->groupBy('division_id');

        $mapped = $divisions->map(function ($division) use ($counts) {
            $divisionCounts = $counts->get($division->id) ?? collect();
            
            $pending   = $divisionCounts->where('status', 'pending')->first()->aggregate ?? 0;
            $reviewing = $divisionCounts->where('status', 'reviewing')->first()->aggregate ?? 0;
            $accepted  = $divisionCounts->where('status', 'accepted')->first()->aggregate ?? 0;
            $rejected  = $divisionCounts->where('status', 'rejected')->first()->aggregate ?? 0;
            
            return [
                'id'                => $division->id,
                'name'              => $division->name,
                'max_quota'         => $division->max_quota,
                'active_applicants' => $division->active_applicants,
                'remaining_quota'   => $division->remaining_quota,
                'is_locked'         => $division->is_locked,
                'pending_count'     => $pending,
                'reviewing_count'   => $reviewing,
                'accepted_count'    => $accepted,
                'rejected_count'    => $rejected,
                'total_count'       => $pending + $reviewing + $accepted + $rejected,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $mapped,
        ]);
    }

    /**
     * PATCH /api/v1/admin/divisions/{id}
     *
     * Update division quota.
     */
    public function updateDivision(UpdateDivisionRequest $request, Division $division): JsonResponse
    {
        $division->update([
            'max_quota' => $request->max_quota,
        ]);

        // Re-evaluate R5: unlock if quota increased
        $division->evaluateR5();

        return response()->json([
            'success' => true,
            'message' => 'Kuota divisi berhasil diperbarui.',
            'data'    => [
                'id'                => $division->id,
                'name'              => $division->name,
                'max_quota'         => $division->max_quota,
                'active_applicants' => $division->active_applicants,
                'remaining_quota'   => $division->remaining_quota,
                'is_locked'         => $division->is_locked,
            ],
        ]);
    }

    // ═══════════════════════════════════════════════════
    // Private: R4 Keyword Matching Algorithm
    // ═══════════════════════════════════════════════════

    /**
     * Calculate score for Detail CV & Kualifikasi (R2)
     * based on skills, experience, projects, and CV document against target division.
     * Returns score between 0 and 100.
     */
    private function calculateCvScore(Application $application, Division $division): float
    {
        $hasDetails = !empty(trim($application->skills ?? ''))
            || !empty(trim($application->experience ?? ''))
            || !empty(trim($application->projects ?? ''));

        $cvDoc = $application->documents->firstWhere('type', 'cv');

        if (!$hasDetails && !$cvDoc) {
            return 0.0;
        }

        $keywords = [];
        if (!empty($application->skills)) {
            $keywords = array_merge($keywords, $this->extractKeywords($application->skills));
        }
        if (!empty($application->experience)) {
            $keywords = array_merge($keywords, $this->extractKeywords($application->experience));
        }
        if (!empty($application->projects)) {
            $keywords = array_merge($keywords, $this->extractKeywords($application->projects));
        }
        if ($cvDoc) {
            $keywords = array_merge($keywords, $this->extractKeywords($cvDoc->file_name));
        }

        $keywords = array_unique(array_filter($keywords));
        if (empty($keywords)) {
            return 0.0;
        }

        $expandedKeywords = $this->expandWithSynonyms($keywords);

        $divisionKeywords = $this->extractKeywords($division->name);
        $expandedDivisionKeywords = $this->expandWithSynonyms($divisionKeywords);

        if (empty($expandedDivisionKeywords)) {
            return 50.0;
        }

        $matches = 0;
        $maxPossible = count($expandedDivisionKeywords) * 2;

        foreach ($expandedDivisionKeywords as $divKeyword) {
            foreach ($expandedKeywords as $appKeyword) {
                if ($divKeyword === $appKeyword) {
                    $matches += 2;
                } elseif (str_contains($appKeyword, $divKeyword) || str_contains($divKeyword, $appKeyword)) {
                    $matches += 1;
                }
            }
        }

        $matchRatio = min($matches / max($maxPossible, 1), 1.0);
        $cvScore = $matchRatio * 100.0;

        return round(min($cvScore, 100.0), 2);
    }

    /**
     * Calculate score for Program Studi & Kesesuaian Akademik (R4)
     * based on study_program relevance map against target division.
     * Returns score between 0 and 100.
     */
    private function calculateRelevanceScore(Application $application, Division $division): float
    {
        return round($this->getRelevanceMapScore(
            strtolower($application->study_program ?? ''),
            strtolower($division->name)
        ), 2);
    }

    /**
     * Calculate keyword matching score between applicant's profile
     * and the target division.
     *
     * @return float Score between 0 and 100
     */
    private function calculateKeywordScore(Application $application, Division $division): float
    {
        $r4Score = $this->calculateRelevanceScore($application, $division);
        $r2Score = $this->calculateCvScore($application, $division);

        $hasCvDetails = !empty(trim($application->skills ?? ''))
            || !empty(trim($application->experience ?? ''))
            || !empty(trim($application->projects ?? ''));

        if ($hasCvDetails) {
            $finalScore = ($r4Score * 0.4) + ($r2Score * 0.6);
        } else {
            $finalScore = ($r4Score * 0.6) + ($r2Score * 0.4);
        }

        if ($application->study_program && $application->institution_name) {
            $finalScore = max($finalScore, 30.0);
        }

        return round(min($finalScore, 100.0), 2);
    }

    /**
     * Get relevance score based on study program ↔ division mapping.
     * Returns 0-100 score based on how relevant the study program is.
     */
    private function getRelevanceMapScore(string $studyProgram, string $divisionName): float
    {
        // Mapping: divisi Suara Surabaya Media → daftar program studi relevan
        $relevanceMap = [
            'business' => [
                'high' => [
                    'manajemen bisnis', 'administrasi bisnis', 'bisnis digital', 'kewirausahaan',
                    'manajemen', 'ekonomi', 'ilmu ekonomi', 'manajemen pemasaran', 'bisnis internasional',
                    'bisnis', 'entrepreneurship', 'business', 'ekonomi pembangunan', 'manajemen keuangan',
                    'manajemen strategis', 'commerce', 'business administration', 'business management',
                    'digital business', 'international business', 'financial management', 'manajemen retail',
                    'retail management', 'adbis', 'bisnis kreatif', 'creative business', 'pengembangan bisnis',
                    'business development', 'manajemen bisnis telekomunikasi', 'mbti', 'e-commerce',
                    'perdagangan internasional', 'international trade', 'bisnis terapan', 'administrasi niaga',
                    'tata niaga', 'ekonomi bisnis',
                ],
                'medium' => [
                    'akuntansi', 'hubungan internasional', 'ilmu komunikasi', 'administrasi publik',
                    'administrasi negara', 'teknik industri', 'industrial engineering', 'sistem informasi',
                    'information systems', 'statistika', 'statistics', 'keuangan', 'perbankan',
                    'banking and finance', 'manajemen logistik', 'supply chain', 'ilmu administrasi',
                    'ekonomi syariah', 'perbankan syariah', 'manajemen operasional', 'sains data',
                    'data science', 'adpub', 'aktuaris', 'komunikasi bisnis', 'hukum bisnis',
                    'business law', 'manajemen informatika',
                ],
            ],
            'bnd' => [
                'high' => [
                    'manajemen bisnis', 'administrasi bisnis', 'bisnis digital', 'kewirausahaan',
                    'manajemen', 'ekonomi', 'ilmu ekonomi', 'manajemen pemasaran', 'bisnis internasional',
                    'bisnis', 'entrepreneurship', 'business', 'ekonomi pembangunan', 'manajemen keuangan',
                    'manajemen strategis', 'commerce', 'business administration', 'business management',
                    'digital business', 'international business', 'financial management', 'manajemen retail',
                    'retail management', 'adbis', 'bisnis kreatif', 'creative business', 'pengembangan bisnis',
                    'business development', 'manajemen bisnis telekomunikasi', 'mbti', 'e-commerce',
                    'perdagangan internasional', 'international trade', 'bisnis terapan', 'administrasi niaga',
                    'tata niaga', 'ekonomi bisnis',
                ],
                'medium' => [
                    'akuntansi', 'hubungan internasional', 'ilmu komunikasi', 'administrasi publik',
                    'administrasi negara', 'teknik industri', 'industrial engineering', 'sistem informasi',
                    'information systems', 'statistika', 'statistics', 'keuangan', 'perbankan',
                    'banking and finance', 'manajemen logistik', 'supply chain', 'ilmu administrasi',
                    'ekonomi syariah', 'perbankan syariah', 'manajemen operasional', 'sains data',
                    'data science', 'adpub', 'aktuaris', 'komunikasi bisnis', 'hukum bisnis',
                    'business law', 'manajemen informatika',
                ],
            ],
            'new media' => [
                'high' => [
                    'ilmu komunikasi', 'jurnalistik', 'jurnalisme', 'journalism', 'desain komunikasi visual', 'dkv',
                    'multimedia', 'fotografi', 'photography', 'broadcasting', 'penyiaran', 'sastra',
                    'sastra indonesia', 'sastra inggris', 'english literature', 'indonesian literature',
                    'animasi', 'animation', 'film dan televisi', 'film & televisi', 'film', 'televisi',
                    'media digital', 'digital media', 'periklanan', 'advertising', 'komunikasi massa',
                    'mass communication', 'creative writing', 'penulisan kreatif', 'desain grafis',
                    'graphic design', 'jurnalistik online', 'sinematografi', 'cinematography',
                    'produksi media', 'media rekam', 'seni media rekam', 'videografi', 'videography',
                    'video editing', 'motion graphic', 'content creation', 'ilkom', 'penerbitan',
                    'publishing', 'media massa', 'jurnalistik digital', 'komunikasi digital',
                    'creative media', 'desain media digital', 'komunikasi visual', 'visual communication',
                ],
                'medium' => [
                    'teknik informatika', 'sistem informasi', 'rekayasa perangkat lunak', 'rpl',
                    'seni rupa', 'fine arts', 'seni murni', 'desain produk', 'product design',
                    'sosiologi', 'sociology', 'bahasa', 'linguistik', 'linguistics', 'hubungan masyarakat',
                    'public relations', 'humas', 'manajemen komunikasi', 'sastra jepang', 'sastra arab',
                    'sastra perancis', 'pendidikan bahasa', 'antropologi', 'ilmu politik', 'tata kelola media',
                    'teknologi informasi', 'seni visual', 'pendidikan bahasa indonesia', 'pendidikan bahasa inggris',
                    'filsafat', 'studi media', 'media studies', 'copywriting',
                ],
            ],
            'on air' => [
                'high' => [
                    'broadcasting', 'penyiaran', 'penyiaran radio', 'radio', 'radio broadcasting',
                    'ilmu komunikasi', 'jurnalistik', 'jurnalisme', 'teater', 'seni teater',
                    'seni pertunjukan', 'performing arts', 'public relations', 'komunikasi penyiaran',
                    'presenter', 'announcing', 'announcer', 'seni drama tari dan musik', 'sendratasik',
                    'tata vokal', 'seni suara', 'seni musik', 'music', 'audio production', 'produksi siaran',
                    'voice over', 'ilkom', 'komunikasi penyiaran islam', 'kpi', 'public speaking',
                    'penyiar', 'broadcaster', 'voice talent', 'podcasting',
                ],
                'medium' => [
                    'sastra indonesia', 'sastra inggris', 'sastra', 'linguistik', 'bahasa dan sastra',
                    'hubungan masyarakat', 'humas', 'hukum', 'ilmu hukum', 'ilmu politik', 'psikologi',
                    'psychology', 'sosiologi', 'komunikasi massa', 'pariwisata', 'tourism', 'kreatif',
                    'pendidikan bahasa', 'pendidikan seni', 'seni media rekam', 'manajemen komunikasi',
                    'hubungan internasional', 'pendidikan bahasa indonesia', 'pendidikan bahasa inggris', 'studi budaya',
                ],
            ],
            'marketing' => [
                'high' => [
                    'manajemen pemasaran', 'marketing', 'marketing management', 'manajemen',
                    'ilmu komunikasi', 'bisnis digital', 'administrasi bisnis', 'periklanan',
                    'advertising', 'pemasaran', 'komunikasi pemasaran', 'marketing communication',
                    'marcomm', 'sales', 'penjualan', 'digital marketing', 'manajemen penjualan',
                    'business management', 'adbis', 'ilkom', 'brand management', 'manajemen bisnis',
                    'kewirausahaan', 'entrepreneurship', 'commercial management', 'strategic marketing',
                ],
                'medium' => [
                    'ekonomi', 'akuntansi', 'hubungan masyarakat', 'public relations', 'humas',
                    'statistika', 'psikologi', 'administrasi publik', 'administrasi negara',
                    'komunikasi bisnis', 'hubungan internasional', 'manajemen ritel', 'retail management',
                    'perbankan', 'keuangan', 'teknik industri', 'sains data', 'adpub', 'hukum bisnis',
                    'manajemen logistik', 'commerce',
                ],
            ],
            'promotion' => [
                'high' => [
                    'periklanan', 'advertising', 'desain komunikasi visual', 'dkv',
                    'hubungan masyarakat', 'public relations', 'humas', 'ilmu komunikasi',
                    'event management', 'manajemen event', 'manajemen komunikasi', 'kreatif',
                    'promosi', 'brand management', 'marcomm', 'marketing communication',
                    'komunikasi pemasaran', 'creative advertising', 'manajemen promosi',
                    'ilkom', 'public relations and communications', 'media relations',
                    'aktivasi merek', 'brand activation', 'corporate communication',
                ],
                'medium' => [
                    'manajemen pemasaran', 'marketing', 'multimedia', 'pariwisata', 'tourism',
                    'hospitality', 'pariwisata dan perhotelan', 'seni rupa', 'desain grafis',
                    'sastra', 'administrasi bisnis', 'komunikasi massa', 'seni pertunjukan',
                    'teater', 'manajemen bisnis', 'sosiologi', 'adbis', 'broadcasting',
                    'manajemen seni', 'penataan acara',
                ],
            ],
            'teknik' => [
                'high' => [
                    'teknik elektro', 'teknik telekomunikasi', 'teknik informatika',
                    'sistem informasi', 'teknik komputer', 'audio engineering', 'sound engineering',
                    'audio production', 'teknik radio', 'teknologi informasi', 'rekayasa perangkat lunak',
                    'teknik transmisi', 'teknik audio video', 'tav', 'mekatronika', 'elektronika',
                    'teknik elektronika', 'teknik komputer dan jaringan', 'tkj', 'rpl',
                    'computer science', 'information technology', 'electrical engineering',
                    'telecommunication engineering', 'broadcast engineering', 'sistem komputer',
                    'rekayasa sistem komputer', 'teknik informatika dan komputer',
                ],
                'medium' => [
                    'teknik fisika', 'teknik industri', 'multimedia', 'manajemen informatika',
                    'komputerisasi akuntansi', 'sains data', 'data science', 'teknik jaringan',
                    'network engineering', 'sains informasi', 'ilmu komputer', 'cyber security',
                    'keamanan siber', 'teknik otomasi', 'otomasi sistem industri', 'teknik mesin',
                    'instrumentasi', 'teknik mekatronika', 'telekomunikasi',
                ],
            ],
        ];

        // Find matching division in the map
        foreach ($relevanceMap as $divKey => $programs) {
            if (str_contains($divisionName, $divKey)) {
                // Check high relevance (score: 85-100)
                foreach ($programs['high'] as $program) {
                    if (str_contains($studyProgram, $program) || (strlen($studyProgram) >= 3 && str_contains($program, $studyProgram))) {
                        return 95.0;
                    }
                }
                // Check medium relevance (score: 60-80)
                foreach ($programs['medium'] as $program) {
                    if (str_contains($studyProgram, $program) || (strlen($studyProgram) >= 3 && str_contains($program, $studyProgram))) {
                        return 70.0;
                    }
                }
                // Division found but no program match → low relevance
                return 35.0;
            }
        }

        // Division not in map → give neutral score
        return 50.0;
    }

    /**
     * Expand keywords with relevant synonyms and related terms.
     */
    private function expandWithSynonyms(array $keywords): array
    {
        $synonymMap = [
            // Media, Jurnalisme & New Media
            'reporter'        => ['jurnalis', 'wartawan', 'berita', 'peliputan', 'investigasi', 'wawancara', 'media', 'news', 'press', 'reportase'],
            'jurnalis'        => ['reporter', 'wartawan', 'berita', 'redaksi', 'media', 'pers', 'jurnalistik', 'news'],
            'editor'          => ['redaktur', 'editing', 'penyunting', 'naskah', 'tulisan', 'konten', 'video', 'audio', 'copyediting'],
            'fotografer'      => ['fotografi', 'kamera', 'visual', 'foto', 'dokumentasi', 'photo', 'camera', 'lighting', 'hunting'],
            'videografer'     => ['videografi', 'kamera', 'video', 'editing', 'shooting', 'cinematography', 'visual'],
            'media'           => ['jurnalisme', 'broadcasting', 'komunikasi', 'penyiaran', 'digital', 'portal', 'online', 'pers'],
            'sosial'          => ['social', 'media', 'instagram', 'tiktok', 'youtube', 'konten', 'engagement', 'feed', 'reels', 'story'],
            'konten'          => ['content', 'creator', 'kreatif', 'video', 'reels', 'story', 'copywriting', 'creative', 'post', 'feed'],
            'grafis'          => ['desain', 'dkv', 'visual', 'illustrator', 'photoshop', 'infografis', 'canva', 'corel', 'figma', 'banner', 'poster', 'layout'],
            'desain'          => ['grafis', 'dkv', 'visual', 'illustrator', 'photoshop', 'canva', 'figma', 'creative', 'ui', 'ux'],
            'animasi'         => ['animator', 'motion', 'after effects', 'visual', 'grafis', '3d', '2d'],

            // Penyiaran / On Air
            'siaran'          => ['onair', 'radio', 'broadcasting', 'announcer', 'penyiar', 'podcast', 'audio', 'vocal', 'talkshow', 'traffic'],
            'broadcasting'    => ['penyiaran', 'radio', 'siaran', 'onair', 'audio', 'presenter', 'announcer', 'podcast', 'streaming'],
            'radio'           => ['broadcasting', 'siaran', 'onair', 'fm', 'pemancar', 'suara', 'audio', 'frekuensi', 'streaming'],
            'penyiar'         => ['announcer', 'presenter', 'host', 'broadcaster', 'onair', 'radio', 'podcaster', 'mc', 'moderator', 'voice'],
            'presenter'       => ['host', 'penyiar', 'mc', 'announcer', 'moderator', 'broadcaster', 'onair'],
            'audio'           => ['sound', 'suara', 'mixer', 'recording', 'rekaman', 'voice', 'akustik', 'mastering'],
            'suara'           => ['voice', 'audio', 'sound', 'vokal', 'penyiar', 'announcer', 'podcast'],

            // Business & Development (BND)
            'bisnis'          => ['business', 'development', 'kemitraan', 'revenue', 'strategi', 'manajemen', 'kerjasama', 'b2b', 'partnership'],
            'development'     => ['bisnis', 'business', 'pengembangan', 'pertumbuhan', 'inovasi', 'strategi', 'partnership'],
            'kemitraan'       => ['partnership', 'kerjasama', 'bisnis', 'klien', 'sponsor', 'kolaborasi'],
            'manajemen'       => ['administrasi', 'pengelolaan', 'organisasi', 'strategi', 'bisnis', 'operasional'],

            // Marketing & Sales
            'marketing'       => ['pemasaran', 'sales', 'iklan', 'sponsorship', 'klien', 'campaign', 'komersial', 'digital', 'leads', 'revenue'],
            'pemasaran'       => ['marketing', 'sales', 'iklan', 'promosi', 'komersial', 'kampanye', 'pasar'],
            'sales'           => ['penjualan', 'marketing', 'klien', 'closing', 'target', 'komersial', 'revenue'],

            // Promotion & Public Relations
            'promosi'         => ['promotion', 'iklan', 'branding', 'event', 'publikasi', 'aktivasi', 'pameran', 'sosialisasi', 'marcomm'],
            'promotion'       => ['promosi', 'iklan', 'branding', 'event', 'campaign', 'marcomm', 'activation'],
            'iklan'           => ['advertising', 'periklanan', 'sponsorship', 'marketing', 'promosi', 'commercial', 'endorse', 'ads'],
            'advertising'     => ['periklanan', 'iklan', 'ads', 'campaign', 'marketing', 'promosi', 'creative'],
            'event'           => ['acara', 'organizer', 'eo', 'kegiatan', 'aktivasi', 'expo', 'workshop', 'seminar', 'festival'],
            'branding'        => ['brand', 'citra', 'promosi', 'marketing', 'reputasi', 'identitas', 'positioning'],
            'humas'           => ['public relations', 'pr', 'komunikasi', 'relasi', 'media', 'protokoler', 'stakeholder'],

            // Teknik & IT
            'teknik'          => ['engineering', 'elektro', 'telekomunikasi', 'jaringan', 'pemancar', 'it', 'audio', 'hardware', 'maintenance'],
            'elektro'         => ['listrik', 'pemancar', 'transmisi', 'frekuensi', 'perangkat', 'teknik', 'elektronika', 'circuits'],
            'telekomunikasi'  => ['transmisi', 'jaringan', 'pemancar', 'radio', 'frekuensi', 'antena', 'sinyal'],
            'it'              => ['informatika', 'komputer', 'sistem', 'software', 'website', 'aplikasi', 'jaringan', 'network', 'server'],
            'komputer'        => ['informatika', 'sistem', 'software', 'programming', 'teknologi', 'it', 'hardware', 'jaringan'],
            'informasi'       => ['sistem', 'teknologi', 'komputer', 'data', 'digital', 'analisis', 'database'],
            'jaringan'        => ['network', 'lan', 'wifi', 'router', 'switch', 'mikrotik', 'cisco', 'internet', 'server'],
            'transmisi'       => ['pemancar', 'transmitter', 'antena', 'frekuensi', 'broadcast', 'rf', 'repeater'],
            'software'        => ['perangkat lunak', 'aplikasi', 'coding', 'programming', 'developer', 'web', 'sistem'],
        ];

        $expanded = $keywords;
        foreach ($keywords as $keyword) {
            if (isset($synonymMap[$keyword])) {
                $expanded = array_merge($expanded, $synonymMap[$keyword]);
            }
        }

        return array_unique($expanded);
    }

    /**
     * Extract meaningful keywords from a text string.
     * Removes common Indonesian and file-related stop words.
     */
    private function extractKeywords(string $text): array
    {
        // Normalize: lowercase, remove extension, replace separators with spaces
        $text = strtolower($text);
        $text = preg_replace('/\.(pdf|doc|docx|jpg|jpeg|png)$/i', '', $text);
        $text = preg_replace('/[_\-\.\/\\\\]/', ' ', $text);
        $text = preg_replace('/[^a-z0-9\s]/', '', $text);

        $words = preg_split('/\s+/', trim($text));

        // Remove common stop words (Indonesian + generic)
        $stopWords = [
            'dan', 'atau', 'di', 'ke', 'dari', 'yang', 'untuk', 'dengan',
            'pada', 'adalah', 'ini', 'itu', 'akan', 'telah', 'sudah',
            'cv', 'surat', 'file', 'dokumen', 'upload', 'universitas',
            'institut', 'sekolah', 'politeknik', 'akademi', 'bidang', 'upt',
            'the', 'and', 'or', 'of', 'in', 'to', 'a', 'an',
        ];

        $keywords = array_filter($words, function ($word) use ($stopWords) {
            return strlen($word) > 2 && !in_array($word, $stopWords);
        });

        return array_values($keywords);
    }

    /**
     * GET /api/v1/admin/documents/{id}/stream
     *
     * Proxy/stream a document file to the browser from local storage.
     */
    public function streamDocument(int $id): Response
    {
        $document = Document::findOrFail($id);
        $filePath = $document->file_path;

        // Normalize path: strip 'local:' if present
        $cleanPath = str_starts_with($filePath, 'local:') ? substr($filePath, 6) : $filePath;
        $localPath = 'documents/' . $cleanPath;

        if (!Storage::disk('public')->exists($localPath)) {
            abort(404, 'File tidak ditemukan di penyimpanan lokal.');
        }

        $content  = Storage::disk('public')->get($localPath);
        $mimeType = Storage::disk('public')->mimeType($localPath) ?: 'application/octet-stream';

        return response($content, 200, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
            'Cache-Control'       => 'no-store',
        ]);
    }
}
