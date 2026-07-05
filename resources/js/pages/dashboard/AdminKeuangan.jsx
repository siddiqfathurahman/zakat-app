import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layout/DashboardLayout";
import CatatTransaksiModal from "@/components/keuangan/CatatTransaksiModal";
import FilterPeriodeModal from "@/components/keuangan/FilterPeriodeModal";
import TambahKasModal from "@/components/keuangan/TambahKasModal";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    Receipt,
    Landmark,
    Banknote,
    Smartphone,
    CircleDollarSign,
    Plus,
    Calendar,
    ChevronDown,
    Scale,
} from "lucide-react";

// ==== helper format rupiah ====
const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const formatRupiahShort = (value) => {
    if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
    return formatRupiah(value);
};

const jenisIcon = {
    cash: Banknote,
    bank: Landmark,
    ewallet: Smartphone,
    lainnya: CircleDollarSign,
};

// ==== komponen kecil: StatCard ====
function StatCard({ icon: Icon, label, value, tone = "neutral" }) {
    const toneMap = {
        neutral: "bg-slate-50 text-slate-600",
        income: "bg-emerald-50 text-emerald-700",
        expense: "bg-rose-50 text-rose-700",
        transfer: "bg-indigo-50 text-indigo-700",
        total: "bg-amber-50 text-amber-700",
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
                        {value}
                    </p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneMap[tone]}`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
            </div>
        </div>
    );
}

// ==== komponen kecil: bar progres untuk top kategori ====
function KategoriBar({ nama, total, max, warna }) {
    const pct = max > 0 ? Math.max((total / max) * 100, 4) : 0;
    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-700">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: warna || "#94a3b8" }} />
                    {nama}
                </span>
                <span className="font-medium tabular-nums text-slate-900">{formatRupiahShort(total)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: warna || "#94a3b8" }}
                />
            </div>
        </div>
    );
}

export default function AdminKeuangan() {
    const {
        stats,
        kasList,
        kategoriList,
        filter,
        grafikBulanan,
        grafikSaldoKas,
        topKategoriPengeluaran,
        topKategoriPemasukan,
        aktivitasTerbaru,
    } = usePage().props;

    const [modalTransaksiOpen, setModalTransaksiOpen] = useState(false);
    const [modalFilterOpen, setModalFilterOpen] = useState(false);
    const [modalKasOpen, setModalKasOpen] = useState(false);

    const maxPengeluaran = Math.max(...topKategoriPengeluaran.map((k) => Number(k.total)), 0);
    const maxPemasukan = Math.max(...topKategoriPemasukan.map((k) => Number(k.total)), 0);

    const handleKategoriBaru = (nama, tipe, callback) => {
        router.post(
            route("admin.keuangan.kategori.quick"),
            { nama, tipe },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const baru = page.props.flash?.kategoriBaru;
                    if (baru) callback(baru.id);
                },
            }
        );
    };

    const terapkanFilter = ({ periode, tanggal_dari, tanggal_sampai }) => {
        router.get(
            route("admin.keuangan.dashboard"),
            { periode, tanggal_dari, tanggal_sampai },
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <>
            <Head title="Dashboard Keuangan" />

            <div className="flex items-center justify-between border border-gray-200 bg-white p-3 md:p-4 hidden sm:block">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 md:text-xl">Manajemen Keuangan</h1>
                    <p className="mt-0.5 text-xs text-gray-400">Kelola seluruh keuangan masjid.</p>
                </div>
            </div>

            <div className="mx-4 my-5 space-y-6 sm:mx-10">
                {/* Tab navigasi */}
                <div className="flex items-center gap-3">
                    <a className="rounded-xl bg-primary px-5 py-1.5 font-medium text-white" href="/admin/keuangan">
                        Keuangan
                    </a>
                    <a
                        className="rounded-xl bg-white px-5 py-1.5 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                        href="/admin/keuangan/transaksi"
                    >
                        History Transaksi
                    </a>
                </div>

                {/* Hero ringkasan saldo - khusus mobile */}
                <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:hidden">
                    <p className="text-xs font-medium text-slate-500">Total Saldo Kas</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
                        {formatRupiah(stats.total_saldo)}
                    </p>

                    <p className="mt-4 text-xs text-slate-500">Ringkasan periode</p>
                    <button
                        onClick={() => setModalFilterOpen(true)}
                        className="mt-1.5 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
                    >
                        <Calendar size={14} className="text-primary" />
                        {filter.periode_label}
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Saldo Awal</p>
                            <p className="mt-1 text-base font-semibold tabular-nums text-slate-900">
                                {formatRupiah(stats.saldo_awal_periode)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                                <TrendingUp size={12} className="text-emerald-600" /> Pemasukan
                            </p>
                            <p className="mt-1 text-base font-semibold tabular-nums text-emerald-700">
                                {formatRupiah(stats.pemasukan_periode)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                                <TrendingDown size={12} className="text-rose-600" /> Pengeluaran
                            </p>
                            <p className="mt-1 text-base font-semibold tabular-nums text-rose-700">
                                {formatRupiah(stats.pengeluaran_periode)}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Saldo Akhir</p>
                            <p className="mt-1 text-base font-semibold tabular-nums text-primary">
                                {formatRupiah(stats.total_saldo)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Toolbar: filter periode (kiri, desktop only) + aksi cepat (kanan) */}
                <div className="flex flex-wrap items-center justify-end gap-3 sm:justify-between">
                    <button
                        onClick={() => setModalFilterOpen(true)}
                        className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex"
                    >
                        <Calendar size={16} className="text-primary" />
                        {filter.periode_label}
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setModalKasOpen(true)}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Plus size={16} /> Tambah Kas
                        </button>
                        <button
                            onClick={() => setModalTransaksiOpen(true)}
                            className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/80"
                        >
                            <Plus size={16} /> Catat Transaksi
                        </button>
                    </div>
                </div>

                {/* Stat utama - semua ikut periode terpilih (desktop saja, mobile pakai hero card) */}
                <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Wallet}
                        label={`Total Saldo (${filter.periode_label})`}
                        value={formatRupiah(stats.total_saldo)}
                        tone="total"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label={`Pemasukan (${filter.periode_label})`}
                        value={formatRupiah(stats.pemasukan_periode)}
                        tone="income"
                    />
                    <StatCard
                        icon={TrendingDown}
                        label={`Pengeluaran (${filter.periode_label})`}
                        value={formatRupiah(stats.pengeluaran_periode)}
                        tone="expense"
                    />
                    <StatCard
                        icon={Scale}
                        label={`Selisih (${filter.periode_label})`}
                        value={formatRupiah(stats.selisih_periode)}
                        tone={stats.selisih_periode >= 0 ? "income" : "expense"}
                    />
                </div>

                <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2">
                    <StatCard
                        icon={Receipt}
                        label={`Jumlah Transaksi (${filter.periode_label})`}
                        value={stats.jumlah_transaksi_periode}
                        tone="neutral"
                    />
                    <StatCard
                        icon={ArrowLeftRight}
                        label={`Total Transfer (${filter.periode_label})`}
                        value={formatRupiah(stats.total_transfer_periode)}
                        tone="transfer"
                    />
                </div>

                {/* Card setiap kas */}
                <div>
                    <h2 className="mb-3 text-sm font-semibold text-slate-700">Kas</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {kasList.map((kas) => {
                            const Icon = jenisIcon[kas.jenis] || CircleDollarSign;
                            return (
                                <div key={kas.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">{kas.nama}</p>
                                            <p className="text-xs capitalize text-slate-400">{kas.jenis}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xl font-semibold tabular-nums text-slate-900">
                                        {formatRupiah(kas.saldo)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grafik pemasukan vs pengeluaran + grafik saldo kas */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
                        <h2 className="mb-4 text-sm font-semibold text-slate-700">
                            Tren Pemasukan vs Pengeluaran (6 Bulan)
                        </h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={grafikBulanan}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0F6B4C" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#0F6B4C" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C4573B" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#C4573B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#64748b" }} />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#64748b" }}
                                    tickFormatter={(v) => formatRupiahShort(v)}
                                    width={70}
                                />
                                <Tooltip formatter={(v) => formatRupiah(v)} />
                                <Legend />
                                <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#0F6B4C" fill="url(#colorIncome)" strokeWidth={2} />
                                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#C4573B" fill="url(#colorExpense)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-slate-700">Saldo per Kas</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={grafikSaldoKas} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => formatRupiahShort(v)} />
                                <YAxis type="category" dataKey="nama" tick={{ fontSize: 12, fill: "#64748b" }} width={90} />
                                <Tooltip formatter={(v) => formatRupiah(v)} />
                                <Bar dataKey="saldo" fill="#0F6B4C" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top kategori + aktivitas terbaru */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-slate-700">Top Kategori Pengeluaran</h2>
                        <div className="space-y-4">
                            {topKategoriPengeluaran.length === 0 && (
                                <p className="text-sm text-slate-400">Belum ada data di periode ini.</p>
                            )}
                            {topKategoriPengeluaran.map((k, i) => (
                                <KategoriBar key={i} nama={k.nama} total={Number(k.total)} max={maxPengeluaran} warna={k.warna} />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold text-slate-700">Top Kategori Pemasukan</h2>
                        <div className="space-y-4">
                            {topKategoriPemasukan.length === 0 && (
                                <p className="text-sm text-slate-400">Belum ada data di periode ini.</p>
                            )}
                            {topKategoriPemasukan.map((k, i) => (
                                <KategoriBar key={i} nama={k.nama} total={Number(k.total)} max={maxPemasukan} warna={k.warna} />
                            ))}
                        </div>
                    </div>

                    <div className="hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:block">
                        <h2 className="mb-4 text-sm font-semibold text-slate-700">Aktivitas Terbaru</h2>
                        <div className="space-y-4">
                            {aktivitasTerbaru.length === 0 && <p className="text-sm text-slate-400">Belum ada aktivitas.</p>}
                            {aktivitasTerbaru.map((log) => (
                                <div key={log.id} className="flex gap-3">
                                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                    <div className="text-sm">
                                        <p className="text-slate-700">
                                            <span className="font-medium text-slate-900">{log.user}</span> {log.aktivitas}
                                        </p>
                                        <p className="text-xs text-slate-400">{log.waktu}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <CatatTransaksiModal
                open={modalTransaksiOpen}
                onClose={() => setModalTransaksiOpen(false)}
                kasList={kasList}
                kategoriList={kategoriList}
                onKategoriBaru={handleKategoriBaru}
            />

            <FilterPeriodeModal
                open={modalFilterOpen}
                onClose={() => setModalFilterOpen(false)}
                value={filter}
                onApply={terapkanFilter}
            />

            <TambahKasModal open={modalKasOpen} onClose={() => setModalKasOpen(false)} />
        </>
    );
}

AdminKeuangan.layout = (page) => <DashboardLayout children={page} title="Dashboard Keuangan" />;