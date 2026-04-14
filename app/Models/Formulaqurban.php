<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formulaqurban extends Model
{
    protected $fillable = [
        'total_bungkus_sapi',
        'total_bungkus_kambing',
        'sisa_pembagian_sapi',
        'sisa_pembagian_kambing',
        'count_1',
        'count_2',
        'count_3',
        'count_4',
        'count_5_plus',
        'count_nonmuslim',
        'sim_sapi_1',
        'sim_kambing_1',
        'sim_sapi_2',
        'sim_kambing_2',
        'sim_sapi_3',
        'sim_kambing_3',
        'sim_sapi_4',
        'sim_kambing_4',
        'sim_sapi_5_plus',
        'sim_kambing_5_plus',
        'sim_sapi_nonmuslim',
        'sim_kambing_nonmuslim',
        'total_sim_sapi_1',
        'total_sim_kambing_1',
        'total_sim_sapi_2',
        'total_sim_kambing_2',
        'total_sim_sapi_3',
        'total_sim_kambing_3',
        'total_sim_sapi_4',
        'total_sim_kambing_4',
        'total_sim_sapi_5_plus',
        'total_sim_kambing_5_plus',
        'total_sim_sapi_nonmuslim',
        'total_sim_kambing_nonmuslim',
        'total_keseluruhan_sapi',
        'total_keseluruhan_kambing',
    ];
}
