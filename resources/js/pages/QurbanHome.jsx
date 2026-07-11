import { useCallback, useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import { useRealtimeChannel } from "../hooks/useRealtime";
import {
  ShoppingBag,
  Archive,
  RefreshCw,
  Wallet,
} from "lucide-react";

const kantongIcons = [ShoppingBag, Archive, Archive];

const formatPct = (done, total) =>
  total === 0 ? 0 : Math.round((done / total) * 100);

const formatLastUpdate = (date) => {
  const datePart = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);

  return `${datePart} – ${timePart} WIB`;
};

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

const QurbanHome = ({
  lastUpdate,
  kantongStats = [],
  pemotongan = [],
  penimbangan = [],
  totalBobotBersih = 0,
  shohibulProgress = 0,
  shohibulRT = [],
  totalTerkirim = 0,
  totalShohibul = 0,
  distribusiRT = [],
  noteKulit = [],
  hasilKulit = { nominal: "Rp 0", keterangan: "" },
}) => {
  const totalPemotonganSelesai = pemotongan.reduce((s, h) => s + h.selesai, 0);
  const totalPemotonganTotal = pemotongan.reduce((s, h) => s + h.total, 0);
  const totalPemotonganPct = formatPct(totalPemotonganSelesai, totalPemotonganTotal);

  const [displayLastUpdate, setDisplayLastUpdate] = useState(lastUpdate);

  useEffect(() => {
    setDisplayLastUpdate(lastUpdate);
  }, [lastUpdate]);

  const refreshDashboard = useCallback(() => {
    setDisplayLastUpdate(formatLastUpdate(new Date()));

    router.reload({
      only: [
        "kantongStats",
        "pemotongan",
        "penimbangan",
        "totalBobotBersih",
        "shohibulProgress",
        "shohibulRT",
        "totalTerkirim",
        "totalShohibul",
        "distribusiRT",
        "hasilKulit",
        "noteKulit",
        "lastUpdate",
      ],
      preserveScroll: true,
      preserveState: true,
    });
  }, []);

  useRealtimeChannel("realtime-qurban", "realtime-qurban.updated", refreshDashboard);
  useRealtimeChannel("shohibul-delivery", "delivery.updated", refreshDashboard);
  useRealtimeChannel("penerima-qurban", "penerima-qurban.updated", refreshDashboard);

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
              LAST UPDATE: {displayLastUpdate}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {kantongStats.map((item, i) => {
              const Icon = kantongIcons[i] || ShoppingBag;
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

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1.1fr]" style={{ gridTemplateRows: "auto auto" }}>

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
                    {h.waktu && (
                      <p className="mt-1 text-right text-[11px] font-semibold text-gray-400">
                        Selesai pukul {h.waktu} WIB
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-gray-400">
                Total Progress Pemotongan{" "}
                <span className="font-bold text-primary">{totalPemotonganPct}% Selesai</span>
              </p>
            </div>

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
                  {h.waktu && (
                    <p className="mt-1 text-right text-[11px] font-semibold text-gray-400">
                      Selesai pukul {h.waktu} WIB
                    </p>
                  )}
                </div>
              ))}
              </div>
              <p className="mt-5 text-xs text-gray-400">
                Total bobot bersih:{" "}
                <span className="font-bold text-primary">
                  {Number(totalBobotBersih).toLocaleString("id-ID")} Kg
                </span>
              </p>
            </div>

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
                  const full = r.terkirim === r.total && r.total > 0;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl text-center px-3 py-2.5 ${full ? "bg-white/20" : "bg-white/10"}`}
                    >
                      <p className="text-[9px] font-semibold text-white">{r.rt}</p>
                      <p className={`text-md font-extrabold ${full ? "text-secondary" : "text-white"}`}>
                        {r.terkirim} / {r.total}
                      </p>
                      {r.waktu && (
                        <p className="mt-0.5 text-[9px] font-semibold text-secondary">
                          {r.waktu} WIB
                        </p>
                      )}
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

          <div className="flex items-center justify-between rounded-2xl bg-primary px-6 py-5 shadow-sm">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-white/60">
                HASIL PENJUALAN KULIT
              </p>
              <p className="mt-1 text-2xl font-extrabold text-secondary">
                {hasilKulit.nominal}
              </p>
              <p className="mt-1 text-xs text-white/60">{noteKulit}</p>
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