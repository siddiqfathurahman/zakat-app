<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormulaJatah extends Model
{
    protected $table = 'formula_jatah';

    protected $fillable = [
        'jumlah_total_bungkus',
        'sisa_pembagian',
        'jiwa_1_count',
        'jiwa_2_count',
        'jiwa_3_count',
        'jiwa_4_count',
        'jiwa_5_plus_count',
        'sim_jatah_1',
        'sim_jatah_2',
        'sim_jatah_3',
        'sim_jatah_4',
        'sim_jatah_5_plus',
        'total_sim_jatah_1',
        'total_sim_jatah_2',
        'total_sim_jatah_3',
        'total_sim_jatah_4',
        'total_sim_jatah_5_plus',
        'total_keseluruhan',
    ];

    protected $casts = [
        'jumlah_total_bungkus' => 'integer',
        'sisa_pembagian' => 'integer',
        'jiwa_1_count' => 'integer',
        'jiwa_2_count' => 'integer',
        'jiwa_3_count' => 'integer',
        'jiwa_4_count' => 'integer',
        'jiwa_5_plus_count' => 'integer',
        'sim_jatah_1' => 'integer',
        'sim_jatah_2' => 'integer',
        'sim_jatah_3' => 'integer',
        'sim_jatah_4' => 'integer',
        'sim_jatah_5_plus' => 'integer',
        'total_sim_jatah_1' => 'integer',
        'total_sim_jatah_2' => 'integer',
        'total_sim_jatah_3' => 'integer',
        'total_sim_jatah_4' => 'integer',
        'total_sim_jatah_5_plus' => 'integer',
        'total_keseluruhan' => 'integer',
    ];
}