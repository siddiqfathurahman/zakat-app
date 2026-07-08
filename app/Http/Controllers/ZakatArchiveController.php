<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use App\Models\PenerimaZakat;
use App\Models\Pemohon;
use App\Models\FormulaJatah;
use App\Models\LaporanBelanja;
use App\Models\SettingBeras;
use App\Models\ZakatArchive;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class ZakatArchiveController extends Controller
{
    /**
     * Archive the current Zakat data.
     */
    public function archive(Request $request)
    {
        $request->validate([
            'tahun' => 'required|numeric|digits:4',
        ]);

        $tahun = (int) $request->tahun;

        // Check if archive for this year already exists
        if (ZakatArchive::where('tahun', $tahun)->exists()) {
            return redirect()->back()->withErrors(['tahun' => "Arsip data Zakat untuk tahun {$tahun} sudah ada."]);
        }

        // 1. Gather all active data
        $pembayar = PembayarZakat::orderBy('created_at', 'asc')->get();
        $penerima = PenerimaZakat::orderBy('created_at', 'asc')->get();
        $pemohon = Pemohon::orderBy('created_at', 'asc')->get();
        $belanja = LaporanBelanja::orderBy('created_at', 'asc')->get();
        $formula = FormulaJatah::latest()->first();

        // 2. Calculate summary stats
        $totalUang = $pembayar->where('melalui', 'uang')->sum('total');
        $totalBeras = $pembayar->where('melalui', 'beras')->sum('total');
        $totalSodaqoh = $pembayar->sum('sodaqoh');
        $jumlahPembayar = $pembayar->count();
        $jumlahPenerima = $penerima->count();
        $totalBungkus = optional($formula)->jumlah_total_bungkus ?? 0;
        $sisaPembagian = optional($formula)->sisa_pembagian ?? 0;
        $jumlahPemohon = $pemohon->count();
        $totalBelanja = $belanja->sum('total_belanja');

        $summary = [
            'total_uang' => (float) $totalUang,
            'total_beras' => (float) $totalBeras,
            'total_sodaqoh' => (float) $totalSodaqoh,
            'jumlah_pembayar' => (int) $jumlahPembayar,
            'jumlah_penerima' => (int) $jumlahPenerima,
            'total_bungkus' => (int) $totalBungkus,
            'sisa_pembagian' => (int) $sisaPembagian,
            'jumlah_pemohon' => (int) $jumlahPemohon,
            'total_belanja' => (float) $totalBelanja,
        ];

        // 3a. Generate PDF content — versi ADMIN (lengkap, tetap seperti sekarang)
        $pdfAdmin = Pdf::loadView('print.zakat-archive-pdf', [
            'tahun' => $tahun,
            'summary' => $summary,
            'pembayar' => $pembayar,
            'penerima' => $penerima,
            'pemohon' => $pemohon,
            'belanja' => $belanja,
            'formula' => $formula,
        ]);

        // 3b. Generate PDF content — versi PUBLIK (ringkasan + pemohon tanpa data sensitif)
        $pdfPublic = Pdf::loadView('print.zakat-archive-pdf-public', [
            'tahun' => $tahun,
            'summary' => $summary,
            'pemohon' => $pemohon,
        ]);

        $filenameAdmin = "arsip-zakat-{$tahun}-" . time() . ".pdf";
        $filenamePublic = "arsip-zakat-publik-{$tahun}-" . time() . ".pdf";
        $filePathAdmin = "archives/{$filenameAdmin}";
        $filePathPublic = "archives/{$filenamePublic}";

        // 4. Save both PDFs to storage
        Storage::disk('public')->put($filePathAdmin, $pdfAdmin->output());
        Storage::disk('public')->put($filePathPublic, $pdfPublic->output());

        // 5. Database Transaction to save archive & delete active records
        DB::transaction(function () use ($tahun, $filePathAdmin, $filePathPublic, $summary) {
            // Save archive record
            ZakatArchive::create([
                'tahun' => $tahun,
                'file_path' => $filePathAdmin,
                'file_path_public' => $filePathPublic,
                'summary_data' => $summary,
            ]);

            // Delete active tables (DML statements are fully safe inside transactions)
            PembayarZakat::query()->delete();
            PenerimaZakat::query()->delete();
            Pemohon::query()->delete();
            LaporanBelanja::query()->delete();
            DB::table('formula_jatah')->delete();

            // Increment settings year in SettingBeras table
            $setting = SettingBeras::first();
            if ($setting) {
                $setting->update([
                    'tahun' => $tahun + 1,
                ]);
            }

            // Log activity
            ActivityLog::catat(
                "Melakukan pengarsipan data Zakat Fitrah tahun {$tahun} dan mereset data aktif.",
                Auth::id(),
                null,
                null
            );
        });

        return redirect()->back()->with('success', "Data Zakat tahun {$tahun} berhasil diarsipkan dan data aktif telah direset.");
    }

    /**
     * Download the archived PDF file — ADMIN (lengkap).
     */
    public function download($id)
    {
        $archive = ZakatArchive::findOrFail($id);

        if (!Storage::disk('public')->exists($archive->file_path)) {
            abort(404, 'File arsip tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $archive->file_path,
            "Laporan_Arsip_Zakat_Fitrah_{$archive->tahun}.pdf"
        );
    }

    /**
     * Download the archived PDF file — PUBLIK (ringkasan).
     */
    public function downloadPublic($id)
    {
        $archive = ZakatArchive::findOrFail($id);

        if (!$archive->file_path_public || !Storage::disk('public')->exists($archive->file_path_public)) {
            abort(404, 'File arsip ringkasan tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $archive->file_path_public,
            "Laporan_Ringkasan_Zakat_Fitrah_{$archive->tahun}.pdf"
        );
    }

    public function destroy($id)
    {
        $archive = ZakatArchive::findOrFail($id);

        if (Storage::disk('public')->exists($archive->file_path)) {
            Storage::disk('public')->delete($archive->file_path);
        }
        if ($archive->file_path_public && Storage::disk('public')->exists($archive->file_path_public)) {
            Storage::disk('public')->delete($archive->file_path_public);
        }

        $tahun = $archive->tahun;
        $archive->delete();

        ActivityLog::catat(
            "Menghapus arsip Zakat Fitrah tahun {$tahun}.",
            Auth::id(),
            null,
            null
        );

        return redirect()->back()->with('success', "Arsip tahun {$tahun} berhasil dihapus.");
    }
}