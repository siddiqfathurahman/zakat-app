import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import KalkulatorZakatModal from "../components/KalkulatorZakatModal";
import {
    Scale,
    Users,
    Wheat,
    Banknote,
    Download,
    Package,
    CheckCheck,
    Truck,
    Calculator,
    ArrowRight,
} from "lucide-react";
import PemohonListModal from "../components/PemohonListModal";

function DonutChart({ data }) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    const total = data.reduce((s, d) => s + (d.value || 0), 0);

    return (
        <svg viewBox="0 0 150 150" className="h-40 w-40">
            <g transform="translate(75,75) rotate(-90)">
                <circle
                    r={radius}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="16"
                />
                {total === 0 ? (
                    <circle
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                    />
                ) : (
                    data.map((slice, i) => {
                        const pct = total > 0 ? slice.value / total : 0;
                        const dash = pct * circumference;
                        const gap = circumference - dash;
                        const offset = (cumulative / total) * circumference;
                        cumulative += slice.value;
                        return (
                            <circle
                                key={i}
                                r={radius}
                                fill="none"
                                stroke={slice.color}
                                strokeWidth="16"
                                strokeDasharray={`${dash} ${gap}`}
                                strokeDashoffset={-offset}
                                strokeLinecap="butt"
                            />
                        );
                    })
                )}
            </g>
            <text
                x="75"
                y="70"
                textAnchor="middle"
                className="fill-primary text-2xl font-extrabold"
            >
                {total > 0 ? `${data[0].value}%` : "0%"}
            </text>
            <text
                x="75"
                y="90"
                textAnchor="middle"
                className="fill-gray-400 text-[10px] font-semibold"
            >
                Beras
            </text>
        </svg>
    );
}

