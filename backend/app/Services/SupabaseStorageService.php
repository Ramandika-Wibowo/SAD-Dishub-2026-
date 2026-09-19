<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Local Document Storage Service
 *
 * Handles file storage operations locally using Laravel's public disk.
 * Retains backward-compatible class name for existing controller dependencies.
 */
class SupabaseStorageService
{
    protected string $disk = 'public';

    public function __construct()
    {
        $this->disk = config('services.local_storage.disk', 'public');
    }

    /**
     * Upload a file to local storage.
     *
     * @return array{path: string, url: string, file_name: string}
     */
    public function upload(UploadedFile $file, string $folder, ?string $fileName = null): array
    {
        $originalName = $file->getClientOriginalName();
        $extension    = $file->getClientOriginalExtension();
        $safeName     = $fileName
            ? "{$fileName}.{$extension}"
            : Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . ".{$extension}";

        $filePath    = trim("{$folder}/{$safeName}", '/');
        $localFolder = 'documents/' . $folder;

        Storage::disk($this->disk)->putFileAs($localFolder, $file, $safeName);

        return [
            'path'      => 'local:' . $filePath,
            'url'       => Storage::disk($this->disk)->url('documents/' . $filePath),
            'file_name' => $originalName,
        ];
    }

    /**
     * Get the public URL for a stored file.
     */
    public function getPublicUrl(string $filePath): string
    {
        $cleanPath = str_starts_with($filePath, 'local:') ? substr($filePath, 6) : $filePath;
        return Storage::disk($this->disk)->url('documents/' . $cleanPath);
    }

    /**
     * Get a signed URL for a stored file (returns public url in local mode).
     */
    public function getSignedUrl(string $filePath, int $expiresIn = 3600): string
    {
        return $this->getPublicUrl($filePath);
    }

    /**
     * Delete a file from local storage.
     */
    public function delete(string $filePath): bool
    {
        $cleanPath = str_starts_with($filePath, 'local:') ? substr($filePath, 6) : $filePath;
        $localPath = 'documents/' . $cleanPath;

        return Storage::disk($this->disk)->delete($localPath);
    }

    /**
     * Upload raw content (e.g. XLSX bytes).
     */
    public function uploadRaw(string $content, string $filePath, string $mimeType): array
    {
        $cleanPath = str_starts_with($filePath, 'local:') ? substr($filePath, 6) : $filePath;
        $localPath = 'documents/' . $cleanPath;

        Storage::disk($this->disk)->put($localPath, $content);

        return [
            'path' => 'local:' . $cleanPath,
            'url'  => Storage::disk($this->disk)->url($localPath),
        ];
    }
}
