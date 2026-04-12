<?php
namespace App\Http\Controllers;
use App\Models\Jatahlembagaqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JatahlembagaqurbanController extends Controller
{
    public function index()
    {
        $jatah = Jatahlembagaqurban::all();
        return Inertia::render('qurban/JatahLembaga', [
            'jatah' => $jatah,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lembaga' => 'required',
            'jumlah_sapi' => 'required',
            'jumlah_kambing' => 'required',
        ]);

        Jatahlembagaqurban::create($request->all());

        return redirect()->route('jatah-lembaga.index')
            ->with('success', 'Jatah lembaga qurban berhasil ditambahkan.');
    }

    public function update(Request $request, Jatahlembagaqurban $jatahlembagaqurban)
    {
        $request->validate([
            'nama_lembaga' => 'required',
            'jumlah_sapi' => 'required',
            'jumlah_kambing' => 'required',
        ]);

        $jatahlembagaqurban->update($request->all());

        return redirect()->route('jatah-lembaga.index')
            ->with('success', 'Jatah lembaga qurban berhasil diupdate.');
    }

    public function destroy(Jatahlembagaqurban $jatahlembagaqurban)
    {
        $jatahlembagaqurban->delete();

        return redirect()->route('jatah-lembaga.index')
            ->with('success', 'Jatah lembaga qurban berhasil dihapus.');
    }
}