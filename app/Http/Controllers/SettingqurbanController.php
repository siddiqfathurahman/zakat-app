<?php

namespace App\Http\Controllers;

use App\Models\Settingqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingqurbanController extends Controller
{
    public function index()
    {
        $setting = Settingqurban::first();
        return Inertia::render('qurban/SettingQurban', [
            'setting' => $setting,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jual_kulit'          => 'required|numeric|min:0',
            'operasional_kambing' => 'required|numeric|min:0',
        ]);

        $setting = Settingqurban::first();

        if ($setting) {
            $setting->update($request->all());
        } else {
            Settingqurban::create($request->all());
        }

        return redirect()->back()->with('success', 'Setting qurban berhasil disimpan.');
    }

    public function update(Request $request, Settingqurban $settingqurban)
    {
        $request->validate([
            'jual_kulit'          => 'required|numeric|min:0',
            'operasional_kambing' => 'required|numeric|min:0',
        ]);

        $settingqurban->update($request->all());

        return redirect()->back()->with('success', 'Setting qurban berhasil diupdate.');
    }

    public function destroy(Settingqurban $settingqurban)
    {
        $settingqurban->delete();
        return redirect()->back()->with('success', 'Setting qurban berhasil direset.');
    }
}