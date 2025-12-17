<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SettingBeras;
use Inertia\Inertia;

class SettingBerasController extends Controller
{
    public function index(Request $request)
    {
        $setting = SettingBeras::firstOrCreate(
            [], 
            [
                'toko' => '',
                'harga_per_kg' => 0,
                'harga_2_5kg' => 0,
                'harga_sak' => 0,
            ]
        );

        return Inertia::render('SettingBeras', [
            'setting' => $setting,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'toko' => 'required|string',
            'harga_per_kg' => 'required|numeric|min:0',
            'harga_sak' => 'nullable|string',
        ]);

        $setting = SettingBeras::firstOrCreate(
            [],
            [
                'toko' => '-',
                'harga_per_kg' => 0,
                'harga_2_5kg' => 0,
                'harga_sak' => '-',
            ]
        );

        $setting->update([
            'toko' => $request->toko,
            'harga_per_kg' => $request->harga_per_kg,
            'harga_2_5kg' => $request->harga_per_kg * 2.5,
            'harga_sak' => $request->harga_sak,
        ]);

        return redirect()->back()->with('success', 'Harga beras berhasil disimpan');
    }


}