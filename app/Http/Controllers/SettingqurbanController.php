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
        $archives = \App\Models\QurbanArchive::orderBy('tahun', 'desc')->get();

        return Inertia::render('qurban/SettingQurban', [
            'setting' => $setting,
            'archives' => $archives,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jual_kulit'          => 'required|numeric|min:0',
            'note_kulit'          => 'required|string',
            'tahun'               => 'required|numeric|min:0',
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
            'note_kulit'          => 'required|string',
            'tahun'               => 'required|numeric|min:0',
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

    public function updatePrinter(Request $request)
    {
        $request->validate([
            'printer_connected' => 'required|boolean',
            'printer_name' => 'required|string',
        ]);

        $setting = Settingqurban::first();
        if (!$setting) {
            $setting = Settingqurban::create([
                'jual_kulit' => 0,
                'operasional_kambing' => 0,
                'tanggal_pengambilan' => '-',
                'waktu_pengambilan' => '-',
                'tempat_pengambilan' => '-',
            ]);
        }

        $setting->update([
            'printer_connected' => $request->printer_connected,
            'printer_name' => $request->printer_name,
        ]);

        return redirect()->back()->with('success', 'Printer berhasil dihubungkan');
    }

    public function disconnectPrinter()
    {
        $setting = Settingqurban::first();
        if ($setting) {
            $setting->update([
                'printer_connected' => false,
                'printer_name' => null,
            ]);
        }

        return redirect()->back()->with('success', 'Printer berhasil diputuskan');
    }
}