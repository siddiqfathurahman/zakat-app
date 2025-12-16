<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemohon extends Model
{
    protected $fillable = [
        'nama',
        'permintaan',
        'no_hp',
    ];
}
