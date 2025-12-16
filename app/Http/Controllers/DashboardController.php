<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use App\Models\Pemohon;
use App\Models\FormulaJatah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil semua data pembayar zakat
        $pembayarZakat = PembayarZakat::all();
        
        // Hitung total uang (dari yang bayar via uang)
        $totalUang = $pembayarZakat
            ->where('melalui', 'uang')
            ->sum('total');
        
        // Hitung total beras (dari yang bayar via beras)
        $totalBeras = $pembayarZakat
            ->where('melalui', 'beras')
            ->sum('total');
        
        // Hitung total sodaqoh
        $totalSodaqoh = $pembayarZakat->sum('sodaqoh');
        
        // Hitung jumlah pembayar
        $jumlahPembayar = $pembayarZakat->count();
        
        // Hitung jumlah pembayar per metode
        $jumlahBayarUang = $pembayarZakat->where('melalui', 'uang')->count();
        $jumlahBayarBeras = $pembayarZakat->where('melalui', 'beras')->count();
        
        // Hitung persentase uang vs beras
        $totalPembayar = $jumlahBayarUang + $jumlahBayarBeras;
        $persentaseUang = $totalPembayar > 0 ? round(($jumlahBayarUang / $totalPembayar) * 100, 1) : 0;
        $persentaseBeras = $totalPembayar > 0 ? round(($jumlahBayarBeras / $totalPembayar) * 100, 1) : 0;
        
        // Distribusi per RT
        $distribusiRT = PembayarZakat::select('rt', DB::raw('count(*) as jumlah'))
            ->groupBy('rt')
            ->orderBy('rt')
            ->get()
            ->map(function($item) {
                return [
                    'rt' => 'RT ' . str_pad($item->rt, 3, '0', STR_PAD_LEFT),
                    'jumlah' => $item->jumlah
                ];
            });
        
        // Hitung max jumlah untuk persentase bar chart
        $maxJumlah = $distribusiRT->max('jumlah') ?: 1;
        
        $distribusiRW = PembayarZakat::select('rw', DB::raw('count(*) as jumlah'))
            ->groupBy('rw')
            ->orderBy('rw')
            ->get()
            ->map(function($item) {
                return [
                    'rw' => 'RW ' . str_pad($item->rw, 3, '0', STR_PAD_LEFT),
                    'jumlah' => $item->jumlah
                ];
            });

        // Data pemohon dari luar RT/RW
        $jumlahPemohon = Pemohon::count();
        
        // Total permintaan dari pemohon luar
        $totalPermintaanLuar = Pemohon::all()->sum(function($pemohon) {
            $angka = preg_replace('/[^0-9]/', '', $pemohon->permintaan ?? '0');
            return (int) $angka;
        });

        // Ambil data formula jatah terakhir
        $formulaJatah = FormulaJatah::latest()->first();
        $totalBungkus = $formulaJatah ? $formulaJatah->jumlah_total_bungkus : 0;
        $sisaPembagian = $formulaJatah ? $formulaJatah->sisa_pembagian : 0;

        // Data untuk cards
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
            'stats' => $stats,
            'distribusiRT' => $distribusiRT,
            'distribusiRW' => $distribusiRW,
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
            ]
        ]);
    }
}