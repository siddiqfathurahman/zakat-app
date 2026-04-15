<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settingqurban extends Model
{
    protected $table = 'settingqurbans';

    protected $fillable = [
        'jual_kulit',
        'operasional_kambing',
        'tanggal_pengambilan',
        'waktu_pengambilan',
        'tempat_pengambilan',
    ];
}
