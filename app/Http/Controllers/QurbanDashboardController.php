<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Formulaqurban;
use App\Models\Shohibulqurban;
use App\Models\Settingqurban;
use App\Models\Penerimaqurban;
use Illuminate\Support\Facades\DB;

class QurbanDashboardController extends Controller
{
    public function index()
    {
        // 1. Total Bungkus (Formulaqurban)
        $formula = Formulaqurban::latest()->first();
        $bungkusSapi = $formula ? $formula->total_bungkus_sapi : 0;
        $bungkusKambing = $formula ? $formula->total_bungkus_kambing : 0;
        $totalBungkus = $bungkusSapi + $bungkusKambing;

        // 2. Jumlah Ekor Hewan (Shohibulqurban)
        $jumlahSapi = Shohibulqurban::where('jenis_hewan', 'sapi')->count();
        $jumlahKambing = Shohibulqurban::whereIn('jenis_hewan', ['kambing', 'domba'])->count();

        // 3. Jatah Masing-masing RT (Penerimaqurban)
        $rtData = Penerimaqurban::select('rt', DB::raw('SUM(jatah_sapi) as sapi'), DB::raw('SUM(jatah_kambing) as kambing'))
            ->groupBy('rt')
            ->orderBy('rt')
            ->get();

        $rtDataFormatted = $rtData->map(function ($item) {
            $rtNumber = $item->rt;

            // Semua penerima di RT ini
            $allPenerima = Penerimaqurban::where('rt', $rtNumber)
                ->orderBy('nama')
                ->get(['nama', 'status', 'jatah_sapi', 'jatah_kambing']);

            $sudahAmbil = $allPenerima->filter(fn($p) => in_array($p->status, ['claimed', 'shohibul']))->values();
            $belumAmbil = $allPenerima->filter(fn($p) => !in_array($p->status, ['claimed', 'shohibul']))->values();

            return [
                'rt'             => 'RT ' . $rtNumber,
                'sapi'           => (int) $item->sapi,
                'kambing'        => (int) $item->kambing,
                'total'          => $allPenerima->count(),
                'sudahAmbil'     => $sudahAmbil->count(),
                'belumAmbil'     => $belumAmbil->count(),
                'listSudah'      => $sudahAmbil->map(fn($p) => ['nama' => $p->nama, 'sapi' => $p->jatah_sapi, 'kambing' => $p->jatah_kambing]),
                'listBelum'      => $belumAmbil->map(fn($p) => ['nama' => $p->nama, 'sapi' => $p->jatah_sapi, 'kambing' => $p->jatah_kambing]),
            ];
        });

        // 4. Hasil Penjualan Kulit (Settingqurban)
        $setting = Settingqurban::first();
        $penjualanKulit = $setting ? $setting->jual_kulit : 0;
        $penjualanKulitFormatted = number_format($penjualanKulit, 0, ',', '.'); 

        return Inertia::render('qurban/Dashboard', [
            'totalBungkus' => $totalBungkus,
            'bungkusSapi' => $bungkusSapi,
            'jumlahSapi' => $jumlahSapi,
            'bungkusKambing' => $bungkusKambing,
            'jumlahKambing' => $jumlahKambing,
            'penjualanKulit' => $penjualanKulitFormatted,
            'rtData' => $rtDataFormatted
        ]);
    }
}
