<?php

namespace App\Http\Controllers;

use App\Models\Shohibulqurban;
use App\Models\RealtimeQurban;
use App\Models\Penerimaqurban;
use App\Models\Formulaqurban;
use App\Models\Panitiaqurban;
use App\Models\Jatahconfigqurban;
use App\Models\Jatahlembagaqurban;
use App\Models\Settingqurban;
use App\Models\QurbanArchive;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class QurbanArchiveController extends Controller
{
    /**
     * Archive the current Qurban data.
     */
    public function archive(Request $request)
    {
        $request->validate([
            'tahun' => 'required|numeric|digits:4',
        ]);

        $tahun = (int) $request->tahun;

        // Check if archive for this year already exists
        if (QurbanArchive::where('tahun', $tahun)->exists()) {
            return redirect()->back()->withErrors(['tahun' => "Arsip data Qurban untuk tahun {$tahun} sudah ada."]);
        }

        // 1. Gather all active data
        $shohibul = Shohibulqurban::orderBy('created_at', 'asc')->get();
        $realtime = RealtimeQurban::orderBy('created_at', 'asc')->get();
        $penerima = Penerimaqurban::orderBy('created_at', 'asc')->get();
        $formula = Formulaqurban::latest()->first();
        $panitia = Panitiaqurban::orderBy('created_at', 'asc')->get();
        $lembaga = Jatahlembagaqurban::orderBy('created_at', 'asc')->get();
        $configs = Jatahconfigqurban::all();
        $setting = Settingqurban::first();

        // 2. Calculate summary stats
        $bungkusSapi = $formula->total_bungkus_sapi ?? 0;
        $bungkusKambing = $formula->total_bungkus_kambing ?? 0;
        $totalBungkus = $bungkusSapi + $bungkusKambing;

        $jumlahSapi = $shohibul->where('jenis_hewan', 'sapi')->count();
        $jumlahKambing = $shohibul->whereIn('jenis_hewan', ['kambing', 'domba'])->count();

        $totalBobotBersih = $realtime->sum('berat_kg');

        $totalTerkirim = $shohibul->where('status_kirim', true)->count();
        $totalShohibul = $shohibul->count();

        $jualKulit = $setting->jual_kulit ?? 0;
        $noteKulit = $setting->note_kulit ?? '';

        $summary = [
            'total_bungkus' => (int) $totalBungkus,
            'bungkus_sapi' => (int) $bungkusSapi,
            'bungkus_kambing' => (int) $bungkusKambing,
            'jumlah_sapi' => (int) $jumlahSapi,
            'jumlah_kambing' => (int) $jumlahKambing,
            'total_bobot_bersih' => (float) $totalBobotBersih,
            'total_shohibul' => (int) $totalShohibul,
            'total_terkirim' => (int) $totalTerkirim,
            'jual_kulit' => (float) $jualKulit,
            'note_kulit' => $noteKulit,
        ];

        // 3a. Generate PDF content — versi ADMIN (lengkap)
        $pdfAdmin = Pdf::loadView('print.qurban-archive-pdf', [
            'tahun' => $tahun,
            'summary' => $summary,
            'shohibul' => $shohibul,
            'realtime' => $realtime,
            'penerima' => $penerima,
            'formula' => $formula,
            'panitia' => $panitia,
            'lembaga' => $lembaga,
            'configs' => $configs,
            'setting' => $setting,
        ]);

        // 3b. Generate PDF content — versi PUBLIK (ringkasan + bagaikan data di user qurban home)
        $pemotongan = [];
        $penimbangan = [];
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
        }

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

        $pdfPublic = Pdf::loadView('print.qurban-archive-pdf-public', [
            'tahun' => $tahun,
            'summary' => $summary,
            'pemotongan' => $pemotongan,
            'penimbangan' => $penimbangan,
            'shohibulRT' => $shohibulRT,
            'distribusiRT' => $distribusiRT,
        ]);

        $filenameAdmin = "arsip-qurban-{$tahun}-" . time() . ".pdf";
        $filenamePublic = "arsip-qurban-publik-{$tahun}-" . time() . ".pdf";
        $filePathAdmin = "archives/{$filenameAdmin}";
        $filePathPublic = "archives/{$filenamePublic}";

        // Ensure directories exist
        if (!Storage::disk('public')->exists('archives')) {
            Storage::disk('public')->makeDirectory('archives');
        }

        // 4. Save both PDFs to storage
        Storage::disk('public')->put($filePathAdmin, $pdfAdmin->output());
        Storage::disk('public')->put($filePathPublic, $pdfPublic->output());

        // 5. Database Transaction to save archive & delete active records
        DB::transaction(function () use ($tahun, $filePathAdmin, $filePathPublic, $summary) {
            // Save archive record
            QurbanArchive::create([
                'tahun' => $tahun,
                'file_path' => $filePathAdmin,
                'file_path_public' => $filePathPublic,
                'summary_data' => $summary,
            ]);

            // Truncate/delete active tables
            Shohibulqurban::query()->delete();
            RealtimeQurban::query()->delete();
            Penerimaqurban::query()->delete();
            Panitiaqurban::query()->delete();
            Jatahlembagaqurban::query()->delete();
            Formulaqurban::query()->delete();

            // Increment settings year in Settingqurban table
            $setting = Settingqurban::first();
            if ($setting) {
                $setting->update([
                    'tahun' => $tahun + 1,
                ]);
            }

            // Log activity
            ActivityLog::catat(
                "Melakukan pengarsipan data Qurban tahun {$tahun} dan mereset data aktif.",
                Auth::id(),
                null,
                null
            );
        });

        return redirect()->back()->with('success', "Data Qurban tahun {$tahun} berhasil diarsipkan dan data aktif telah direset.");
    }

    /**
     * Download the archived PDF file — ADMIN (lengkap).
     */
    public function download($id)
    {
        $archive = QurbanArchive::findOrFail($id);

        if (!Storage::disk('public')->exists($archive->file_path)) {
            abort(404, 'File arsip tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $archive->file_path,
            "Laporan_Arsip_Qurban_{$archive->tahun}.pdf"
        );
    }

    /**
     * Download the archived PDF file — PUBLIK (ringkasan).
     */
    public function downloadPublic($id)
    {
        $archive = QurbanArchive::findOrFail($id);

        if (!$archive->file_path_public || !Storage::disk('public')->exists($archive->file_path_public)) {
            abort(404, 'File arsip ringkasan tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $archive->file_path_public,
            "Laporan_Ringkasan_Qurban_{$archive->tahun}.pdf"
        );
    }

    /**
     * Delete an archive record and its files.
     */
    public function destroy($id)
    {
        $archive = QurbanArchive::findOrFail($id);

        if (Storage::disk('public')->exists($archive->file_path)) {
            Storage::disk('public')->delete($archive->file_path);
        }
        if ($archive->file_path_public && Storage::disk('public')->exists($archive->file_path_public)) {
            Storage::disk('public')->delete($archive->file_path_public);
        }

        $tahun = $archive->tahun;
        $archive->delete();

        ActivityLog::catat(
            "Menghapus arsip Qurban tahun {$tahun}.",
            Auth::id(),
            null,
            null
        );

        return redirect()->back()->with('success', "Arsip tahun {$tahun} berhasil dihapus.");
    }
}
