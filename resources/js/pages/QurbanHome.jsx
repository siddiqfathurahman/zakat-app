import AppLayout from "../Layout/AppLayout";
import {
  ShoppingBag,
  Archive,
  RefreshCw,
  MapPin,
  Wallet,
  Navigation,
} from "lucide-react";

const lastUpdate = "10 JULI 2024 – 14:20 WIB";

const kantongStats = [
  { label: "Total Kantong", value: "2,240 Bags", icon: ShoppingBag },
  { label: "Total Kantong Kambing", value: "450 Bags", icon: Archive },
  { label: "Total Kantong Kambing", value: "450 Bags", icon: Archive },
];

const pemotongan = [
  { hewan: "Sapi", selesai: 12, total: 15, color: "#0d4f3c" },
  { hewan: "Kambing", selesai: 28, total: 45, color: "#b8924a" },
];
const totalPemotonganPct = Math.round(
  (pemotongan.reduce((s, h) => s + h.selesai, 0) /
    pemotongan.reduce((s, h) => s + h.total, 0)) *
    100
);

const penimbangan = [
  { hewan: "Sapi", selesai: 3200, total: 3500, satuan: "Kg", color: "#0d4f3c" },
  { hewan: "Kambing", selesai: 980, total: 1300, satuan: "Kg", color: "#b8924a" },
];
const totalBobotBersih = penimbangan.reduce((s, h) => s + h.selesai, 0);

const shohibulProgress = 70; 

const shohibulRT = [
  { rt: "RT 48", terkirim: 30, total: 30 },
  { rt: "RT 49", terkirim: 28, total: 30 },
  { rt: "RT 50", terkirim: 35, total: 35 },
  { rt: "RT 51", terkirim: 20, total: 25 },
  { rt: "RT 52", terkirim: 10, total: 25 },
  { rt: "RT 53", terkirim: 0, total: 30 },
  { rt: "RT 56", terkirim: 0, total: 35 },
  { rt: "RT 57", terkirim: 0, total: 30 },
];
const totalTerkirim = shohibulRT.reduce((s, r) => s + r.terkirim, 0);
const totalShohibul = shohibulRT.reduce((s, r) => s + r.total, 0);

const distribusiRT = [
  { rt: "RT 48", sapi: 0, kambing: 0, pct: 100 },
  { rt: "RT 49", sapi: 2, kambing: 4, pct: 95 },
  { rt: "RT 50", sapi: 0, kambing: 0, pct: 100 },
  { rt: "RT 51", sapi: 10, kambing: 8, pct: 80 },
  { rt: "RT 52", sapi: 84, kambing: 56, pct: 40 },
  { rt: "RT 53", sapi: 110, kambing: 0, pct: 0 },
  { rt: "RT 56", sapi: 130, kambing: 0, pct: 0 },
  { rt: "RT 57", sapi: 125, kambing: 0, pct: 0 },
];

const hasilKulit = {
  nominal: "Rp 12.450.000",
  keterangan: "100% Hasil penjualan Kulit digunakan untuk baksos oleh Remaja Masjid"
};

const formatPct = (done, total) =>
  total === 0 ? 0 : Math.round((done / total) * 100);

function ProgressBar({ pct, color }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color || "#0d4f3c" }}
      />
    </div>
  );
}

function DonutChart({ pct }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg viewBox="0 0 140 140" className="h-36 w-36">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#ffffff22" strokeWidth="14" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="#FFDF9B"
        strokeWidth="14"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="80" textAnchor="middle" fill="white" fontSize="22" fontWeight="800">
        {pct}%
      </text>
    </svg>
  );
}

