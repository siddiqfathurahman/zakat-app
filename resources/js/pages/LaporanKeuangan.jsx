import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import FilterPeriodeModal from "@/components/keuangan/FilterPeriodeModal";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
    TrendingUp,
    TrendingDown,
    Landmark,
    Banknote,
    Smartphone,
    CircleDollarSign,
    Heart,
    HandCoins,
} from "lucide-react";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const formatRupiahShort = (value) => {
    if (value >= 1_000_000_000)
        return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
    return formatRupiah(value);
};

const formatTanggal = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const jenisLabel = {
    cash: "Tunai",
    bank: "Bank / ATM",
    ewallet: "E-Wallet",
    lainnya: "Lainnya",
};
const jenisIcon = {
    cash: Banknote,
    bank: Landmark,
    ewallet: Smartphone,
    lainnya: CircleDollarSign,
};

function TransaksiRow({ trx, warna }) {
    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                    {trx.kategori?.nama || "Tanpa kategori"}
                </p>
                <p className="truncate text-xs text-slate-400">
                    {trx.kas?.nama} · {formatTanggal(trx.tanggal)}
                    {trx.keterangan ? ` · ${trx.keterangan}` : ""}
                </p>
            </div>
            <p
                className="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums"
                style={{ color: warna }}
            >
                {formatRupiah(trx.jumlah)}
            </p>
        </div>
    );
}

