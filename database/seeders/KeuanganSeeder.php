<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Kas;
use App\Models\Kategori;
use App\Models\Transaksi;
use App\Models\Transfer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KeuanganSeeder extends Seeder
{
    public function run(): void
    {
        $userId = User::query()->value('id');

        // ==== KAS ====
        $kasList = [
            ['nama' => 'Kas Tunai', 'jenis' => 'cash', 'saldo' => 5000000],
            ['nama' => 'Kas Bank', 'jenis' => 'bank', 'saldo' => 25000000],
            ['nama' => 'Dana Cadangan', 'jenis' => 'bank', 'saldo' => 10000000],
            ['nama' => 'Dana Pembangunan', 'jenis' => 'bank', 'saldo' => 15000000],
            ['nama' => 'Kotak Amal', 'jenis' => 'cash', 'saldo' => 1500000],
            ['nama' => 'Kas Operasional', 'jenis' => 'cash', 'saldo' => 3000000],
        ];

        $kasIds = [];
        foreach ($kasList as $k) {
            $kasIds[] = Kas::create([...$k, 'status' => 'active', 'created_by' => $userId])->id;
        }

        // ==== KATEGORI ====
        $kategoriIncome = ['Infaq Jumat', 'Donatur', 'Wakaf', 'Zakat', 'Sedekah'];
        $kategoriExpense = ['Operasional', 'Listrik', 'Air', 'Konsumsi', 'Kebersihan', 'Transport', 'Honor', 'Renovasi'];

        $warnaIncome = ['#0F6B4C', '#2F9E6E', '#4CAF7D', '#1B8A5A', '#3CB371'];
        $warnaExpense = ['#C4573B', '#D9773F', '#B0472F', '#E08A5B', '#A6402A', '#CC6B4A', '#9C3E28', '#D97757'];

        $kategoriIncomeIds = [];
        foreach ($kategoriIncome as $i => $nama) {
            $kategoriIncomeIds[] = Kategori::create([
                'nama' => $nama,
                'tipe' => 'income',
                'warna' => $warnaIncome[$i],
                'created_by' => $userId,
            ])->id;
        }

        $kategoriExpenseIds = [];
        foreach ($kategoriExpense as $i => $nama) {
            $kategoriExpenseIds[] = Kategori::create([
                'nama' => $nama,
                'tipe' => 'expense',
                'warna' => $warnaExpense[$i],
                'created_by' => $userId,
            ])->id;
        }

        // ==== TRANSAKSI dummy 90 hari terakhir ====
        for ($i = 0; $i < 150; $i++) {
            $tanggal = now()->subDays(rand(0, 90));
            $jenis = rand(0, 100) < 55 ? 'income' : 'expense';
            $kategoriId = $jenis === 'income'
                ? $kategoriIncomeIds[array_rand($kategoriIncomeIds)]
                : $kategoriExpenseIds[array_rand($kategoriExpenseIds)];

            Transaksi::create([
                'nomor_transaksi' => 'TRX-' . $tanggal->format('Ymd') . '-' . Str::upper(Str::random(4)),
                'kas_id' => $kasIds[array_rand($kasIds)],
                'kategori_id' => $kategoriId,
                'jenis' => $jenis,
                'jumlah' => rand(50, 2000) * 1000,
                'tanggal' => $tanggal->toDateString(),
                'keterangan' => $jenis === 'income' ? 'Penerimaan dana' : 'Pengeluaran operasional',
                'status' => 'approved',
                'created_by' => $userId,
                'created_at' => $tanggal,
            ]);
        }

        // ==== TRANSFER dummy ====
        for ($i = 0; $i < 8; $i++) {
            $asal = $kasIds[array_rand($kasIds)];
            do {
                $tujuan = $kasIds[array_rand($kasIds)];
            } while ($tujuan === $asal);

            $tanggal = now()->subDays(rand(0, 30));

            Transfer::create([
                'nomor_transfer' => 'TRF-' . $tanggal->format('Ymd') . '-' . Str::upper(Str::random(4)),
                'kas_asal_id' => $asal,
                'kas_tujuan_id' => $tujuan,
                'jumlah' => rand(100, 1000) * 1000,
                'tanggal' => $tanggal->toDateString(),
                'keterangan' => 'Transfer antar kas',
                'created_by' => $userId,
                'created_at' => $tanggal,
            ]);
        }

        // ==== ACTIVITY LOG dummy ====
        $aktivitasContoh = [
            'menambahkan transaksi',
            'mengedit transaksi',
            'melakukan transfer kas',
            'menghapus transaksi',
            'menambahkan kategori',
        ];
        for ($i = 0; $i < 15; $i++) {
            ActivityLog::create([
                'user_id' => $userId,
                'aktivitas' => $aktivitasContoh[array_rand($aktivitasContoh)],
                'deskripsi' => 'Aktivitas dummy untuk keperluan testing dashboard',
                'created_at' => now()->subHours(rand(0, 72)),
            ]);
        }
    }
}
