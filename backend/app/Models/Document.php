<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'type',
        'file_path',
        'file_name',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): string
    {
        $path = $this->file_path ?? '';

        // Already a full URL
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // Normalize local storage path (with or without 'local:' prefix)
        $cleanPath = str_starts_with($path, 'local:') ? substr($path, 6) : $path;
        return Storage::disk('public')->url('documents/' . $cleanPath);
    }

    // ─── Relationships ─────────────────────────────────

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
