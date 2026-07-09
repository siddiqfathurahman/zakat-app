<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealtimeQurban extends Model
{
    protected $fillable = [
        'jenis_hewan',
        'nomor_hewan',
        'status_sembelih',
        'waktu_sembelih',
        'status_potong',
        'waktu_potong',
        'status_timbang',
        'berat_kg',
        'waktu_timbang',
        'catatan',
    ];

    protected $casts = [
        'status_sembelih' => 'boolean',
        'status_potong' => 'boolean',
        'status_timbang' => 'boolean',
        'waktu_sembelih' => 'datetime',
        'waktu_potong' => 'datetime',
        'waktu_timbang' => 'datetime',
    ];
}