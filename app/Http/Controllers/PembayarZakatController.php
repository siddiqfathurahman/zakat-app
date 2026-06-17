<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayarZakatController extends Controller
{
    public function index(Request $request)
    {
        $query = PembayarZakat::query();

        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('panitia', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('rt') && $request->rt) {
            $query->where('rt', $request->rt);
        }

        if ($request->has('rw') && $request->rw) {
            $query->where('rw', $request->rw);
        }

        $pembayarZakat = $query->latest()->get();

        $rtList = PembayarZakat::distinct()->pluck('rt')->sort()->values();
        $rwList = PembayarZakat::distinct()->pluck('rw')->sort()->values();

        return Inertia::render('zakat/PembayarZakat', [
            'pembayarZakat' => $pembayarZakat,
            'rtList' => $rtList,
            'rwList' => $rwList,
            'filters' => [
                'search' => $request->search,
                'rt' => $request->rt,
                'rw' => $request->rw,
            ]
        ]);

        $setting = \App\Models\SettingBeras::first();

        return Inertia::render('zakat/InputZakat', [
            'setting' => $setting,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaPembayar' => 'required|string|max:255',
            'namaPanitia' => 'required|string|max:255',
            'rt' => 'required|string|max:10',
            'rw' => 'required|string|max:10',
            'jumlahJiwa' => 'required|integer|min:1',
            'melalui' => 'required|in:uang,beras',
            'totalBayar' => 'required|numeric|min:0',
            'nilaiPerJiwa' => 'required|numeric|min:0',
            'sodaqoh' => 'nullable|numeric|min:0',
        ]);

        PembayarZakat::create([
            'nama' => $validated['namaPembayar'],
            'panitia' => $validated['namaPanitia'],
            'rt' => $validated['rt'],
            'rw' => $validated['rw'],
            'jumlah_jiwa' => $validated['jumlahJiwa'],
            'melalui' => $validated['melalui'],
            'nilai_per_jiwa' => $validated['nilaiPerJiwa'],
            'total' => $validated['totalBayar'],
            'sodaqoh' => $validated['sodaqoh'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Data zakat berhasil disimpan!');
    }

    public function update(Request $request, $id)
    {
        $pembayarZakat = PembayarZakat::findOrFail($id);

        $validated = $request->validate([
            'namaPembayar' => 'required|string|max:255',
            'namaPanitia' => 'required|string|max:255',
            'rt' => 'required|string|max:10',
            'rw' => 'required|string|max:10',
            'jumlahJiwa' => 'required|integer|min:1',
            'melalui' => 'required|in:uang,beras',
            'totalBayar' => 'required|numeric|min:0',
            'nilaiPerJiwa' => 'required|numeric|min:0',
            'sodaqoh' => 'nullable|numeric|min:0',
        ]);

        $pembayarZakat->update([
            'nama' => $validated['namaPembayar'],
            'panitia' => $validated['namaPanitia'],
            'rt' => $validated['rt'],
            'rw' => $validated['rw'],
            'jumlah_jiwa' => $validated['jumlahJiwa'],
            'melalui' => $validated['melalui'],
            'nilai_per_jiwa' => $validated['nilaiPerJiwa'],
            'total' => $validated['totalBayar'],
            'sodaqoh' => $validated['sodaqoh'] ?? 0,
        ]);

        return redirect()->back()->with('success', 'Data zakat berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $pembayarZakat = PembayarZakat::findOrFail($id);
        $pembayarZakat->delete();

        return redirect()->back()->with('success', 'Data zakat berhasil dihapus!');
    }

    // export excel
    public function export(Request $request)
    {
        $query = PembayarZakat::query();

        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('panitia', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('rt') && $request->rt) {
            $query->where('rt', $request->rt);
        }

        if ($request->has('rw') && $request->rw) {
            $query->where('rw', $request->rw);
        }

        $data = $query->latest()->get();

        $filename = 'data-pembayar-zakat-' . now()->format('Ymd-His') . '.xlsx';

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $headers = ['No', 'Nama Pembayar', 'Panitia', 'RT', 'RW', 'Jumlah Jiwa', 'Melalui', 'Total Zakat', 'Sodaqoh', 'Tanggal'];
        foreach ($headers as $col => $header) {
            $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col + 1) . '1';
            $sheet->setCellValue($cell, $header);
            $sheet->getStyle($cell)->getFont()->setBold(true);
            $sheet->getStyle($cell)->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setRGB('16a34a');
            $sheet->getStyle($cell)->getFont()->getColor()->setRGB('FFFFFF');
        }

        // Data rows
        foreach ($data as $i => $item) {
            $row = $i + 2;
            $sheet->setCellValue("A{$row}", $i + 1);
            $sheet->setCellValue("B{$row}", $item->nama);
            $sheet->setCellValue("C{$row}", $item->panitia);
            $sheet->setCellValue("D{$row}", $item->rt);
            $sheet->setCellValue("E{$row}", $item->rw);
            $sheet->setCellValue("F{$row}", $item->jumlah_jiwa);
            $sheet->setCellValue("G{$row}", ucfirst($item->melalui));
            $sheet->setCellValue("H{$row}", $item->total);
            $sheet->setCellValue("I{$row}", $item->sodaqoh ?? 0);
            $sheet->setCellValue("J{$row}", \Carbon\Carbon::parse($item->created_at)->format('d M Y'));
        }

        // Auto width
        foreach (range('A', 'J') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

        return response()->stream(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}