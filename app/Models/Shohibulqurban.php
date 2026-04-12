<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shohibulqurban extends Model
{
    protected $table = 'shohibulqurbans';

    protected $fillable = [
        'nama',
        'panitia',
        'rt',
        'rw',
        'nomor_hewan',
        'jenis_hewan',
        'note',
    ];
}