export default function LaporanKeuangan() {
    const {
        profil,
        filter,
        stats,
        kasList,
        grafikBulanan,
        transaksiPemasukan,
        transaksiPengeluaran,
    } = usePage().props;

    const [modalFilterOpen, setModalFilterOpen] = useState(false);

    const maxSaldoKas = Math.max(...kasList.map((k) => Number(k.saldo)), 0);

    const terapkanFilter = ({ periode, tanggal_dari, tanggal_sampai }) => {
        router.get(
            route("laporan.index"),
            { periode, tanggal_dari, tanggal_sampai },
            { preserveScroll: true, preserveState: true },
        );
    };

    const toggleSemuaTransaksi = (jenis) => {
        const key =
            jenis === "income" ? "semua_pemasukan" : "semua_pengeluaran";
        router.get(
            route("laporan.index"),
            {
                periode: filter.periode,
                tanggal_dari: filter.tanggal_dari,
                tanggal_sampai: filter.tanggal_sampai,
                semua_pemasukan:
                    jenis === "income"
                        ? !filter.semua_pemasukan
                        : filter.semua_pemasukan,
                semua_pengeluaran:
                    jenis === "expense"
                        ? !filter.semua_pengeluaran
                        : filter.semua_pengeluaran,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50">
                <div className="content space-y-6 px-4 py-6 sm:px-8">
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Laporan Keuangan Masjid
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                            {profil.nama}
                        </h1>
                        <p className="mt-1.5 flex items-center gap-1.5 md:text-sm text-xs text-slate-500 mb-7">
                            <MapPin size={14} /> {profil.lokasi}
                        </p>

                        <p className="text-xs font-medium text-slate-500">
                            Total Saldo Kas
                        </p>
                        <p className="mt-1 text-3xl font-bold tabular-nums text-primary sm:text-4xl">
                            {formatRupiah(stats.total_saldo)}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-slate-500">
                                Ringkasan periode
                            </p>
                            <button
                                onClick={() => setModalFilterOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                            >
                                <Calendar size={14} className="text-primary" />
                                {filter.periode_label}
                                <ChevronDown
                                    size={14}
                                    className="text-slate-400"
                                />
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Saldo Awal
                                </p>
                                <p className="mt-1 text-base font-semibold tabular-nums text-slate-900 sm:text-lg">
                                    {formatRupiah(stats.saldo_awal_periode)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                    <TrendingUp
                                        size={12}
                                        className="text-emerald-600"
                                    />{" "}
                                    Pemasukan
                                </p>
                                <p className="mt-1 text-base font-semibold tabular-nums text-emerald-700 sm:text-lg">
                                    {formatRupiah(stats.pemasukan_periode)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                                <p className="flex items-center gap-1 text-xs text-slate-500">
                                    <TrendingDown
                                        size={12}
                                        className="text-rose-600"
                                    />{" "}
                                    Pengeluaran
                                </p>
                                <p className="mt-1 text-base font-semibold tabular-nums text-rose-700 sm:text-lg">
                                    {formatRupiah(stats.pengeluaran_periode)}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Saldo Akhir
                                </p>
                                <p className="mt-1 text-base font-semibold tabular-nums text-primary sm:text-lg">
                                    {formatRupiah(stats.total_saldo)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-bold text-slate-900">
                            Saldo per Dana
                        </h2>
                        <div className="space-y-4">
                            {[...kasList]
                                .sort(
                                    (a, b) => Number(b.saldo) - Number(a.saldo),
                                )
                                .map((kas) => {
                                    const pct =
                                        maxSaldoKas > 0
                                            ? Math.max(
                                                  (kas.saldo / maxSaldoKas) *
                                                      100,
                                                  4,
                                              )
                                            : 0;
                                    return (
                                        <div key={kas.id}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-slate-700">
                                                    {kas.nama}
                                                </span>
                                                <span className="font-medium tabular-nums text-slate-900">
                                                    {formatRupiahShort(
                                                        kas.saldo,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-bold text-slate-900">
                            Arus Kas 6 Bulan
                        </h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={grafikBulanan}>
                                <defs>
                                    <linearGradient
                                        id="pubColorIncome"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#0F6B4C"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#0F6B4C"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="pubColorExpense"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#C4573B"
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#C4573B"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f1f5f9"
                                />
                                <XAxis
                                    dataKey="bulan"
                                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    tickFormatter={(v) => formatRupiahShort(v)}
                                    axisLine={false}
                                    tickLine={false}
                                    width={60}
                                />
                                <Tooltip formatter={(v) => formatRupiah(v)} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) =>
                                        value === "pemasukan"
                                            ? "Masuk"
                                            : "Keluar"
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pemasukan"
                                    stroke="#0F6B4C"
                                    strokeWidth={2}
                                    fill="url(#pubColorIncome)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pengeluaran"
                                    stroke="#C4573B"
                                    strokeWidth={2}
                                    fill="url(#pubColorExpense)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-2 text-sm font-bold text-primary">
                            Transaksi - {filter.periode_label}
                        </h2>

                        <div className="mt-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                                    Pemasukan
                                </p>
                                <button
                                    onClick={() =>
                                        toggleSemuaTransaksi("income")
                                    }
                                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    {filter.semua_pemasukan ? (
                                        <>
                                            Sembunyikan <ChevronUp size={12} />
                                        </>
                                    ) : (
                                        <>
                                            Lihat Semua{" "}
                                            <ChevronDown size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 divide-y divide-slate-100">
                                {transaksiPemasukan.length === 0 && (
                                    <p className="py-3 text-sm text-slate-400">
                                        Tidak ada pemasukan pada periode ini.
                                    </p>
                                )}
                                {transaksiPemasukan.map((trx) => (
                                    <TransaksiRow
                                        key={trx.id}
                                        trx={trx}
                                        warna="#0F6B4C"
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold">
                                <span className="text-emerald-700">
                                    Subtotal Pemasukan
                                </span>
                                <span className="tabular-nums text-emerald-700">
                                    {formatRupiah(stats.pemasukan_periode)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                                    Pengeluaran
                                </p>
                                <button
                                    onClick={() =>
                                        toggleSemuaTransaksi("expense")
                                    }
                                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    {filter.semua_pengeluaran ? (
                                        <>
                                            Sembunyikan <ChevronUp size={12} />
                                        </>
                                    ) : (
                                        <>
                                            Lihat Semua{" "}
                                            <ChevronDown size={12} />
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 divide-y divide-slate-100">
                                {transaksiPengeluaran.length === 0 && (
                                    <p className="py-3 text-sm text-slate-400">
                                        Tidak ada pengeluaran pada periode ini.
                                    </p>
                                )}
                                {transaksiPengeluaran.map((trx) => (
                                    <TransaksiRow
                                        key={trx.id}
                                        trx={trx}
                                        warna="#C4573B"
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-sm font-semibold">
                                <span className="text-rose-700">
                                    Subtotal Pengeluaran
                                </span>
                                <span className="tabular-nums text-rose-700">
                                    {formatRupiah(stats.pengeluaran_periode)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl px-6 py-10 text-center text-white shadow-sm sm:p-10">
                        <img
                            src="/dakwah.webp"
                            alt="Dakwah"
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-[#005239]/80" />

                        <div className="relative z-10">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                                <Heart size={22} />
                            </div>

                            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-100">
                                Ajakan Berinfaq
                            </p>

                            <h2 className="mx-auto mt-2 max-w-md text-xl font-bold leading-snug sm:text-2xl">
                                Mari Berbagi, Ringankan Langkah Kebaikan
                            </h2>
                            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-emerald-50">
                                Setiap rupiah yang Anda infaqkan turut menjaga
                                operasional, kebersihan, dan kegiatan{" "}
                                <span className="font-semibold">
                                    {profil.nama}
                                </span>
                                . Laporan transparan di atas adalah bentuk
                                amanah yang kami jaga bersama.
                            </p>

                            <a
                                href="/infaqdonasi"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#005239] shadow-lg transition duration-300 hover:bg-emerald-50 hover:scale-105"
                            >
                                <HandCoins size={16} />
                                Infaq / Donasi Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <FilterPeriodeModal
                open={modalFilterOpen}
                onClose={() => setModalFilterOpen(false)}
                value={filter}
                onApply={terapkanFilter}
            />
        </AppLayout>
    );
}
