<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PembayarZakat extends Model
{
    protected $fillable = [
        'panitia',
        'nama',
        'rt',
        'rw',
        'jumlah_jiwa',
        'melalui',
        'nilai_per_jiwa',
        'total',
        'sodaqoh',
    ];

    protected $casts = [
        'jumlah_jiwa' => 'integer',
        'nilai_per_jiwa' => 'decimal:2',
        'total' => 'decimal:2',
        'sodaqoh' => 'decimal:2',
    ];
}