const QurbanHome = () => {
  return (
    <AppLayout>
      <div className="w-full">
        <section className="content space-y-5 px-4 py-8 md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 mb-2 text-[10px] font-bold tracking-wide text-primary">
                UPDATE REAL-TIME
              </span>
              <p className="md:text-3xl text-xl font-second font-bold text-primary">Dashboard Laporan Qurban</p>
              <p className="text-sm text-gray-500">
                Update realtime pelaksanaan pemotongan dan distribusi hewan qurban.
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-[11px] font-bold text-primary whitespace-nowrap self-start">
              <RefreshCw className="h-3 w-3" />
              LAST UPDATE: {lastUpdate}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {kantongStats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-white px-5 py-4 shadow-sm">
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-1 text-lg font-extrabold text-gray-900">{item.value}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Grid Utama: 3 kolom, Shohibul span 2 baris ── */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1.1fr]" style={{ gridTemplateRows: "auto auto" }}>

            {/* Laporan Pemotongan — baris 1, kol 1 */}
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Laporan Pemotongan</span>
                <span>Jumlah (Ekor)</span>
              </div>
              <div className="space-y-5">
                {pemotongan.map((h, i) => (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-800">{h.hewan}</span>
                      <span className="font-extrabold" style={{ color: h.color }}>
                        {h.selesai} / {h.total} Ekor
                      </span>
                    </div>
                    <ProgressBar pct={formatPct(h.selesai, h.total)} color={h.color} />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-gray-400">
                Total Progress Pemotongan{" "}
                <span className="font-bold text-primary">{totalPemotonganPct}% Selesai</span>
              </p>
            </div>

            {/* Progres Penimbangan — baris 1, kol 2 */}
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Progres Penimbangan</span>
                <span>Kg</span>
              </div>
              <div className="space-y-5">
                {penimbangan.map((h, i) => (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-800">{h.hewan}</span>
                      <span className="font-extrabold" style={{ color: h.color }}>
                        {h.selesai.toLocaleString("id-ID")} / {h.total.toLocaleString("id-ID")} {h.satuan}
                      </span>
                    </div>
                    <ProgressBar pct={formatPct(h.selesai, h.total)} color={h.color} />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-gray-400">
                Total bobot bersih:{" "}
                <span className="font-bold text-primary">{totalBobotBersih.toLocaleString("id-ID")} Kg</span>
              </p>
            </div>

            {/* Pengiriman Shohibul — kol 3, span 2 baris */}
            <div
              className="rounded-2xl bg-primary p-5 text-white shadow-sm"
              style={{ gridRow: "1 / span 2" }}
            >
              <p className="mb-3 text-sm font-semibold">Pengiriman Shohibul</p>

              <div className="flex justify-center py-2">
                <DonutChart pct={shohibulProgress} />
              </div>

              <p className="mt-1 text-center text-[11px] font-bold tracking-widest text-white">
                PROGRESS PENGANTARAN
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {shohibulRT.map((r, i) => {
                  const full = r.terkirim === r.total;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl text-center px-3 py-2.5 ${full ? "bg-white/20" : "bg-white/10"}`}
                    >
                      <p className="text-[9px] font-semibold text-white">{r.rt}</p>
                      <p className={`text-md font-extrabold ${full ? "text-secondary" : "text-white"}`}>
                        {r.terkirim} / {r.total}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-[11px] text-white/60">
                Total: <span className="font-bold text-white">{totalTerkirim} / {totalShohibul}</span> Shohibul Terantar
              </p>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-xs font-bold text-primary transition hover:brightness-105">
                Pantau Humas Realtime
              </button>
            </div>

            {/* Distribusi Wilayah — baris 2, kol 1–2 */}
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-primary">Distribusi Wilayah (RT)</p>
                <div className="flex items-center gap-4 text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Terdistribusi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-200" /> Belum
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {distribusiRT.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-800">{item.rt}</span>
                      <span className="text-xs text-gray-500">
                        Sapi: {item.sapi}, Kambing: {item.kambing}{" "}
                        <span className="font-bold text-primary">({item.pct}%)</span>
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar
                        pct={item.pct}
                        color={item.pct === 100 ? "#0d4f3c" : item.pct >= 50 ? "#b8924a" : "#e5e7eb"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Hasil Penjualan Kulit ── */}
          <div className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 shadow-sm">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-white/60">
                HASIL PENJUALAN KULIT
              </p>
              <p className="mt-1 text-2xl font-extrabold text-secondary">
                {hasilKulit.nominal}
              </p>
              <p className="mt-1 text-xs text-white/60">{hasilKulit.keterangan}</p>
            </div>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-secondary">
              <Wallet className="h-6 w-6" />
            </span>
          </div>

        </section>
      </div>
    </AppLayout>
  );
};

export default QurbanHome;