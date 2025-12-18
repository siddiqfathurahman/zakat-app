<?php

namespace App\Http\Controllers;

use App\Models\LaporanBelanja;
use App\Models\PembayarZakat;
use App\Models\SettingBeras;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanBelanjaController extends Controller
{
    public function index()
    {
        // Hitung total uang masuk dari pembayar zakat yang melalui UANG
        $totalUangMasuk = PembayarZakat::where('melalui', 'uang')
            ->sum('total');

        // Hitung total yang sudah dibelanjakan
        $totalDibelanjakan = LaporanBelanja::sum('total_belanja');

        // Hitung uang yang belum dibelanjakan
        $uangBelumBelanjakan = $totalUangMasuk - $totalDibelanjakan;

        // Ambil setting beras
        $settingBeras = SettingBeras::first();
        
        // Hitung rekomendasi jumlah sak yang bisa dibeli
        $rekomendasiSak = 0;
        if ($settingBeras && $settingBeras->harga_sak > 0) {
            $rekomendasiSak = floor($uangBelumBelanjakan / $settingBeras->harga_sak);
        }

        // Ambil history pembelian
        $historyPembelian = LaporanBelanja::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('LaporanBelanja', [
            'totalUangMasuk' => $totalUangMasuk,
            'totalDibelanjakan' => $totalDibelanjakan,
            'uangBelumBelanjakan' => $uangBelumBelanjakan,
            'rekomendasiSak' => $rekomendasiSak,
            'settingBeras' => $settingBeras,
            'historyPembelian' => $historyPembelian,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'panitia' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'jumlah_sak' => 'required|integer|min:1',
            'harga_per_sak' => 'required|numeric|min:0',
        ]);

        $settingBeras = SettingBeras::first();
        
        // Hitung total uang masuk
        $totalUangMasuk = PembayarZakat::where('melalui', 'uang')->sum('total');
        
        // Hitung total yang sudah dibelanjakan
        $totalDibelanjakan = LaporanBelanja::sum('total_belanja');
        
        // Hitung total belanja baru
        $totalBelanjaBaru = $validated['jumlah_sak'] * $validated['harga_per_sak'];
        
        // Hitung sisa uang setelah pembelian ini
        $sisaUang = $totalUangMasuk - ($totalDibelanjakan + $totalBelanjaBaru);

        if ($sisaUang < 0) {
            return redirect()->back()->withErrors([
                'error' => 'Uang tidak mencukupi untuk pembelian ini!'
            ]);
        }

        LaporanBelanja::create([
            'panitia' => $validated['panitia'],
            'tanggal' => $validated['tanggal'],
            'jumlah_sak' => $validated['jumlah_sak'],
            'harga_per_sak' => $validated['harga_per_sak'],
            'total_belanja' => $totalBelanjaBaru,
            'nama_penjual' => $settingBeras ? $settingBeras->toko : '-',
            'sisa_uang' => $sisaUang,
        ]);

        return redirect()->back()->with('success', 'Pembelian beras berhasil dicatat!');
    }

    public function update(Request $request, $id)
    {
        $laporanBelanja = LaporanBelanja::findOrFail($id);

        $validated = $request->validate([
            'panitia' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'jumlah_sak' => 'required|integer|min:1',
            'harga_per_sak' => 'required|numeric|min:0',
        ]);

        // Hitung total uang masuk
        $totalUangMasuk = PembayarZakat::where('melalui', 'uang')->sum('total');
        
        // Hitung total yang sudah dibelanjakan (TANPA data yang sedang di-edit)
        $totalDibelanjakan = LaporanBelanja::where('id', '!=', $id)->sum('total_belanja');
        
        // Hitung total belanja baru
        $totalBelanjaBaru = $validated['jumlah_sak'] * $validated['harga_per_sak'];
        
        // Hitung sisa uang setelah update
        $sisaUang = $totalUangMasuk - ($totalDibelanjakan + $totalBelanjaBaru);

        // Validasi: pastikan uang cukup
        if ($sisaUang < 0) {
            return redirect()->back()->withErrors([
                'error' => 'Uang tidak mencukupi untuk pembelian ini!'
            ]);
        }

        // Ambil setting beras untuk nama penjual
        $settingBeras = SettingBeras::first();

        $laporanBelanja->update([
            'panitia' => $validated['panitia'],
            'tanggal' => $validated['tanggal'],
            'jumlah_sak' => $validated['jumlah_sak'],
            'harga_per_sak' => $validated['harga_per_sak'],
            'total_belanja' => $totalBelanjaBaru,
            'nama_penjual' => $settingBeras ? $settingBeras->toko : $laporanBelanja->nama_penjual,
            'sisa_uang' => $sisaUang,
        ]);

        return redirect()->back()->with('success', 'Data pembelian berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $laporanBelanja = LaporanBelanja::findOrFail($id);
        $laporanBelanja->delete();

        return redirect()->back()->with('success', 'Data pembelian berhasil dihapus!');
    }
}