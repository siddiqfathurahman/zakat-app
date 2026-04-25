<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jatahlembagaqurban extends Model
{
    protected $fillable = [
        'nama_lembaga',
        'jumlah_sapi',
        'jumlah_kambing',
    ];
}
