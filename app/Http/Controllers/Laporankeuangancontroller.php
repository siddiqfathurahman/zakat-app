<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class LaporanKeuanganController extends Controller
{
    private function profil(): array
    {
        return [
            'nama' => 'Masjid Al Anhar',
            'lokasi' => 'Yogyakarta, Daerah Istimewa Yogyakarta',
        ];
    }

    public function index(Request $request)
    {
        $periode = $request->input('periode', 'this_month');
        [$start, $end, $periodeLabel] = $this->resolvePeriode(
            $periode,
            $request->input('tanggal_dari'),
            $request->input('tanggal_sampai')
        );

        $kasAktif = Kas::where('status', 'active')->orderBy('nama')->get(['id', 'nama', 'jenis', 'saldo']);

        $kasList = $kasAktif->map(fn ($kas) => [
            'id' => $kas->id,
            'nama' => $kas->nama,
            'jenis' => $kas->jenis,
            'saldo' => $this->saldoAsOf($kas, $end),
        ])->values();

        $totalSaldo = $kasList->sum('saldo');

        $pemasukanPeriode = $this->applyRange(
            Transaksi::where('jenis', 'income')->where('status', 'approved'),
            $start,
            $end
        )->sum('jumlah');

        $pengeluaranPeriode = $this->applyRange(
            Transaksi::where('jenis', 'expense')->where('status', 'approved'),
            $start,
            $end
        )->sum('jumlah');

        $saldoAwalPeriode = $totalSaldo - ($pemasukanPeriode - $pengeluaranPeriode);

        
        $anchor = $end->copy();
        $grafikBulanan = collect(range(5, 0))->map(function ($i) use ($anchor) {
            $bulan = $anchor->copy()->subMonths($i);

            $income = Transaksi::where('jenis', 'income')
                ->where('status', 'approved')
                ->whereYear('tanggal', $bulan->year)
                ->whereMonth('tanggal', $bulan->month)
                ->sum('jumlah');

            $expense = Transaksi::where('jenis', 'expense')
                ->where('status', 'approved')
                ->whereYear('tanggal', $bulan->year)
                ->whereMonth('tanggal', $bulan->month)
                ->sum('jumlah');

            return [
                'bulan' => $bulan->translatedFormat('M Y'),
                'pemasukan' => (float) $income,
                'pengeluaran' => (float) $expense,
            ];
        })->values();

        $semuaPemasukan = $request->boolean('semua_pemasukan');
        $semuaPengeluaran = $request->boolean('semua_pengeluaran');

        $transaksiPemasukan = $this->transaksiTerbaru('income', $start, $end, $semuaPemasukan);
        $transaksiPengeluaran = $this->transaksiTerbaru('expense', $start, $end, $semuaPengeluaran);

        return Inertia::render('LaporanKeuangan', [
            'profil' => $this->profil(),
            'filter' => [
                'periode' => $periode,
                'periode_label' => $periodeLabel,
                'tanggal_dari' => $start?->toDateString(),
                'tanggal_sampai' => $end->toDateString(),
                'semua_pemasukan' => $semuaPemasukan,
                'semua_pengeluaran' => $semuaPengeluaran,
            ],
            'stats' => [
                'total_saldo' => (float) $totalSaldo,
                'saldo_awal_periode' => (float) $saldoAwalPeriode,
                'pemasukan_periode' => (float) $pemasukanPeriode,
                'pengeluaran_periode' => (float) $pengeluaranPeriode,
            ],
            'kasList' => $kasList,
            'grafikBulanan' => $grafikBulanan,
            'transaksiPemasukan' => $transaksiPemasukan,
            'transaksiPengeluaran' => $transaksiPengeluaran,
        ]);
    }

    public function transaksi(Request $request)
    {
        $jenis = $request->input('jenis', 'income');
        $periode = $request->input('periode', 'this_month');
        [$start, $end, $periodeLabel] = $this->resolvePeriode(
            $periode,
            $request->input('tanggal_dari'),
            $request->input('tanggal_sampai')
        );

        $transaksis = $this->applyRange(
            Transaksi::where('jenis', $jenis)
                ->where('status', 'approved')
                ->with(['kas:id,nama', 'kategori:id,nama,warna']),
            $start,
            $end
        )
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('LaporanTransaksi', [
            'profil' => $this->profil(),
            'transaksis' => $transaksis,
            'jenis' => $jenis,
            'filter' => [
                'periode' => $periode,
                'periode_label' => $periodeLabel,
                'tanggal_dari' => $start?->toDateString(),
                'tanggal_sampai' => $end->toDateString(),
            ],
        ]);
    }

    private function transaksiTerbaru(string $jenis, ?Carbon $start, Carbon $end, bool $tampilkanSemua = false)
    {
        return $this->applyRange(
            Transaksi::where('jenis', $jenis)
                ->where('status', 'approved')
                ->with(['kas:id,nama', 'kategori:id,nama,warna']),
            $start,
            $end
        )
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->limit($tampilkanSemua ? 200 : 5)
            ->get(['id', 'kas_id', 'kategori_id', 'jumlah', 'tanggal', 'keterangan']);
    }

    private function saldoAsOf(Kas $kas, Carbon $end): float
    {
        $incomeSetelah = Transaksi::where('kas_id', $kas->id)
            ->where('jenis', 'income')
            ->where('status', 'approved')
            ->whereDate('tanggal', '>', $end)
            ->sum('jumlah');

        $expenseSetelah = Transaksi::where('kas_id', $kas->id)
            ->where('jenis', 'expense')
            ->where('status', 'approved')
            ->whereDate('tanggal', '>', $end)
            ->sum('jumlah');

        return (float) $kas->saldo - ($incomeSetelah - $expenseSetelah);
    }

    private function applyRange($query, ?Carbon $start, Carbon $end)
    {
        if ($start) {
            $query->whereDate('tanggal', '>=', $start);
        }

        return $query->whereDate('tanggal', '<=', $end);
    }

    private function resolvePeriode(string $periode, ?string $dariCustom, ?string $sampaiCustom): array
    {
        $today = Carbon::today();

        return match ($periode) {
            'today' => [$today->copy(), $today->copy(), 'Hari Ini'],
            '7_days' => [$today->copy()->subDays(6), $today->copy(), '7 Hari Terakhir'],
            'this_week' => [$today->copy()->startOfWeek(), $today->copy()->endOfWeek(), 'Minggu Ini'],
            '30_days' => [$today->copy()->subDays(29), $today->copy(), '30 Hari Terakhir'],
            'last_month' => [
                $today->copy()->subMonthNoOverflow()->startOfMonth(),
                $today->copy()->subMonthNoOverflow()->endOfMonth(),
                'Bulan Lalu',
            ],
            '3_months' => [$today->copy()->subMonths(3)->startOfDay(), $today->copy(), '3 Bulan Terakhir'],
            'this_year' => [$today->copy()->startOfYear(), $today->copy()->endOfYear(), 'Tahun Ini'],
            '12_months' => [$today->copy()->subMonths(12)->startOfDay(), $today->copy(), '12 Bulan Terakhir'],
            'all_time' => [null, $today->copy(), 'Sejak Awal'],
            'custom' => (function () use ($dariCustom, $sampaiCustom, $today) {
                $dari = $dariCustom ? Carbon::parse($dariCustom) : $today->copy()->startOfMonth();
                $sampai = $sampaiCustom ? Carbon::parse($sampaiCustom) : $today->copy();
                return [$dari, $sampai, $dari->format('d/m/Y') . ' - ' . $sampai->format('d/m/Y')];
            })(),
            default => [$today->copy()->startOfMonth(), $today->copy()->endOfMonth(), 'Bulan Ini'],
        };
    }
}