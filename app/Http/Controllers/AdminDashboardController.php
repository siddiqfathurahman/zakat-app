<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Kas;
use App\Models\News;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\SiteView;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        $totalUsers = User::count();
        $totalNews = News::count();
        $totalSiteViews = SiteView::getTotal();

        $totalSaldoKas = (float) Kas::where('status', 'active')->sum('saldo');

        $today = Carbon::today();
        $grafikBulanan = collect(range(11, 0))->map(function ($i) use ($today) {
            $bulan = $today->copy()->subMonths($i);

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
                'bulan'       => $bulan->translatedFormat('M'),
                'pemasukan'   => (float) $income,
                'pengeluaran' => (float) $expense,
            ];
        })->values();

        $aktivitasTerkini = ActivityLog::with('user:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($log) => [
                'id'        => $log->id,
                'user'      => $log->user?->name ?? 'Sistem',
                'aktivitas' => $log->aktivitas,
                'waktu'     => $log->created_at->diffForHumans(),
            ]);

        return Inertia::render('dashboard/AdminDashboard', [
            'authUser' => [
                'name'     => $authUser->name,
                'username' => $authUser->username,
                'role'     => $authUser->role,
            ],
            'totalUsers'      => $totalUsers,
            'totalNews'       => $totalNews,
            'totalSiteViews'  => $totalSiteViews,
            'totalSaldoKas'   => $totalSaldoKas,
            'grafikBulanan'   => $grafikBulanan,
            'aktivitasTerkini' => $aktivitasTerkini,
        ]);
    }
}