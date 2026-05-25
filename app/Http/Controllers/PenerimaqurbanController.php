<?php

namespace App\Http\Controllers;

use App\Models\Penerimaqurban;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PenerimaqurbanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Penerimaqurban::latest()->get();
        // pass the configs collection as is so we can filter by kategori
        $configs = \App\Models\Jatahconfigqurban::all();
        $setting = \App\Models\Settingqurban::first();

        return Inertia::render('qurban/PenerimaQurban', [
            'penerimas' => $data,
            'configs' => $configs,
            'setting' => $setting
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'rt' => 'required|string|max:5',
            'rw' => 'required|string|max:5',
            'agama' => 'required|in:muslim,nonmuslim',
            'jiwa' => 'required|integer|min:1',
            'jatah_sapi' => 'nullable|integer|min:0',
            'jatah_kambing' => 'nullable|integer|min:0',
        ]);

        $rt = str_pad($validated['rt'], 2, '0', STR_PAD_LEFT);
        $rw = str_pad($validated['rw'], 2, '0', STR_PAD_LEFT);

        // Ambil kode terakhir berdasarkan RT & RW
        $lastKode = Penerimaqurban::where('rt', $validated['rt'])
            ->where('rw', $validated['rw'])
            ->orderByDesc('kode_unik')
            ->value('kode_unik');

        $nomor = 1;

        // Ambil angka terakhir dari kode_unik
        if ($lastKode && preg_match('/-(\d+)$/', $lastKode, $match)) {
            $nomor = ((int) $match[1]) + 1;
        }

        // Pastikan benar-benar unik
        do {
            $noUrut = str_pad($nomor, 3, '0', STR_PAD_LEFT);
            $kodeUnik = "QURBAN-{$rt}{$rw}-{$noUrut}";

            $exists = Penerimaqurban::where('kode_unik', $kodeUnik)->exists();

            $nomor++;
        } while ($exists);

        $validated['kode_unik'] = $kodeUnik;

        Penerimaqurban::create($validated);

        return redirect()->back()->with('success', 'Data berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Penerimaqurban $penerimaqurban)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'rt' => 'sometimes|string|max:5',
            'rw' => 'sometimes|string|max:5',
            'agama' => 'sometimes|in:muslim,nonmuslim',
            'jiwa' => 'sometimes|integer|min:1',
            'jatah_sapi' => 'nullable|integer|min:0',
            'jatah_kambing' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:pending,claimed,shohibul',
        ]);

        $penerimaqurban->update($validated);

        return redirect()->back()->with('success', 'Data berhasil diupdate');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Penerimaqurban $penerimaqurban)
    {
        $penerimaqurban->delete();

        return redirect()->back()->with('success', 'Data berhasil dihapus');
    }

    /**
     * Print daftar penerima (blade view)
     */
    public function print(Request $request)
    {
        $query = Penerimaqurban::query();

        // Filter RT
        if ($request->filled('rt')) {
            $query->where('rt', $request->rt);
        }

        // Filter agama
        if ($request->filled('agama')) {
            $query->where('agama', $request->agama);
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $penerimas = $query->orderBy('rt')->orderBy('agama')->get();

        // Build filter info labels
        $filterInfo = [];
        if ($request->filled('rt'))     $filterInfo[] = 'RT ' . $request->rt;
        if ($request->filled('agama'))  $filterInfo[] = ucfirst($request->agama);
        if ($request->filled('status')) {
            $statusLabel = ['pending' => 'Belum Diambil', 'claimed' => 'Sudah Diambil', 'shohibul' => 'Shohibul'];
            $filterInfo[] = $statusLabel[$request->status] ?? $request->status;
        }

        return view('print.penerima-qurban', compact('penerimas', 'filterInfo'));
    }

    /**
     * 🔥 Scan QR (untuk fetch data via AJAX dari React)
     */
    public function scan($kode)
    {
        $penerima = Penerimaqurban::where('kode_unik', $kode)->first();

        if (!$penerima) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json($penerima);
    }

    /**
     * 🔥 Claim (update status)
     */
    public function claim($kode)
    {
        $penerima = Penerimaqurban::where('kode_unik', $kode)->first();

        if (!$penerima) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        if ($penerima->status === 'claimed') {
            return response()->json(['message' => 'Sudah diambil'], 400);
        }

        $penerima->update([
            'status' => 'claimed'
        ]);

        return response()->json([
            'message' => 'Berhasil diambil',
            'data' => $penerima
        ]);
    }

    /**
     * Cetak Surat Keterangan Qurban
     */
    public function suratKeterangan($id)
    {
        $penerima = Penerimaqurban::findOrFail($id);
        $setting = \App\Models\Settingqurban::first();
        
        return view('print.surat-keterangan', compact('penerima', 'setting'));
    }
}