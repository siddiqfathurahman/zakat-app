<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settingqurban extends Model
{
    protected $table = 'settingqurbans';

    protected $fillable = [
        'jual_kulit',
        'note_kulit',
        'tahun',
        'operasional_kambing',
        'tanggal_pengambilan',
        'waktu_pengambilan',
        'tempat_pengambilan',
        'printer_connected',
        'printer_name',
    ];
}
