import { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import KalkulatorZakatModal from "../components/KalkulatorZakatModal";
import {
  Scale,
  Users,
  Wheat,
  Banknote,
  Download,
  ChevronDown,
  Package,
  CheckCheck,
  Truck,
  Calculator,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Total",
    value: "2 Ton",
    change: "+12% dari tahun lalu",
    positive: true,
    icon: Scale,
  },
  {
    label: "Total Muzakki",
    value: "1,248",
    change: "+5% dari bulan ini",
    positive: true,
    icon: Users,
  },
  {
    label: "Zakat Fitrah (Beras)",
    value: "3,120 kg",
    change: "-2.1% Ton Beras",
    positive: false,
    icon: Wheat,
  },
  {
    label: "Zakat Uang",
    value: "Rp 84.5M",
    change: "Konversi beras & uang tunai",
    neutral: true,
    icon: Banknote,
  },
];

const paymentMethod = [
  { label: "Pembayaran Beras", value: 65, color: "#0d4f3c" },
  { label: "Pembayaran Uang", value: 35, color: "#b8924a" },
];

const mustahikData = [
  { code: "RT 48", count: 62, label: "Bungkus" },
  { code: "RT 49", count: 58, label: "Bungkus" },
  { code: "RT 50", count: 74, label: "Bungkus" },
  { code: "RT 51", count: 45, label: "Bungkus" },
  { code: "RT 52", count: 51, label: "Bungkus" },
  { code: "RT 53", count: 68, label: "Bungkus" },
  { code: "RT 56", count: 53, label: "Bungkus" },
  { code: "RT 57", count: 69, label: "Lainnya" },
];

const totalMustahik = mustahikData.reduce((sum, m) => sum + m.count, 0);

const distribusi = [
  {
    icon: Package,
    label: "Total Total Bungkus",
    value: "500 Paket",
    sub: null,
  },
  {
    icon: CheckCheck,
    label: "Disalurkan Jamaah Masjid",
    value: "312 Paket",
    sub: null,
  },
  {
    icon: Truck,
    label: "Disalurkan Ke Lembaga",
    value: "188 Paket",
    sub: null,
  },
];

function DonutChart({ data }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <svg viewBox="0 0 150 150" className="h-40 w-40">
      <g transform="translate(75,75) rotate(-90)">
        <circle r={radius} fill="none" stroke="#f3f4f6" strokeWidth="16" />
        {data.map((slice, i) => {
          const dash = (slice.value / 100) * circumference;
          const gap = circumference - dash;
          const offset = (cumulative / 100) * circumference;
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
        })}
      </g>
      <text
        x="75"
        y="70"
        textAnchor="middle"
        className="fill-primary text-2xl font-extrabold"
      >
        {data[0].value}%
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
                Tinjau progres pengelolaan zakat Masjid Al Anhar pada
                Ramadhan 1445H.
                <br />
                Data diperbaharui setiap 24 jam.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* <button className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600">
                Tahun 1445H
                <ChevronDown className="h-3.5 w-3.5" />
              </button> */}
              <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
                <Download className="h-3.5 w-3.5" />
                Unduh Laporan PDF
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/70"
                >
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-xl font-extrabold text-gray-900">
                    {item.value}
                  </p>
                  <p
                    className={`mt-1 text-[11px] font-semibold ${
                      item.neutral
                        ? "text-gray-400"
                        : item.positive
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {item.change}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Metode Pembayaran + Data Penerima */}
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
                          style={{ backgroundColor: item.color }}
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

            {/* Data Penerima (Mustahik) */}
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

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {mustahikData.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-gray-50 p-3 text-center"
                  >
                    <p className="text-[10px] font-bold text-gray-400">
                      {item.code}
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-gray-900">
                      {item.count}
                    </p>
                    <p className="text-[10px] text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Distribusi Zakat */}
          <div className="mt-10">
            <h2 className="text-2xl font-extrabold text-primary font-second">
              Status Distribusi Zakat
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Data persiapan dan penyaluran paket zakat fitrah kepada
              mustahik yang berhak.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
              {/* List status */}
              <div className="space-y-3">
                {distribusi.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/70"
                    >
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-base font-extrabold text-gray-900">
                          {item.value}{" "}
                          {item.sub && (
                            <span className="text-xs font-semibold text-emerald-600">
                              {item.sub}
                            </span>
                          )}
                        </p>
                      </div>
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
                    Mudah dan cepat, cukup masukkan data dan kami bantu
                    hitungkan jumlah zakat Anda.
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
        </section>

        <KalkulatorZakatModal
          open={calculatorOpen}
          onClose={() => setCalculatorOpen(false)}
        />
      </div>
    </AppLayout>
  );
};

export default ZakatHome;
