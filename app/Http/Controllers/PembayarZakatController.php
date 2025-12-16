<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayarZakatController extends Controller
{
    public function index(Request $request)
    {
        $query = PembayarZakat::query();

        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('panitia', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('rt') && $request->rt) {
            $query->where('rt', $request->rt);
        }

        if ($request->has('rw') && $request->rw) {
            $query->where('rw', $request->rw);
        }

        $pembayarZakat = $query->latest()->get();

        $rtList = PembayarZakat::distinct()->pluck('rt')->sort()->values();
        $rwList = PembayarZakat::distinct()->pluck('rw')->sort()->values();

        return Inertia::render('PembayarZakat', [
            'pembayarZakat' => $pembayarZakat,
            'rtList' => $rtList,
            'rwList' => $rwList,
            'filters' => [
                'search' => $request->search,
                'rt' => $request->rt,
                'rw' => $request->rw,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaPembayar' => 'required|string|max:255',
            'namaPanitia' => 'required|string|max:255',
            'rt' => 'required|string|max:10',
            'rw' => 'required|string|max:10',
            'jumlahJiwa' => 'required|integer|min:1',
            'melalui' => 'required|in:uang,beras',
            'totalBayar' => 'required|numeric|min:0',
            'nilaiPerJiwa' => 'required|numeric|min:0',
            'sodaqoh' => 'nullable|numeric|min:0',
        ]);

        PembayarZakat::create([
            'nama' => $validated['namaPembayar'],
            'panitia' => $validated['namaPanitia'],
            'rt' => $validated['rt'],
            'rw' => $validated['rw'],
            'jumlah_jiwa' => $validated['jumlahJiwa'],
            'melalui' => $validated['melalui'],
            'nilai_per_jiwa' => $validated['nilaiPerJiwa'],
            'total' => $validated['totalBayar'],
            'sodaqoh' => $validated['sodaqoh'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Data zakat berhasil disimpan!');
    }

    public function destroy($id)
    {
        $pembayarZakat = PembayarZakat::findOrFail($id);
        $pembayarZakat->delete();

        return redirect()->back()->with('success', 'Data zakat berhasil dihapus!');
    }
}