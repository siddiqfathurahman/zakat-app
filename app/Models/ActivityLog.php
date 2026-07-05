<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_logs';

    protected $fillable = [
        'user_id',
        'aktivitas',
        'deskripsi',
        'subject_type',
        'subject_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper singkat supaya controller lain tinggal panggil
     * ActivityLog::catat('Menambahkan transaksi', $userId, $deskripsi)
     */
    public static function catat(string $aktivitas, ?int $userId = null, ?string $deskripsi = null, $subject = null): self
    {
        return static::create([
            'user_id' => $userId,
            'aktivitas' => $aktivitas,
            'deskripsi' => $deskripsi,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->id,
        ]);
    }
}
