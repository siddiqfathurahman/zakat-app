<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanBelanja extends Model
{
    protected $fillable = [
        'panitia',
        'tanggal',
        'jumlah_sak',
        'harga_per_sak',
        'total_belanja',
        'nama_penjual',
        'sisa_uang',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'harga_per_sak' => 'decimal:2',
        'total_belanja' => 'decimal:2',
        'sisa_uang' => 'decimal:2',
    ];
}