<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use App\Models\Pemohon;
use App\Models\PenerimaZakat;
use App\Models\FormulaJatah;
use App\Models\SettingBeras;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil semua data pembayar zakat
        $pembayarZakat = PembayarZakat::all();

        // Harga beras (Rp / KG)
        $hargaBeras = optional(SettingBeras::first())->harga_per_kg ?: 1;

        // Total uang (Rp)
        $totalUangRp = $pembayarZakat
            ->where('melalui', 'uang')
            ->sum('total');

        // Total beras (Kg)
        $totalBerasKg = $pembayarZakat
            ->where('melalui', 'beras')
            ->sum('total');

        // Total keseluruhan dalam KG
        $totalAll = $totalBerasKg + ($totalUangRp / $hargaBeras);

        $totalUang = $totalUangRp;
        $totalBeras = $totalBerasKg;
        $totalSodaqoh = $pembayarZakat->sum('sodaqoh');
        $jumlahPembayar = $pembayarZakat->count();

        $jumlahBayarUang = $pembayarZakat->where('melalui', 'uang')->count();
        $jumlahBayarBeras = $pembayarZakat->where('melalui', 'beras')->count();

        $totalPembayar = $jumlahBayarUang + $jumlahBayarBeras;
        $persentaseUang = $totalPembayar > 0
            ? round(($jumlahBayarUang / $totalPembayar) * 100, 1)
            : 0;

        $persentaseBeras = $totalPembayar > 0
            ? round(($jumlahBayarBeras / $totalPembayar) * 100, 1)
            : 0;

        $distribusiRT = PenerimaZakat::select('rt', DB::raw('SUM(jatah) as total_jatah'))
            ->whereNotNull('jatah')
            ->groupBy('rt')
            ->orderBy('rt')
            ->get()
            ->map(function ($item) {
                return [
                    'rt' => 'RT ' . str_pad($item->rt, 2, '0', STR_PAD_LEFT),
                    'jumlah' => (int) $item->total_jatah,
                ];
            });

        $maxJumlah = $distribusiRT->max('jumlah') ?: 1;

        $jumlahPemohon = Pemohon::count();

        $totalPermintaanLuar = Pemohon::all()->sum(function ($pemohon) {
            return (int) preg_replace('/[^0-9]/', '', $pemohon->permintaan ?? '0');
        });

        
        $formulaJatah = FormulaJatah::latest()->first();

        $totalBungkus = optional($formulaJatah)->jumlah_total_bungkus ?? 0;
        $sisaPembagian = optional($formulaJatah)->sisa_pembagian ?? 0;



        // CARD STATS
        $stats = [
            [
                'title' => 'Total Uang',
                'value' => 'Rp ' . number_format($totalUang, 0, ',', '.'),
                'icon' => 'TrendingUp',
                'bgColor' => 'bg-blue-50',
                'iconColor' => 'text-blue-600',
            ],
            [
                'title' => 'Total Beras',
                'value' => number_format($totalBeras, 1, ',', '.') . ' kg',
                'icon' => 'Package',
                'bgColor' => 'bg-amber-50',
                'iconColor' => 'text-amber-600',
            ],
            [
                'title' => 'Total Sodaqoh',
                'value' => 'Rp ' . number_format($totalSodaqoh, 0, ',', '.'),
                'icon' => 'Heart',
                'bgColor' => 'bg-pink-50',
                'iconColor' => 'text-pink-600',
            ],
            [
                'title' => 'Jumlah Pembayar',
                'value' => $jumlahPembayar,
                'icon' => 'Users',
                'bgColor' => 'bg-purple-50',
                'iconColor' => 'text-purple-600',
            ],
        ];

        return Inertia::render('Dashboard', [
            'totalAll' => round($totalAll, 2),
            'stats' => $stats,
            'distribusiRT' => $distribusiRT,
            'maxJumlah' => $maxJumlah,
            'chartData' => [
                'persentaseUang' => $persentaseUang,
                'persentaseBeras' => $persentaseBeras,
                'jumlahBayarUang' => $jumlahBayarUang,
                'jumlahBayarBeras' => $jumlahBayarBeras,
            ],
            'pemohonLuar' => [
                'jumlah' => $jumlahPemohon,
                'totalPermintaan' => $totalPermintaanLuar,
            ],
            'formulaJatah' => [
                'totalBungkus' => $totalBungkus,
                'sisaPembagian' => $sisaPembagian,
            ],
        ]);
    }
}
