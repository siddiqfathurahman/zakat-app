<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    use HasFactory;

    protected $table = 'transfers';

    protected $fillable = [
        'nomor_transfer',
        'kas_asal_id',
        'kas_tujuan_id',
        'jumlah',
        'tanggal',
        'keterangan',
        'created_by',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'tanggal' => 'date',
    ];

    public function kasAsal(): BelongsTo
    {
        return $this->belongsTo(Kas::class, 'kas_asal_id');
    }

    public function kasTujuan(): BelongsTo
    {
        return $this->belongsTo(Kas::class, 'kas_tujuan_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
