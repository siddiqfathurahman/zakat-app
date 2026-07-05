<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kas extends Model
{
    use HasFactory;

    protected $table = 'kas';

    protected $fillable = [
        'nama',
        'jenis',
        'saldo',
        'deskripsi',
        'status',
        'created_by',
    ];

    protected $casts = [
        'saldo' => 'decimal:2',
    ];

    public function transaksis(): HasMany
    {
        return $this->hasMany(Transaksi::class, 'kas_id');
    }

    public function transferKeluar(): HasMany
    {
        return $this->hasMany(Transfer::class, 'kas_asal_id');
    }

    public function transferMasuk(): HasMany
    {
        return $this->hasMany(Transfer::class, 'kas_tujuan_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