const ZakatHome = () => {
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [pemohonModalOpen, setPemohonModalOpen] = useState(false);

    const {
        stats,
        paymentMethod,
        mustahikData,
        totalMustahik,
        distribusi,
        hargaBeras,
        pemohon,
        archives = [],
    } = usePage().props;

    const statCards = [
        {
            label: "Total Zakat",
            value: stats.totalAllLabel,
            icon: Scale,
        },
        {
            label: "Total Muzakki",
            value: stats.jumlahPembayar.toLocaleString("id-ID"),
            icon: Users,
        },
        {
            label: "Zakat Fitrah (Beras)",
            value: `${Number(stats.totalBerasKg).toLocaleString("id-ID")} kg`,
            icon: Wheat,
        },
        {
            label: "Zakat Uang",
            value: stats.totalUangLabel,
            icon: Banknote,
        },
    ];

    const distribusiItems = [
        {
            icon: Package,
            label: "Total Bungkus",
            value: `${distribusi.totalBungkus} Paket`,
        },
        {
            icon: CheckCheck,
            label: "Disalurkan Jamaah Masjid",
            value: `${distribusi.totalBungkus - distribusi.kepadaLembaga} Paket`,
        },
        {
            icon: Truck,
            label: "Daftar Lembaga & Pemohon Luar",
            value: `${distribusi.kepadaLembaga} Paket`,
        },
    ];

    return (
        <AppLayout>
            <div className="w-full">
                <section className="content px-4 py-8 md:px-6">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold tracking-wide text-primary">
                                UPDATE REAL-TIME
                            </span>
                            <h1 className="mt-2 md:text-3xl text-2xl font-extrabold text-primary font-second">
                                Laporan dan Statistik Zakat
                            </h1>
                            <p className="mt-1 text-sm text-gray-400">
                                Tinjau progres pengelolaan zakat Masjid Al Anhar.
                                <br />
                                Data diperbaharui setiap 24 jam.
                            </p>
                        </div>

                    </div>

                    {/* Stat Cards */}
                    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {statCards.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/70"
                                >
                                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <p className="text-xs text-gray-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.6fr]">
                        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/70">
                            <h3 className="mb-4 text-sm font-bold text-gray-900">
                                Metode Pembayaran
                            </h3>
                            <div className="flex flex-col items-center">
                                <DonutChart data={paymentMethod} />
                                <div className="mt-4 w-full space-y-2">
                                    {paymentMethod.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                {item.label}
                                            </span>
                                            <span className="font-bold text-gray-700">
                                                {item.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/70">
                            <div className="mb-1 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-900">
                                    Data Penerima (Mustahik)
                                </h3>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-primary">
                                    {totalMustahik} Mustahik
                                </span>
                            </div>
                            <p className="mb-4 text-xs text-gray-400">
                                Warga berdasarkan wilayah RT
                            </p>

                            {mustahikData.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    Belum ada data mustahik.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {mustahikData.map((item, i) => (
                                        <div
                                            key={i}
                                            className="rounded-xl bg-gray-50 p-3 text-center"
                                        >
                                            <p className="text-[12px] font-bold text-gray-800">
                                                {item.code}
                                            </p>
                                            <p className="mt-1 text-xl font-extrabold text-gray-900">
                                                {item.count}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-extrabold text-primary font-second">
                            Status Distribusi Zakat
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Data persiapan dan penyaluran paket zakat fitrah
                            kepada mustahik yang berhak.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
                            <div className="space-y-3">
                                {distribusiItems.map((item, i) => {
                                    const Icon = item.icon;
                                    const isLembaga =
                                        item.label === "Daftar Lembaga & Pemohon Luar";
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/70"
                                        >
                                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-400">
                                                    {item.label}
                                                </p>
                                                <p className="text-base font-extrabold text-gray-900">
                                                    {item.value}
                                                </p>
                                            </div>
                                            {isLembaga && (
                                                <button
                                                    onClick={() =>
                                                        setPemohonModalOpen(
                                                            true,
                                                        )
                                                    }
                                                    className="text-xs font-bold text-primary underline underline-offset-2"
                                                >
                                                    Lihat Daftar
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-white">
                                <div>
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                        <Calculator className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-lg font-extrabold leading-snug">
                                        Belum Menunaikan Zakat?
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-200">
                                        Mudah dan cepat, cukup masukkan data dan
                                        kami bantu hitungkan jumlah zakat Anda.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setCalculatorOpen(true)}
                                    className="mt-5 flex w-fit items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-primary transition hover:brightness-105"
                                >
                                    Kalkulasikan Zakat
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Public Zakat Archives Section */}
                    {archives && archives.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-extrabold text-primary font-second">
                                Arsip Laporan Zakat Fitrah
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Unduh laporan pertanggungjawaban pengelolaan zakat fitrah dari tahun-tahun sebelumnya.
                            </p>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {archives.map((archive) => {
                                    const summary = archive.summary || {};
                                    return (
                                        <div
                                            key={archive.id}
                                            className="rounded-2xl bg-white p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-primary">
                                                        Tahun {archive.tahun}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        Diarsipkan: {archive.created_at}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-xs text-gray-600 mb-6">
                                                    <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                                        <span>Muzakki:</span>
                                                        <span className="font-semibold text-gray-900">{summary.jumlah_pembayar || 0} orang</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                                        <span>Total Beras:</span>
                                                        <span className="font-semibold text-amber-600">{(summary.total_beras || 0).toLocaleString("id-ID")} kg</span>
                                                    </div>
                                                    <div className="flex justify-between pb-1">
                                                        <span>Total Uang:</span>
                                                        <span className="font-semibold text-emerald-600">
                                                            {new Intl.NumberFormat("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0
                                                            }).format(summary.total_uang || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={`/zakat/archive/${archive.id}/download-public`}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-emerald-800 py-2.5 text-xs font-bold text-white transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                Unduh Laporan PDF
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                <KalkulatorZakatModal
                    open={calculatorOpen}
                    onClose={() => setCalculatorOpen(false)}
                    hargaBerasPerKg={hargaBeras?.per_kg ?? 0}
                    hargaPer25Kg={hargaBeras?.per_2_5kg ?? 0}
                />

                <PemohonListModal
                    open={pemohonModalOpen}
                    onClose={() => setPemohonModalOpen(false)}
                    pemohon={pemohon}
                />
            </div>
        </AppLayout>
    );
};

export default ZakatHome;
