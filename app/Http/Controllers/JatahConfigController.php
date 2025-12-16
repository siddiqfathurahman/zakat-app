<?php

namespace App\Http\Controllers;

use App\Models\JatahConfig;
use App\Models\PenerimaZakat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JatahConfigController extends Controller
{
    public function index()
    {
        $configs = JatahConfig::pluck('jatah', 'jiwa')->toArray();
        
        return Inertia::render('PenerimaZakat', [
            'penerimas' => PenerimaZakat::orderBy('created_at', 'desc')->get(),
            'configs' => $configs,
        ]);
    }

    // simpan / update input manual
    public function store(Request $request)
    {
        $request->validate([
            'jatah' => 'required|array',
        ]);

        foreach ($request->jatah as $jiwa => $jatah) {
            JatahConfig::updateOrCreate(
                ['jiwa' => $jiwa],
                ['jatah' => $jatah]
            );
        }

        return redirect()->back()->with('success', 'Konfigurasi jatah disimpan');
    }

    // tombol APPLY ke semua penerima
    public function apply()
    {
        $configs = JatahConfig::pluck('jatah', 'jiwa');

        $penerimas = PenerimaZakat::all();

        foreach ($penerimas as $penerima) {
            $key = $penerima->jiwa >= 5 ? 5 : $penerima->jiwa;

            $penerima->update([
                'jatah' => $configs[$key] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Jatah berhasil diterapkan ke semua penerima');
    }
}

