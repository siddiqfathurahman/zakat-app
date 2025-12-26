<?php

namespace App\Http\Controllers;

use App\Models\PenerimaZakat;
use App\Models\JatahConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenerimaZakatController extends Controller
{
    public function index(Request $request)
    {
        $query = PenerimaZakat::query();

        // Handle search
        if ($request->has('search') && $request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        // Handle RT filter
        if ($request->has('rt') && $request->rt) {
            $query->where('rt', $request->rt);
        }

        $configs = JatahConfig::pluck('jatah', 'jiwa')->toArray();
        $rtList = PenerimaZakat::distinct()->pluck('rt')->sort()->values()->toArray() ?: [];
        
        return Inertia::render('PenerimaZakat', [
            'penerimas' => $query->orderBy('created_at', 'desc')->paginate(10),
            'configs' => $configs,
            'filters' => [
                'search' => $request->search ?? '',
                'rt' => $request->rt ?? '',
            ],
            'rtList' => $rtList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'rt' => 'required|numeric',
            'rw' => 'required|numeric',
            'jiwa' => 'required|numeric|min:1',
        ]);

        PenerimaZakat::create([
            'nama' => $request->nama,
            'rt' => $request->rt,
            'rw' => $request->rw,
            'jiwa' => $request->jiwa,
            'jatah' => null,
        ]);

        return redirect()->back()->with('success', 'Penerima zakat berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $penerima = PenerimaZakat::findOrFail($id);

        $request->validate([
            'nama' => 'required|string',
            'rt' => 'required|numeric',
            'rw' => 'required|numeric',
            'jiwa' => 'required|numeric|min:1',
        ]);

        $penerima->update([
            'nama' => $request->nama,
            'rt' => $request->rt,
            'rw' => $request->rw,
            'jiwa' => $request->jiwa,
        ]);

        return redirect()->back()->with('success', 'Data penerima berhasil diperbarui');
    }

    public function destroy($id)
    {
        $penerima = PenerimaZakat::findOrFail($id);
        $penerima->delete();

        return redirect()->back()->with('success', 'Data penerima berhasil dihapus');
    }

    public function print(Request $request)
    {
        $query = PenerimaZakat::query();
        $filterInfo = [];

        // Handle search
        if ($request->has('search') && $request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%');
            $filterInfo[] = 'Nama: ' . $request->search;
        }

        // Handle RT filter
        if ($request->has('rt') && $request->rt) {
            $query->where('rt', $request->rt);
            $filterInfo[] = 'RT: ' . str_pad($request->rt, 2, '0', STR_PAD_LEFT);
        }

        $penerimas = $query->orderBy('created_at', 'desc')->get();

        return view('print.penerima-zakat', [
            'penerimas'      => $penerimas,
            'filterInfo'     => $filterInfo,
            'totalPenerima'  => $penerimas->count(),
            'totalJiwa'      => $penerimas->sum('jiwa'),
            'totalJatah'     => $penerimas->sum('jatah'), 
        ]);
    }
}