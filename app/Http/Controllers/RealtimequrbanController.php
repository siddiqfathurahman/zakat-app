<?php

namespace App\Http\Controllers;

use App\Events\RealtimeQurbanUpdated;
use App\Events\ShohibulQurbanDeliveryUpdated;
use App\Models\RealtimeQurban;
use App\Models\Shohibulqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RealtimequrbanController extends Controller
{
    public function index()
    {
        $this->syncEkorFromShohibul();

        $realtime = RealtimeQurban::orderBy('jenis_hewan')->orderBy('nomor_hewan')->get();

        $shohibulPerEkor = Shohibulqurban::selectRaw('jenis_hewan, nomor_hewan, count(*) as jumlah_shohibul')
            ->groupBy('jenis_hewan', 'nomor_hewan')
            ->get()
            ->keyBy(fn ($i) => $i->jenis_hewan.'-'.$i->nomor_hewan);

        $realtime = $realtime->map(function ($r) use ($shohibulPerEkor) {
            $key = $r->jenis_hewan.'-'.$r->nomor_hewan;
            $r->jumlah_shohibul = $shohibulPerEkor[$key]->jumlah_shohibul ?? 0;

            return $r;
        });

        $statsHewan = [];
        foreach (['sapi', 'kambing'] as $jenis) {
            $group = $realtime->where('jenis_hewan', $jenis);
            $total = $group->count();

            $sembelihCount = $group->where('status_sembelih', true)->count();
            $potongCount = $group->where('status_potong', true)->count();
            $timbangCount = $group->where('status_timbang', true)->count();

            $statsHewan[$jenis] = [
                'total' => $total,
                'sembelih' => $sembelihCount,
                'potong' => $potongCount,
                'timbang' => $timbangCount,
                'total_berat' => round($group->sum('berat_kg'), 2),
                'waktu_sembelih' => ($total > 0 && $sembelihCount === $total)
                    ? optional($group->max('waktu_sembelih'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
                'waktu_potong' => ($total > 0 && $potongCount === $total)
                    ? optional($group->max('waktu_potong'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
                'waktu_timbang' => ($total > 0 && $timbangCount === $total)
                    ? optional($group->max('waktu_timbang'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
            ];
        }

        $shohibul = Shohibulqurban::select('id', 'nama', 'panitia', 'rt', 'rw', 'jenis_hewan', 'nomor_hewan', 'status_kirim', 'waktu_kirim')
            ->orderBy('rt')
            ->get();

        $pengirimanPerRT = $shohibul->groupBy('rt')->map(function ($group, $rt) {
            $total = $group->count();
            $terkirim = $group->where('status_kirim', true)->count();

            return [
                'rt' => $rt,
                'total' => $total,
                'terkirim' => $terkirim,
                'waktu_selesai' => ($total > 0 && $terkirim === $total)
                    ? optional($group->max('waktu_kirim'))?->timezone('Asia/Jakarta')->format('H:i')
                    : null,
            ];
        })->sortBy('rt')->values();

        $pengirimanTotal = [
            'total' => $shohibul->count(),
            'terkirim' => $shohibul->where('status_kirim', true)->count(),
        ];

        return Inertia::render('qurban/Realtime', [
            'realtime' => $realtime->values(),
            'statsHewan' => $statsHewan,
            'shohibul' => $shohibul->values(),
            'pengirimanPerRT' => $pengirimanPerRT,
            'pengirimanTotal' => $pengirimanTotal,
        ]);
    }

    // Sinkronkan daftar ekor dari data Shohibul ke tabel realtime_qurbans
    private function syncEkorFromShohibul(): void
    {
        $ekorList = Shohibulqurban::select('jenis_hewan', 'nomor_hewan')->distinct()->get();

        foreach ($ekorList as $ekor) {
            RealtimeQurban::firstOrCreate([
                'jenis_hewan' => $ekor->jenis_hewan,
                'nomor_hewan' => $ekor->nomor_hewan,
            ]);
        }

        // buang data realtime untuk ekor yang sudah tidak ada lagi di Shohibul
        $validKeys = $ekorList->map(fn ($e) => $e->jenis_hewan.'-'.$e->nomor_hewan)->toArray();

        RealtimeQurban::get()->each(function ($r) use ($validKeys) {
            if (! in_array($r->jenis_hewan.'-'.$r->nomor_hewan, $validKeys)) {
                $r->delete();
            }
        });
    }

    public function updateSembelih(RealtimeQurban $realtimeQurban)
    {
        $new = ! $realtimeQurban->status_sembelih;
        $realtimeQurban->update([
            'status_sembelih' => $new,
            'waktu_sembelih' => $new ? now() : null,
        ]);

        RealtimeQurbanUpdated::dispatch($realtimeQurban, 'sembelih');

        return back();
    }

    public function updatePotong(RealtimeQurban $realtimeQurban)
    {
        $new = ! $realtimeQurban->status_potong;
        $realtimeQurban->update([
            'status_potong' => $new,
            'waktu_potong' => $new ? now() : null,
        ]);

        RealtimeQurbanUpdated::dispatch($realtimeQurban, 'potong');

        return back();
    }

    public function updateTimbang(Request $request, RealtimeQurban $realtimeQurban)
    {
        $request->validate(['berat_kg' => 'required|numeric|min:0']);

        $realtimeQurban->update([
            'berat_kg' => $request->berat_kg,
            'status_timbang' => true,
            'waktu_timbang' => now(),
        ]);

        RealtimeQurbanUpdated::dispatch($realtimeQurban, 'timbang');

        return back();
    }

    public function updateKirim(Shohibulqurban $shohibulqurban)
    {
        $new = ! $shohibulqurban->status_kirim;
        $shohibulqurban->update([
            'status_kirim' => $new,
            'waktu_kirim' => $new ? now() : null,
        ]);

        ShohibulQurbanDeliveryUpdated::dispatch($shohibulqurban);

        return back();
    }
}
