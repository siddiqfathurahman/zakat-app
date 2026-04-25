<?php

namespace App\Http\Controllers;

use App\Models\Jatahconfigqurban;
use App\Models\Penerimaqurban;
use Illuminate\Http\Request;

class JatahconfigqurbanController extends Controller
{
    // simpan / update input manual untuk qurban config
    public function store(Request $request)
    {
        $request->validate([
            'configs' => 'required|array',
            'configs.*.jiwa' => 'required|integer',
            'configs.*.kategori' => 'required|string|in:muslim,nonmuslim',
            'configs.*.jatah_sapi' => 'required|numeric',
            'configs.*.jatah_kambing' => 'required|numeric',
        ]);

        foreach ($request->configs as $config) {
            Jatahconfigqurban::updateOrCreate(
                ['jiwa' => $config['jiwa'], 'kategori' => $config['kategori']],
                [
                    'jatah_sapi' => $config['jatah_sapi'],
                    'jatah_kambing' => $config['jatah_kambing'],
                ]
            );
        }

        return redirect()->back()->with('success', 'Konfigurasi jatah qurban disimpan');
    }

    // tombol APPLY ke semua penerima
    public function apply()
    {
        $configsMuslim = Jatahconfigqurban::where('kategori', 'muslim')->get()->keyBy('jiwa');
        $configNonMuslim = Jatahconfigqurban::where('kategori', 'nonmuslim')->first();

        $penerimas = Penerimaqurban::all();

        foreach ($penerimas as $penerima) {
            if ($penerima->agama === 'nonmuslim') {
                if ($configNonMuslim) {
                    $penerima->update([
                        'jatah_sapi' => $configNonMuslim->jatah_sapi,
                        'jatah_kambing' => $configNonMuslim->jatah_kambing,
                    ]);
                }
            } else {
                // assume muslim
                $key = $penerima->jiwa >= 5 ? 5 : $penerima->jiwa;
                if (isset($configsMuslim[$key])) {
                    $penerima->update([
                        'jatah_sapi' => $configsMuslim[$key]->jatah_sapi,
                        'jatah_kambing' => $configsMuslim[$key]->jatah_kambing,
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Jatah qurban berhasil diterapkan ke semua penerima');
    }
}
