<?php

namespace App\Http\Controllers;

use App\Models\Formulaqurban;
use App\Models\Penerimaqurban;
use App\Models\RealtimeQurban;
use App\Models\Settingqurban;
use App\Models\Shohibulqurban;
use Inertia\Inertia;

class QurbanHomeController extends Controller
{
    public function index()
    {
        $formula = Formulaqurban::latest()->first();
        $bungkusSapi = $formula->total_bungkus_sapi ?? 0;
        $bungkusKambing = $formula->total_bungkus_kambing ?? 0;

        $kantongStats = [
            [
                'label' => 'Total Kantong',
                'value' => number_format($bungkusSapi + $bungkusKambing, 0, ',', '.').' Bags',
            ],
            [
                'label' => 'Total Kantong Sapi',
                'value' => number_format($bungkusSapi, 0, ',', '.').' Bags',
            ],
            [
                'label' => 'Total Kantong Kambing',
                'value' => number_format($bungkusKambing, 0, ',', '.').' Bags',
            ],
        ];

        $realtime = RealtimeQurban::all();

        $pemotongan = [];
        $penimbangan = [];
        $totalBobotBersih = 0;

        foreach (['sapi' => '#0d4f3c', 'kambing' => '#b8924a'] as $jenis => $color) {
            $group = $realtime->where('jenis_hewan', $jenis);
            $total = $group->count();

            $sembelihCount = $group->where('status_sembelih', true)->count();
            $potongCount = $group->where('status_potong', true)->count();

            $pemotongan[] = [
                'hewan' => ucfirst($jenis),
                'selesai' => $sembelihCount,
                'total' => $total,
                'color' => $color,
                'waktu' => ($total > 0 && $sembelihCount === $total)
                    ? optional($group->max('waktu_sembelih'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
            ];

            $penimbangan[] = [
                'hewan' => ucfirst($jenis),
                'selesai' => $potongCount,
                'total' => $total,
                'satuan' => 'Ekor',
                'color' => $color,
                'waktu' => ($total > 0 && $sembelihCount === $total)
                    ? optional($group->max('waktu_potong'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
            ];

            $totalBobotBersih += $group->sum('berat_kg');
        }

        $shohibul = Shohibulqurban::select('rt', 'status_kirim', 'waktu_kirim')->get();

        $shohibulRT = $shohibul->groupBy('rt')
            ->map(function ($group, $rt) {
                $total = $group->count();
                $terkirim = $group->where('status_kirim', true)->count();

                return [
                    'rt' => 'RT '.$rt,
                    'terkirim' => $terkirim,
                    'total' => $total,
                    'waktu' => ($total > 0 && $terkirim === $total)
                        ? optional($group->max('waktu_kirim'))?->timezone('Asia/Jakarta')->format('H:i')
                        : null,
                ];
            })
            ->sortBy('rt')
            ->values();

        $totalTerkirim = $shohibul->where('status_kirim', true)->count();
        $totalShohibul = $shohibul->count();
        $shohibulProgress = $totalShohibul > 0 ? round(($totalTerkirim / $totalShohibul) * 100) : 0;

        $penerima = Penerimaqurban::select('rt', 'status', 'jatah_sapi', 'jatah_kambing')->get();

        $distribusiRT = $penerima->groupBy('rt')
            ->map(function ($group, $rt) {
                $total = $group->count();
                $sudahAmbil = $group->where('status', 'claimed')->count();

                return [
                    'rt' => 'RT '.$rt,
                    'sapi' => (int) $group->sum('jatah_sapi'),
                    'kambing' => (int) $group->sum('jatah_kambing'),
                    'pct' => $total > 0 ? round(($sudahAmbil / $total) * 100) : 0,
                ];
            })
            ->sortBy('rt')
            ->values();

        $setting = Settingqurban::first();
        $hasilKulit = [
            'nominal' => 'Rp '.number_format($setting->jual_kulit ?? 0, 0, ',', '.'),
        ];
        $noteKulit = $setting ? $setting->note_kulit : '';

        $archives = \App\Models\QurbanArchive::orderBy('tahun', 'desc')->get()->map(function($archive) {
            return [
                'id' => $archive->id,
                'tahun' => $archive->tahun,
                'summary' => $archive->summary_data,
                'created_at' => $archive->created_at->format('d M Y'),
            ];
        });

        return Inertia::render('QurbanHome', [
            'lastUpdate' => now()->timezone('Asia/Jakarta')->translatedFormat('d F Y – H:i').' WIB',
            'kantongStats' => $kantongStats,
            'pemotongan' => $pemotongan,
            'penimbangan' => $penimbangan,
            'totalBobotBersih' => $totalBobotBersih,
            'shohibulProgress' => $shohibulProgress,
            'shohibulRT' => $shohibulRT,
            'totalTerkirim' => $totalTerkirim,
            'totalShohibul' => $totalShohibul,
            'distribusiRT' => $distribusiRT,
            'hasilKulit' => $hasilKulit,
            'noteKulit' => $noteKulit,
            'archives' => $archives,
        ]);
    }
}
