<?php

namespace App\Http\Controllers;

use App\Models\PembayarZakat;
use App\Models\PenerimaZakat;
use App\Services\CompareDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ZakatCompareController extends Controller
{
    public function compare(CompareDataService $compareService): JsonResponse
    {
        // Ambil data dari database
        $pembayar = PembayarZakat::select('id', 'nama', 'rt', 'rw')->get();
        $penerima = PenerimaZakat::select('id', 'nama', 'rt', 'rw')->get();

        // Menjalankan proses compare
        try {
            $matches = $compareService->compare($pembayar, $penerima);
        } catch (\Throwable $e) {

            return response()->json([
                'message' => 'Gagal memproses perbandingan data'
            ], 500);
        }

        $enriched = [];

        foreach ($matches as $match) {
            // Validasi format data
            if (!isset($match['penerima_id']) || !isset($match['pembayar_id'])) {
                Log::warning('Compare Zakat - Format match tidak valid', [
                    'match' => $match
                ]);
                continue;
            }

            $penerimaData = PenerimaZakat::find($match['penerima_id']);
            $pembayarData = PembayarZakat::find($match['pembayar_id']);

            // Skip jika data tidak ditemukan
            if (!$penerimaData || !$pembayarData) {
                continue;
            }

            $enriched[] = [
                'penerima_id' => $penerimaData->id,
                'pembayar_id' => $pembayarData->id,
                'penerima' => $penerimaData,
                'pembayar' => $pembayarData,
                'alasan' => $match['alasan'] ?? '-'
            ];
        }

        return response()->json($enriched);
    }
}