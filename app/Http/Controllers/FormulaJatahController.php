<?php

namespace App\Http\Controllers;

use App\Models\FormulaJatah;
use App\Models\PenerimaZakat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class FormulaJatahController extends Controller
{
    public function index()
    {
        // Ambil data jumlah jiwa dari tabel penerima_zakats
        $jiwaStats = DB::table('penerima_zakats')
            ->select(
                DB::raw('COUNT(CASE WHEN jiwa = 1 THEN 1 END) as jiwa_1'),
                DB::raw('COUNT(CASE WHEN jiwa = 2 THEN 1 END) as jiwa_2'),
                DB::raw('COUNT(CASE WHEN jiwa = 3 THEN 1 END) as jiwa_3'),
                DB::raw('COUNT(CASE WHEN jiwa = 4 THEN 1 END) as jiwa_4'),
                DB::raw('COUNT(CASE WHEN jiwa >= 5 THEN 1 END) as jiwa_5_plus')
            )
            ->first();

        // Ambil data formula jatah terakhir atau buat default
        $formulaJatah = FormulaJatah::latest()->first();
        
        if (!$formulaJatah) {
            $formulaJatah = (object)[
                'jumlah_total_bungkus' => 0,
                'sim_jatah_1' => 1,
                'sim_jatah_2' => 2,
                'sim_jatah_3' => 3,
                'sim_jatah_4' => 4,
                'sim_jatah_5_plus' => 5,
            ];
        }

        return Inertia::render('FormulaJatah', [
            'jiwaStats' => $jiwaStats,
            'formulaJatah' => $formulaJatah,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jumlah_total_bungkus' => 'required|integer|min:0',
            'sim_jatah_1' => 'required|integer|min:0',
            'sim_jatah_2' => 'required|integer|min:0',
            'sim_jatah_3' => 'required|integer|min:0',
            'sim_jatah_4' => 'required|integer|min:0',
            'sim_jatah_5_plus' => 'required|integer|min:0',
            'jiwa_1_count' => 'required|integer',
            'jiwa_2_count' => 'required|integer',
            'jiwa_3_count' => 'required|integer',
            'jiwa_4_count' => 'required|integer',
            'jiwa_5_plus_count' => 'required|integer',
        ]);

        // Hitung total sim jatah
        $totalSimJatah1 = $validated['jiwa_1_count'] * $validated['sim_jatah_1'];
        $totalSimJatah2 = $validated['jiwa_2_count'] * $validated['sim_jatah_2'];
        $totalSimJatah3 = $validated['jiwa_3_count'] * $validated['sim_jatah_3'];
        $totalSimJatah4 = $validated['jiwa_4_count'] * $validated['sim_jatah_4'];
        $totalSimJatah5Plus = $validated['jiwa_5_plus_count'] * $validated['sim_jatah_5_plus'];

        $totalKeseluruhan = $totalSimJatah1 + $totalSimJatah2 + $totalSimJatah3 + $totalSimJatah4 + $totalSimJatah5Plus;
        $sisaPembagian = $validated['jumlah_total_bungkus'] - $totalKeseluruhan;

        $formulaJatah = FormulaJatah::create([
            'jumlah_total_bungkus' => $validated['jumlah_total_bungkus'],
            'sisa_pembagian' => $sisaPembagian,
            'jiwa_1_count' => $validated['jiwa_1_count'],
            'jiwa_2_count' => $validated['jiwa_2_count'],
            'jiwa_3_count' => $validated['jiwa_3_count'],
            'jiwa_4_count' => $validated['jiwa_4_count'],
            'jiwa_5_plus_count' => $validated['jiwa_5_plus_count'],
            'sim_jatah_1' => $validated['sim_jatah_1'],
            'sim_jatah_2' => $validated['sim_jatah_2'],
            'sim_jatah_3' => $validated['sim_jatah_3'],
            'sim_jatah_4' => $validated['sim_jatah_4'],
            'sim_jatah_5_plus' => $validated['sim_jatah_5_plus'],
            'total_sim_jatah_1' => $totalSimJatah1,
            'total_sim_jatah_2' => $totalSimJatah2,
            'total_sim_jatah_3' => $totalSimJatah3,
            'total_sim_jatah_4' => $totalSimJatah4,
            'total_sim_jatah_5_plus' => $totalSimJatah5Plus,
            'total_keseluruhan' => $totalKeseluruhan,
        ]);

        // Update jatah di tabel penerima_zakats
        $this->updateJatahPenerima($validated);

        return redirect()->back()->with('success', 'Formula jatah berhasil disimpan!');
    }

    private function updateJatahPenerima($validated)
    {
        // Update jatah untuk jiwa 1
        PenerimaZakat::where('jiwa', 1)->update(['jatah' => $validated['sim_jatah_1']]);
        
        // Update jatah untuk jiwa 2
        PenerimaZakat::where('jiwa', 2)->update(['jatah' => $validated['sim_jatah_2']]);
        
        // Update jatah untuk jiwa 3
        PenerimaZakat::where('jiwa', 3)->update(['jatah' => $validated['sim_jatah_3']]);
        
        // Update jatah untuk jiwa 4
        PenerimaZakat::where('jiwa', 4)->update(['jatah' => $validated['sim_jatah_4']]);
        
        // Update jatah untuk jiwa >= 5
        PenerimaZakat::where('jiwa', '>=', 5)->update(['jatah' => $validated['sim_jatah_5_plus']]);
    }

    public function getLatest()
    {
        $formulaJatah = FormulaJatah::latest()->first();
        
        return response()->json([
            'data' => $formulaJatah
        ]);
    }
}