<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemohon;
use Inertia\Inertia;

class PemohonController extends Controller
{
    public function index(Request $request)
    {
        $pemohons = Pemohon::all();
        return Inertia::render('Pemohon', [
            'pemohons' => $pemohons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'permintaan' => 'nullable|string|max:255',
            'jatah' => 'nullable|string|max:255',
            'no_hp' => 'required|string|max:20',
        ]);

        Pemohon::create($validated);

        return redirect()->back()->with('success', 'Data pemohon berhasil disimpan.');
    }

    public function destroy($id)
    {
        $pemohon = Pemohon::findOrFail($id);
        $pemohon->delete();

        return redirect()->back()->with('success', 'Data pemohon berhasil dihapus.');
    }

    public function update(Request $request, $id)
    {
        $pemohon = Pemohon::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'permintaan' => 'required|string|max:255',
            'jatah' => 'nullable|string|max:255',
            'no_hp' => 'required|string|max:20',
        ]);

        $pemohon->update($validated);

        return redirect()->back()->with('success', 'Data pemohon berhasil diperbarui.');
    }
}
