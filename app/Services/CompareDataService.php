<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class CompareDataService
{
    /**
     * 
     * @param \Illuminate\Support\Collection $pembayar
     * @param \Illuminate\Support\Collection $penerima
     * @return array
     */
    public function compare($pembayar, $penerima)
    {
        $matches = [];

        foreach ($penerima as $pen) {
            foreach ($pembayar as $pay) {
                // Konversi ke string untuk perbandingan
                $penRT = (string) $pen->rt;
                $penRW = (string) $pen->rw;
                $payRT = (string) $pay->rt;
                $payRW = (string) $pay->rw;

                // Cek RT dan RW
                if ($penRT !== $payRT || $penRW !== $payRW) {
                    continue;
                }

                // (lowercase, trim, hapus spasi ekstra)
                $namaPenerima = strtolower(trim(preg_replace('/\s+/', ' ', $pen->nama)));
                $namaPembayar = strtolower(trim(preg_replace('/\s+/', ' ', $pay->nama)));

                // Cek kesamaan nama menggunakan similarity
                $similarity = 0;
                similar_text($namaPenerima, $namaPembayar, $similarity);

                // Threshold 80% untuk mendeteksi kesamaan
                if ($similarity >= 80) {
                    $alasan = $this->generateReason(
                        $pen->nama,
                        $pay->nama,
                        $similarity,
                        $penRT,
                        $penRW
                    );

                    $matches[] = [
                        'penerima_id' => $pen->id,
                        'pembayar_id' => $pay->id,
                        'alasan' => $alasan
                    ];

                    break;
                }
            }
        }

        return $matches;
    }
    
    /**
     * Generate alasan matching yang readable
     * 
     * @param string $namaPenerima
     * @param string $namaPembayar
     * @param float $similarity
     * @param string $rt
     * @param string $rw
     * @return string
     */
    private function generateReason($namaPenerima, $namaPembayar, $similarity, $rt, $rw)
    {
        $namaPenerimaLower = strtolower(trim($namaPenerima));
        $namaPembayarLower = strtolower(trim($namaPembayar));

        if ($namaPenerimaLower === $namaPembayarLower) {
            return "Nama sama persis: '{$namaPenerima}', lokasi sama RT {$rt}/RW {$rw}";
        }

        return sprintf(
            "Nama mirip %.0f%%: '%s' ≈ '%s', lokasi sama RT %s/RW %s",
            $similarity,
            $namaPenerima,
            $namaPembayar,
            $rt,
            $rw
        );
    }
}