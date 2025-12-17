<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingBeras extends Model
{
    protected $table = 'setting_beras';

    protected $fillable = [
        'toko',
        'harga_per_kg',
        'harga_2_5kg',
        'harga_sak',
    ];
}

