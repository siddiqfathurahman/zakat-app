<?php

namespace App\Http\Controllers;

use App\Models\Shohibulqurban;
use App\Models\Settingqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ShohibulqurbanController extends Controller
{
    public function index(Request $request)
    {
        $query = Shohibulqurban::query();

        // 🔍 SEARCH (nama / panitia)
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('panitia', 'like', '%' . $request->search . '%');
            });
        }

        // 🐄 FILTER JENIS HEWAN
        if ($request->jenis_hewan) {
            $query->where('jenis_hewan', $request->jenis_hewan);
        }

        // 🔢 FILTER NOMOR HEWAN
        if ($request->nomor_hewan) {
            $query->where('nomor_hewan', $request->nomor_hewan);
        }

        // Apply sort urutan (if requested)
        if ($request->sort_urutan) {
            $query->orderBy('nomor_hewan', $request->sort_urutan);
        }

        $data = $query->latest()->get();
        $setting = Settingqurban::first();

        return Inertia::render('qurban/Shohibul', [
            'shohibulqurbans' => $data,
            'setting' => $setting,

            // kirim state filter ke frontend
            'filters' => $request->only([
                'search',
                'jenis_hewan',
                'nomor_hewan',
                'sort_urutan',
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('qurban/input/shohibul/create');
    }

    public function print(Request $request)
    {
        $query = Shohibulqurban::query();
        $filterInfo = [];

        if ($request->jenis_hewan) {
            $query->where('jenis_hewan', $request->jenis_hewan);
            $filterInfo[] = "Jenis Hewan: " . ucfirst($request->jenis_hewan);
        }
        if ($request->nomor_hewan) {
            $query->where('nomor_hewan', $request->nomor_hewan);
            $filterInfo[] = "Nomor Hewan: " . $request->nomor_hewan;
        }

        if ($request->search) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nama) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(panitia) LIKE ?', ["%{$search}%"]);
            });
            $filterInfo[] = "Pencarian: " . $request->search;
        }

        if ($request->sort_urutan) {
            $query->orderBy('nomor_hewan', $request->sort_urutan);
            $filterInfo[] = "Urutan Nomor: " . ($request->sort_urutan == 'asc' ? 'Kecil ke Besar' : 'Besar ke Kecil');
        } else {
            $query->orderBy('jenis_hewan')->orderBy('nomor_hewan', 'asc');
        }

        $shohibuls = $query->get();

        $stats = [
            'total' => $shohibuls->count(),
            'sapi' => $shohibuls->where('jenis_hewan', 'sapi')->count(),
            'kambing' => $shohibuls->where('jenis_hewan', 'kambing')->count(),
        ];

        return view('print.shohibul-qurban', compact('shohibuls', 'filterInfo', 'stats'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'panitia' => 'required',
            'rt' => 'required',
            'rw' => 'required',
            'jenis_hewan' => 'required',
            'nomor_hewan' => 'required|integer',
        ]);

        // 🔥 validasi sapi max 7 orang
        if ($request->jenis_hewan === 'sapi') {
            $count = Shohibulqurban::where('jenis_hewan', 'sapi')
                ->where('nomor_hewan', $request->nomor_hewan)
                ->count();

            if ($count >= 7) {
                return back()->with('error', 'Sapi sudah penuh (max 7 orang)');
            }
        }

        Shohibulqurban::create($request->all());

        return redirect()->route('shohibul.index')
            ->with('success', 'Data berhasil ditambahkan');
    }


    public function update(Request $request, Shohibulqurban $shohibulqurban)
    {
        $request->validate([
            'nama' => 'required',
            'panitia' => 'required',
        ]);

        $shohibulqurban->update($request->all());

        return redirect()->route('shohibul.index')
            ->with('success', 'Data berhasil diupdate');
    }

    public function destroy(Shohibulqurban $shohibulqurban)
    {
        $shohibulqurban->delete();

        return back()->with('success', 'Data berhasil dihapus');
    }
}