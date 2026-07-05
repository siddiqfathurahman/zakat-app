<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Kas;
use App\Models\Kategori;
use App\Models\Transaksi;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminKeuanganController extends Controller
{
    public function index(Request $request)
    {
        $periode = $request->input('periode', 'this_month');
        [$start, $end, $periodeLabel] = $this->resolvePeriode(
            $periode,
            $request->input('tanggal_dari'),
            $request->input('tanggal_sampai')
        );

        // ==== Kas + saldo "as of" akhir periode ====
        $kasAktif = Kas::where('status', 'active')->orderBy('nama')->get(['id', 'nama', 'jenis', 'saldo']);

        $kasList = $kasAktif->map(function ($kas) use ($end) {
            return [
                'id' => $kas->id,
                'nama' => $kas->nama,
                'jenis' => $kas->jenis,
                'saldo' => $this->saldoAsOf($kas, $end),
            ];
        })->values();

        $totalSaldo = $kasList->sum('saldo');

        // ==== Pemasukan / pengeluaran sesuai periode ====
        $pemasukanPeriode = $this->transaksiPeriode('income', $start, $end)->sum('jumlah');
        $pengeluaranPeriode = $this->transaksiPeriode('expense', $start, $end)->sum('jumlah');
        $selisihPeriode = $pemasukanPeriode - $pengeluaranPeriode;
        $saldoAwalPeriode = $totalSaldo - $selisihPeriode;

        // ==== Transfer & jumlah transaksi sesuai periode ====
        $totalTransferPeriode = $this->applyRange(Transfer::query(), $start, $end)->sum('jumlah');
        $jumlahTransaksiPeriode = $this->applyRange(
            Transaksi::where('status', 'approved'),
            $start,
            $end
        )->count();

        // ==== Grafik tren 6 bulan, berakhir di akhir periode terpilih ====
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

        // ==== Grafik saldo per kas (pakai saldo as-of periode juga) ====
        $grafikSaldoKas = $kasList->map(fn ($k) => [
            'nama' => $k['nama'],
            'saldo' => (float) $k['saldo'],
        ])->values();

        // ==== Top 5 kategori pengeluaran & pemasukan sesuai periode ====
        $topKategoriPengeluaran = $this->topKategori('expense', $start, $end);
        $topKategoriPemasukan = $this->topKategori('income', $start, $end);

        // ==== Aktivitas terbaru (selalu terbaru, tidak ikut filter) ====
        $aktivitasTerbaru = ActivityLog::with('user:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'user' => $log->user?->name ?? 'Sistem',
                'aktivitas' => $log->aktivitas,
                'waktu' => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('dashboard/AdminKeuangan', [
            'kategoriList' => Kategori::orderBy('nama')->get(['id', 'nama', 'tipe', 'warna']),
            'filter' => [
                'periode' => $periode,
                'periode_label' => $periodeLabel,
                'tanggal_dari' => $start?->toDateString(),
                'tanggal_sampai' => $end->toDateString(),
            ],
            'stats' => [
                'total_saldo' => (float) $totalSaldo,
                'pemasukan_periode' => (float) $pemasukanPeriode,
                'pengeluaran_periode' => (float) $pengeluaranPeriode,
                'selisih_periode' => (float) $selisihPeriode,
                'saldo_awal_periode' => (float) $saldoAwalPeriode,
                'total_transfer_periode' => (float) $totalTransferPeriode,
                'jumlah_transaksi_periode' => $jumlahTransaksiPeriode,
            ],
            'kasList' => $kasList,
            'grafikBulanan' => $grafikBulanan,
            'grafikSaldoKas' => $grafikSaldoKas,
            'topKategoriPengeluaran' => $topKategoriPengeluaran,
            'topKategoriPemasukan' => $topKategoriPemasukan,
            'aktivitasTerbaru' => $aktivitasTerbaru,
        ]);
    }

    /**
     * Hitung saldo kas "as of" tanggal akhir periode, dengan cara membalik
     * (roll back) efek transaksi approved yang terjadi SETELAH tanggal itu
     * dari saldo berjalan saat ini. Kalau akhir periode >= hari ini, hasilnya
     * sama dengan saldo saat ini.
     */
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

    private function transaksiPeriode(string $jenis, ?Carbon $start, Carbon $end)
    {
        return $this->applyRange(
            Transaksi::where('jenis', $jenis)->where('status', 'approved'),
            $start,
            $end
        );
    }

    private function topKategori(string $jenis, ?Carbon $start, Carbon $end)
    {
        $query = Transaksi::query()
            ->join('kategori', 'kategori.id', '=', 'transaksis.kategori_id')
            ->where('transaksis.jenis', $jenis)
            ->where('transaksis.status', 'approved');

        if ($start) {
            $query->whereDate('transaksis.tanggal', '>=', $start);
        }
        $query->whereDate('transaksis.tanggal', '<=', $end);

        return $query->groupBy('kategori.id', 'kategori.nama', 'kategori.warna')
            ->orderByDesc(DB::raw('SUM(transaksis.jumlah)'))
            ->limit(5)
            ->get([
                'kategori.nama',
                'kategori.warna',
                DB::raw('SUM(transaksis.jumlah) as total'),
            ]);
    }

    private function applyRange($query, ?Carbon $start, Carbon $end)
    {
        if ($start) {
            $query->whereDate('tanggal', '>=', $start);
        }

        return $query->whereDate('tanggal', '<=', $end);
    }

    /**
     * Konversi key periode dari filter modal jadi rentang tanggal [start, end, label].
     * $start null artinya "sejak awal" (tidak ada batas bawah).
     */     
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