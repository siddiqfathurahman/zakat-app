<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ZakatArchive extends Model
{
    protected $table = 'zakat_archives';

    protected $fillable = [
        'tahun',
        'file_path',
        'file_path_public',
        'summary_data',
    ];

    protected $casts = [
        'summary_data' => 'array',
    ];
}