<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QurbanArchive extends Model
{
    protected $table = 'qurban_archives';

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
