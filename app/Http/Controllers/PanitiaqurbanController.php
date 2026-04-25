<?php

namespace App\Http\Controllers;

use App\Models\Panitiaqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanitiaqurbanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $panitiaqurbans = Panitiaqurban::all();
        return Inertia::render('qurban/PanitiaQurban', [
            'panitiaqurbans' => $panitiaqurbans,
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'jabatan' => 'required',
            'rt' => 'required',
            'rw' => 'required',
            'sudah_diambil' => 'required',
        ]);

        Panitiaqurban::create($request->all());

        return redirect()->route('panitia.index')->with('success', '...');
    }

    public function update(Request $request, Panitiaqurban $panitiaqurban)
    {
        $request->validate([
            'nama' => 'required',
            'jabatan' => 'required',
            'rt' => 'required',
            'rw' => 'required',
            'sudah_diambil' => 'required',
        ]);

        $panitiaqurban->update($request->all());

        return redirect()->route('panitia.index')->with('success', '...');
    }

    public function destroy(Panitiaqurban $panitiaqurban)
    {
        $panitiaqurban->delete();

        return redirect()->route('panitia.index')->with('success', '...');
    }
}
