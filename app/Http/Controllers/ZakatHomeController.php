<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use App\Models\PenerimaZakat;
use App\Models\FormulaJatah;
use App\Models\SettingBeras;
use App\Models\Pemohon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ZakatHomeController extends Controller
{
    public function index()
    {
        $pembayarZakat = PembayarZakat::all();

        $settingBeras    = SettingBeras::first();
        $hargaBeras      = optional($settingBeras)->harga_per_kg ?: 1;
        $hargaBerasPerKg = (float) (optional($settingBeras)->harga_per_kg ?? 0);
        $hargaPer25Kg    = (float) (optional($settingBeras)->harga_2_5kg ?? 0);

        
        $totalUangRp = $pembayarZakat->where('melalui', 'uang')->sum('total');

        $totalBerasKg = $pembayarZakat->where('melalui', 'beras')->sum('total');

        $totalAllKg = $totalBerasKg + ($totalUangRp / $hargaBeras);

        $jumlahPembayar = $pembayarZakat->count();

        $jumlahBayarUang  = $pembayarZakat->where('melalui', 'uang')->count();
        $jumlahBayarBeras = $pembayarZakat->where('melalui', 'beras')->count();
        $totalPembayar    = $jumlahBayarUang + $jumlahBayarBeras;

        $persentaseUang  = $totalPembayar > 0 ? round(($jumlahBayarUang / $totalPembayar) * 100, 1) : 0;
        $persentaseBeras = $totalPembayar > 0 ? round(($jumlahBayarBeras / $totalPembayar) * 100, 1) : 0;

        $distribusiRT = PenerimaZakat::select('rt', DB::raw('SUM(jatah) as total_jatah'))
            ->whereNotNull('jatah')
            ->groupBy('rt')
            ->orderBy('rt')
            ->get()
            ->map(function ($item) {
                return [
                    'code'  => 'RT ' . str_pad($item->rt, 2, '0', STR_PAD_LEFT),
                    'count' => (int) $item->total_jatah,
                    'label' => 'Bungkus',
                ];
            });

        $totalMustahik = $distribusiRT->sum('count');

        $formulaJatah  = FormulaJatah::latest()->first();
        $totalBungkus  = optional($formulaJatah)->jumlah_total_bungkus ?? 0;
        $sisaPembagian = optional($formulaJatah)->sisa_pembagian ?? 0;

        $totalDisalurkan = optional($formulaJatah)->total_keseluruhan ?? $totalBungkus;
        $kepadaLembaga   = max(0, $totalBungkus - $totalDisalurkan);
        $kepadaJamaah    = max(0, $totalDisalurkan - $kepadaLembaga);

        $fmtRupiah = fn($val) => 'Rp ' . number_format($val, 0, ',', '.');
        $fmtRupiahShort = function ($val) {
            if ($val >= 1_000_000_000) return 'Rp ' . number_format($val / 1_000_000_000, 1, ',', '.') . ' M';
            if ($val >= 1_000_000)     return 'Rp ' . number_format($val / 1_000_000, 1, ',', '.') . ' Jt';
            return 'Rp ' . number_format($val, 0, ',', '.');
        };

        $pemohon = Pemohon::all();


        return Inertia::render('ZakatHome', [
            'hargaBeras' => [
                'per_kg'    => (float) $hargaBerasPerKg,
                'per_2_5kg' => (float) $hargaPer25Kg,
            ],

            'stats' => [
                'totalBerasKg'    => round($totalBerasKg, 1),
                'totalUangRp'     => (float) $totalUangRp,
                'totalUangLabel'  => $fmtRupiahShort($totalUangRp),
                'totalAllKg'      => round($totalAllKg, 2),
                'totalAllLabel'   => number_format($totalAllKg / 1000, 2, ',', '.') . ' Ton',
                'jumlahPembayar'  => $jumlahPembayar,
            ],

            'paymentMethod' => [
                ['label' => 'Pembayaran Beras', 'value' => $persentaseBeras, 'color' => '#0d4f3c'],
                ['label' => 'Pembayaran Uang',  'value' => $persentaseUang,  'color' => '#b8924a'],
            ],

            'mustahikData'  => $distribusiRT->values()->toArray(),
            'totalMustahik' => $totalMustahik,

            'distribusi' => [
                'totalBungkus'   => $totalBungkus,
                'kepadaJamaah'   => $kepadaJamaah,
                'kepadaLembaga'  => $kepadaLembaga,
                'sisaPembagian'  => $sisaPembagian,
            ],

            'pemohon' => $pemohon,
        ]);
    }
}
