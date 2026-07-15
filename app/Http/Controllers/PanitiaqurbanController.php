<?php

namespace App\Http\Controllers;

use App\Models\Panitiaqurban;
use App\Models\Settingqurban;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanitiaqurbanController extends Controller
{
    public function index()
    {
        $panitiaqurbans = Panitiaqurban::all();
        $setting = Settingqurban::first();

        return Inertia::render('qurban/PanitiaQurban', [
            'panitiaqurbans' => $panitiaqurbans,
            'setting' => $setting,
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

    public function export(Request $request)
    {
        $query = Panitiaqurban::query();

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('jabatan')) {
            $query->where('jabatan', $request->jabatan);
        }

        if ($request->filled('status')) {
            $query->where('sudah_diambil', $request->status);
        }

        $data = $query->orderBy('nama')->get();

        $filename = 'data-panitia-qurban-' . now()->format('Ymd-His') . '.xlsx';

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $headers = ['No', 'Nama', 'Jabatan', 'RT', 'RW',];
        foreach ($headers as $col => $header) {
            $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col + 1) . '1';
            $sheet->setCellValue($cell, $header);
            $sheet->getStyle($cell)->getFont()->setBold(true);
            $sheet->getStyle($cell)->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setRGB('c2410c'); 
            $sheet->getStyle($cell)->getFont()->getColor()->setRGB('FFFFFF');
        }

        foreach ($data as $i => $item) {
            $row = $i + 2;

            $sheet->setCellValue("A{$row}", $i + 1);
            $sheet->setCellValue("B{$row}", $item->nama);
            $sheet->setCellValue("C{$row}", $item->jabatan);
            $sheet->setCellValue("D{$row}", $item->rt);
            $sheet->setCellValue("E{$row}", $item->rw);
        }

        foreach (range('A', 'F') as $col) {
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