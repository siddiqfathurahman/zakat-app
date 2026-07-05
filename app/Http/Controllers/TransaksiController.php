<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Kas;
use App\Models\Kategori;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaksi::query()->with(['kas:id,nama', 'kategori:id,nama,warna,tipe']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_transaksi', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kas_id')) {
            $query->where('kas_id', $request->kas_id);
        }

        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tanggal_dari')) {
            $query->whereDate('tanggal', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('tanggal', '<=', $request->tanggal_sampai);
        }

        $transaksis = $query->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dashboard/keuangan/Transaksi', [
            'transaksis' => $transaksis,
            'kasList' => Kas::where('status', 'active')->orderBy('nama')->get(['id', 'nama']),
            'kategoriList' => Kategori::orderBy('nama')->get(['id', 'nama', 'tipe', 'warna']),
            'filters' => $request->only([
                'search', 'kas_id', 'kategori_id', 'jenis', 'status', 'tanggal_dari', 'tanggal_sampai',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => 'required|in:income,expense',
            'kas_id' => 'required|exists:kas,id',
            'kategori_id' => 'required|exists:kategori,id',
            'jumlah' => 'required|numeric|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:500',
            'lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $path = null;
            if ($request->hasFile('lampiran')) {
                $path = $request->file('lampiran')->store('bukti-transaksi', 'public');
            }

            $transaksi = Transaksi::create([
                'nomor_transaksi' => 'TRX-' . now()->format('Ymd') . '-' . Str::upper(Str::random(5)),
                'kas_id' => $validated['kas_id'],
                'kategori_id' => $validated['kategori_id'],
                'jenis' => $validated['jenis'],
                'jumlah' => $validated['jumlah'],
                'tanggal' => $validated['tanggal'],
                'keterangan' => $validated['keterangan'] ?? null,
                'lampiran' => $path,
                'status' => 'approved',
                'created_by' => $request->user()?->id,
            ]);

            $this->terapkanSaldo($transaksi, 1);

            ActivityLog::catat(
                'menambahkan transaksi',
                $request->user()?->id,
                $transaksi->nomor_transaksi,
                $transaksi
            );
        });

        return back()->with('success', 'Transaksi berhasil disimpan.');
    }

    public function update(Request $request, Transaksi $transaksi)
    {
        $validated = $request->validate([
            'jenis' => 'required|in:income,expense',
            'kas_id' => 'required|exists:kas,id',
            'kategori_id' => 'required|exists:kategori,id',
            'jumlah' => 'required|numeric|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:500',
            'lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        DB::transaction(function () use ($validated, $request, $transaksi) {
            // balikin efek saldo lama sebelum apply yang baru
            $this->terapkanSaldo($transaksi, -1);

            if ($request->hasFile('lampiran')) {
                if ($transaksi->lampiran) {
                    Storage::disk('public')->delete($transaksi->lampiran);
                }
                $validated['lampiran'] = $request->file('lampiran')->store('bukti-transaksi', 'public');
            }

            $transaksi->update($validated);
            $transaksi->refresh();

            $this->terapkanSaldo($transaksi, 1);

            ActivityLog::catat(
                'mengedit transaksi',
                $request->user()?->id,
                $transaksi->nomor_transaksi,
                $transaksi
            );
        });

        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Request $request, Transaksi $transaksi)
    {
        DB::transaction(function () use ($request, $transaksi) {
            $this->terapkanSaldo($transaksi, -1);

            if ($transaksi->lampiran) {
                Storage::disk('public')->delete($transaksi->lampiran);
            }

            $nomor = $transaksi->nomor_transaksi;
            $transaksi->delete();

            ActivityLog::catat('menghapus transaksi', $request->user()?->id, $nomor);
        });

        return back()->with('success', 'Transaksi berhasil dihapus.');
    }

    /**
     * Terapkan efek transaksi ke saldo kas.
     * $arah: 1 untuk menerapkan, -1 untuk membalikkan (dipakai saat update/delete).
     */
    private function terapkanSaldo(Transaksi $transaksi, int $arah): void
    {
        if ($transaksi->status !== 'approved') {
            return;
        }

        $kas = Kas::lockForUpdate()->find($transaksi->kas_id);
        if (! $kas) {
            return;
        }

        $delta = $transaksi->jenis === 'income'
            ? $transaksi->jumlah * $arah
            : -$transaksi->jumlah * $arah;

        $kas->increment('saldo', $delta);
    }
}
