<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Quick add kategori langsung dari modal "Catat Transaksi".
     * Modul Kategori lengkap (edit/hapus/warna/icon picker) menyusul di step berikutnya.
     */
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'tipe' => 'required|in:income,expense',
        ]);

        $warnaDefault = $validated['tipe'] === 'income' ? '#0F6B4C' : '#C4573B';

        $kategori = Kategori::create([
            'nama' => $validated['nama'],
            'tipe' => $validated['tipe'],
            'warna' => $warnaDefault,
            'created_by' => $request->user()?->id,
        ]);

        return back()->with([
            'success' => 'Kategori berhasil ditambahkan.',
            'kategoriBaru' => $kategori,
        ]);
    }
}
