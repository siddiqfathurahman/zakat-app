<?php

namespace App\Http\Controllers;

use App\Models\Formulaqurban;
use App\Models\Penerimaqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class FormulaqurbanController extends Controller
{
    public function index()
    {
        // Get population counts
        $jiwaStats = DB::table('penerimaqurbans')
            ->select(
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "muslim" AND jiwa = 1 THEN 1 END) as count_1'),
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "muslim" AND jiwa = 2 THEN 1 END) as count_2'),
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "muslim" AND jiwa = 3 THEN 1 END) as count_3'),
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "muslim" AND jiwa = 4 THEN 1 END) as count_4'),
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "muslim" AND jiwa >= 5 THEN 1 END) as count_5_plus'),
                DB::raw('COUNT(CASE WHEN status != "shohibul" AND agama = "nonmuslim" THEN 1 END) as count_nonmuslim')
            )
            ->first();

        $formulaqurban = Formulaqurban::latest()->first();

        if (!$formulaqurban) {
            $formulaqurban = (object)[
                'total_bungkus_sapi' => 0,
                'total_bungkus_kambing' => 0,
                'sisa_pembagian_sapi' => 0,
                'sisa_pembagian_kambing' => 0,
                'sim_sapi_1' => 0,
                'sim_kambing_1' => 0,
                'sim_sapi_2' => 0,
                'sim_kambing_2' => 0,
                'sim_sapi_3' => 0,
                'sim_kambing_3' => 0,
                'sim_sapi_4' => 0,
                'sim_kambing_4' => 0,
                'sim_sapi_5_plus' => 0,
                'sim_kambing_5_plus' => 0,
                'sim_sapi_nonmuslim' => 0,
                'sim_kambing_nonmuslim' => 0,
            ];
        }

        return Inertia::render('qurban/FormulaQurban', [
            'jiwaStats' => $jiwaStats,
            'formulaQurban' => $formulaqurban,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_bungkus_sapi' => 'required|integer|min:0',
            'total_bungkus_kambing' => 'required|integer|min:0',
            'sim_sapi_1' => 'required|integer|min:0',
            'sim_kambing_1' => 'required|integer|min:0',
            'sim_sapi_2' => 'required|integer|min:0',
            'sim_kambing_2' => 'required|integer|min:0',
            'sim_sapi_3' => 'required|integer|min:0',
            'sim_kambing_3' => 'required|integer|min:0',
            'sim_sapi_4' => 'required|integer|min:0',
            'sim_kambing_4' => 'required|integer|min:0',
            'sim_sapi_5_plus' => 'required|integer|min:0',
            'sim_kambing_5_plus' => 'required|integer|min:0',
            'sim_sapi_nonmuslim' => 'required|integer|min:0',
            'sim_kambing_nonmuslim' => 'required|integer|min:0',
            'count_1' => 'required|integer',
            'count_2' => 'required|integer',
            'count_3' => 'required|integer',
            'count_4' => 'required|integer',
            'count_5_plus' => 'required|integer',
            'count_nonmuslim' => 'required|integer',
        ]);

        // Calculate Sapi
        $totalSapi1 = $validated['count_1'] * $validated['sim_sapi_1'];
        $totalSapi2 = $validated['count_2'] * $validated['sim_sapi_2'];
        $totalSapi3 = $validated['count_3'] * $validated['sim_sapi_3'];
        $totalSapi4 = $validated['count_4'] * $validated['sim_sapi_4'];
        $totalSapi5 = $validated['count_5_plus'] * $validated['sim_sapi_5_plus'];
        $totalSapiNon = $validated['count_nonmuslim'] * $validated['sim_sapi_nonmuslim'];
        
        $totalKeseluruhanSapi = $totalSapi1 + $totalSapi2 + $totalSapi3 + $totalSapi4 + $totalSapi5 + $totalSapiNon;
        $sisaSapi = $validated['total_bungkus_sapi'] - $totalKeseluruhanSapi;

        // Calculate Kambing
        $totalKambing1 = $validated['count_1'] * $validated['sim_kambing_1'];
        $totalKambing2 = $validated['count_2'] * $validated['sim_kambing_2'];
        $totalKambing3 = $validated['count_3'] * $validated['sim_kambing_3'];
        $totalKambing4 = $validated['count_4'] * $validated['sim_kambing_4'];
        $totalKambing5 = $validated['count_5_plus'] * $validated['sim_kambing_5_plus'];
        $totalKambingNon = $validated['count_nonmuslim'] * $validated['sim_kambing_nonmuslim'];

        $totalKeseluruhanKambing = $totalKambing1 + $totalKambing2 + $totalKambing3 + $totalKambing4 + $totalKambing5 + $totalKambingNon;
        $sisaKambing = $validated['total_bungkus_kambing'] - $totalKeseluruhanKambing;

        $formulaqurban = Formulaqurban::create([
            'total_bungkus_sapi' => $validated['total_bungkus_sapi'],
            'total_bungkus_kambing' => $validated['total_bungkus_kambing'],
            'sisa_pembagian_sapi' => $sisaSapi,
            'sisa_pembagian_kambing' => $sisaKambing,
            'count_1' => $validated['count_1'],
            'count_2' => $validated['count_2'],
            'count_3' => $validated['count_3'],
            'count_4' => $validated['count_4'],
            'count_5_plus' => $validated['count_5_plus'],
            'count_nonmuslim' => $validated['count_nonmuslim'],
            'sim_sapi_1' => $validated['sim_sapi_1'],
            'sim_kambing_1' => $validated['sim_kambing_1'],
            'sim_sapi_2' => $validated['sim_sapi_2'],
            'sim_kambing_2' => $validated['sim_kambing_2'],
            'sim_sapi_3' => $validated['sim_sapi_3'],
            'sim_kambing_3' => $validated['sim_kambing_3'],
            'sim_sapi_4' => $validated['sim_sapi_4'],
            'sim_kambing_4' => $validated['sim_kambing_4'],
            'sim_sapi_5_plus' => $validated['sim_sapi_5_plus'],
            'sim_kambing_5_plus' => $validated['sim_kambing_5_plus'],
            'sim_sapi_nonmuslim' => $validated['sim_sapi_nonmuslim'],
            'sim_kambing_nonmuslim' => $validated['sim_kambing_nonmuslim'],
            'total_sim_sapi_1' => $totalSapi1,
            'total_sim_kambing_1' => $totalKambing1,
            'total_sim_sapi_2' => $totalSapi2,
            'total_sim_kambing_2' => $totalKambing2,
            'total_sim_sapi_3' => $totalSapi3,
            'total_sim_kambing_3' => $totalKambing3,
            'total_sim_sapi_4' => $totalSapi4,
            'total_sim_kambing_4' => $totalKambing4,
            'total_sim_sapi_5_plus' => $totalSapi5,
            'total_sim_kambing_5_plus' => $totalKambing5,
            'total_sim_sapi_nonmuslim' => $totalSapiNon,
            'total_sim_kambing_nonmuslim' => $totalKambingNon,
            'total_keseluruhan_sapi' => $totalKeseluruhanSapi,
            'total_keseluruhan_kambing' => $totalKeseluruhanKambing,
        ]);

        $this->updateJatahPenerima($validated);

        return redirect()->back()->with('success', 'Formula jatah Qurban berhasil disimpan!');
    }

    private function updateJatahPenerima($validated)
    {
        // Muslim
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'muslim')->where('jiwa', 1)->update(['jatah_sapi' => $validated['sim_sapi_1'], 'jatah_kambing' => $validated['sim_kambing_1']]);
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'muslim')->where('jiwa', 2)->update(['jatah_sapi' => $validated['sim_sapi_2'], 'jatah_kambing' => $validated['sim_kambing_2']]);
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'muslim')->where('jiwa', 3)->update(['jatah_sapi' => $validated['sim_sapi_3'], 'jatah_kambing' => $validated['sim_kambing_3']]);
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'muslim')->where('jiwa', 4)->update(['jatah_sapi' => $validated['sim_sapi_4'], 'jatah_kambing' => $validated['sim_kambing_4']]);
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'muslim')->where('jiwa', '>=', 5)->update(['jatah_sapi' => $validated['sim_sapi_5_plus'], 'jatah_kambing' => $validated['sim_kambing_5_plus']]);

        // Non-Muslim
        Penerimaqurban::where('status', '!=', 'shohibul')->where('agama', 'nonmuslim')->update(['jatah_sapi' => $validated['sim_sapi_nonmuslim'], 'jatah_kambing' => $validated['sim_kambing_nonmuslim']]);
    }

    public function getLatest()
    {
        $formula = Formulaqurban::latest()->first();
        return response()->json(['data' => $formula]);
    }
}
