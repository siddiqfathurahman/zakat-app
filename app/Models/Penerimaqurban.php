<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penerimaqurban extends Model
{
    protected $fillable = [
        'nama',
        'rt',
        'rw',
        'agama',                                                                                                                                                                           
        'jiwa',
        'jatah_sapi',
        'jatah_kambing',
        'kode_unik',
        'qr_code',
        'status',
    ];
}
