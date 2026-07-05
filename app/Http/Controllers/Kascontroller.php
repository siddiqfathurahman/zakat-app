<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use Illuminate\Http\Request;

class KasController extends Controller
{
    /**
     * Quick add kas langsung dari dashboard.
     * Modul Kas lengkap (edit/nonaktifkan/riwayat) menyusul sebagai halaman
     * "Manajemen Kas" tersendiri.
     */
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'jenis' => 'required|in:cash,bank,ewallet,lainnya',
            'saldo' => 'nullable|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $kas = Kas::create([
            'nama' => $validated['nama'],
            'jenis' => $validated['jenis'],
            'saldo' => $validated['saldo'] ?? 0,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => 'active',
            'created_by' => $request->user()?->id,
        ]);

        return back()->with([
            'success' => 'Kas baru berhasil ditambahkan.',
            'kasBaru' => $kas,
        ]);
    }
}