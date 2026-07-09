import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { CheckCircle2, Circle, Scale, Truck, X, Beef, Drumstick } from "lucide-react";
import QurbanLayout from "../../Layout/QurbanLayout";

export default function Realtime({ realtime, statsHewan, shohibul, pengirimanPerRT, pengirimanTotal }) {
  const [tab, setTab] = useState("sapi");
  const [openRT, setOpenRT] = useState(null);
  const [beratInput, setBeratInput] = useState({});

  const toggle = (routeName, id) => {
    router.post(route(routeName, id), {}, { preserveScroll: true, preserveState: true });
  };

  const submitBerat = (id) => {
    const value = beratInput[id];
    if (!value) return;
    router.post(
      route("qurban.realtime.timbang", id),
      { berat_kg: value },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setBeratInput((prev) => ({ ...prev, [id]: "" })),
      }
    );
  };

  const ekorFiltered = realtime.filter((r) => r.jenis_hewan === tab);
  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
  const totalPengirimanPct = pct(pengirimanTotal.terkirim, pengirimanTotal.total);

  const totalEkor = (statsHewan.sapi?.total || 0) + (statsHewan.kambing?.total || 0);

  const jenisTheme = {
    sapi: {
      badge: "bg-blue-100 text-blue-700",
      bar: "bg-blue-600",
      icon: Beef,
      iconColor: "text-blue-600",
    },
    kambing: {
      badge: "bg-green-100 text-green-700",
      bar: "bg-green-600",
      icon: Drumstick,
      iconColor: "text-green-600",
    },
  };

  return (
    <QurbanLayout>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Monitoring Realtime Qurban</h1>
      </div>

      {/* Stats ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4 border bg-orange-50 border-orange-200">
          <div className="text-xs text-black mb-1">Total Ekor Terdaftar</div>
          <div className="text-3xl font-bold text-orange-700">{totalEkor}</div>
          <div className="text-xs text-black mt-0.5">
            {statsHewan.sapi?.total || 0} sapi &bull; {statsHewan.kambing?.total || 0} kambing
          </div>
        </div>
        <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
          <div className="text-xs text-black mb-1">Progress Pemotongan</div>
          <div className="text-3xl font-bold text-blue-700">
            {pct(
              (statsHewan.sapi?.potong || 0) + (statsHewan.kambing?.potong || 0),
              totalEkor
            )}
            %
          </div>
          <div className="text-xs text-black mt-0.5">
            {(statsHewan.sapi?.potong || 0) + (statsHewan.kambing?.potong || 0)} / {totalEkor} ekor sudah dipotong
          </div>
        </div>
        <div className="rounded-xl p-4 border bg-green-50 border-green-200">
          <div className="text-xs text-black mb-1">Progress Pengiriman Shohibul</div>
          <div className="text-3xl font-bold text-green-700">{totalPengirimanPct}%</div>
          <div className="text-xs text-black mt-0.5">
            {pengirimanTotal.terkirim} / {pengirimanTotal.total} shohibul terkirim
          </div>
        </div>
      </div>

      {/* Progress per jenis hewan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {["sapi", "kambing"].map((jenis) => {
          const s = statsHewan[jenis];
          const theme = jenisTheme[jenis];
          const Icon = theme.icon;
          return (
            <div key={jenis} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.badge}`}>
                  <Icon size={16} />
                </span>
                <h2 className="text-sm font-bold text-gray-800 capitalize">{jenis}</h2>
                <span className={`ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${theme.badge}`}>
                  {s.total} ekor
                </span>
              </div>
              <ProgressRow label="Penyembelihan" done={s.sembelih} total={s.total} color={theme.bar} waktu={s.waktu_sembelih} />
              <ProgressRow label="Pemotongan" done={s.potong} total={s.total} color={theme.bar} waktu={s.waktu_potong} />
              <ProgressRow label="Penimbangan" done={s.timbang} total={s.total} color={theme.bar} waktu={s.waktu_timbang} />
              <div className="text-xs text-black mt-2 border-t border-gray-100 pt-2">
                Total bobot tercatat: <span className="font-semibold text-gray-700">{s.total_berat ?? 0} Kg</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pengiriman shohibul per RT */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="bg-orange-700 px-5 py-3 flex items-center gap-2">
          <Truck size={18} className="text-white" />
          <h2 className="text-sm font-bold text-white">Pengiriman Shohibul per RT</h2>
          <span className="ml-auto text-xs font-semibold text-white/90">
            {pengirimanTotal.terkirim} / {pengirimanTotal.total} terkirim ({totalPengirimanPct}%)
          </span>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {pengirimanPerRT.map((rt) => {
            const rtPct = pct(rt.terkirim, rt.total);
            const done = rtPct === 100;
            return (
                <button
                key={rt.rt}
                onClick={() => setOpenRT(String(openRT) === String(rt.rt) ? null : rt.rt)}
                className={`rounded-xl p-3 text-center border transition ${
                    done
                    ? "bg-green-50 border-green-200 hover:bg-green-100"
                    : "bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300"
                }`}
                >
                <p className="text-xs text-black mb-0.5">RT {rt.rt}</p>
                <p className={`font-bold text-sm ${done ? "text-green-700" : "text-orange-700"}`}>
                    {rt.terkirim} / {rt.total}
                </p>
                {done && rt.waktu_selesai && (
                    <p className="mt-0.5 text-[10px] font-semibold text-green-600">
                    {rt.waktu_selesai} WIB
                    </p>
                )}
                </button>
            );
            })}
          {pengirimanPerRT.length === 0 && (
            <p className="col-span-full text-center text-sm text-black py-6">Belum ada data shohibul.</p>
          )}
        </div>
      </div>

      {/* Modal detail per RT */}
      {openRT && (
        <PengirimanRTModal
          rt={openRT}
          shohibul={shohibul.filter((s) => String(s.rt) === String(openRT))}
          onClose={() => setOpenRT(null)}
          onToggle={(id) => toggle("qurban.realtime.kirim", id)}
        />
      )}

      {/* Tabel progress per ekor */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 pt-4 flex gap-2">
          {["sapi", "kambing"].map((j) => (
            <button
              key={j}
              onClick={() => setTab(j)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                tab === j ? "bg-orange-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-50"
              }`}
            >
              {j}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto p-5 pt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-700 text-white">
                {["No. Hewan", "Jml Shohibul", "Sembelih", "Potong", "Timbang (Kg)"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide first:rounded-l-lg last:rounded-r-lg">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ekorFiltered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-black text-sm">
                    Belum ada data ekor untuk jenis ini
                  </td>
                </tr>
              ) : (
                ekorFiltered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`border-b border-gray-100 hover:bg-orange-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">#{r.nomor_hewan}</td>
                    <td className="px-4 py-3 text-gray-600">{r.jumlah_shohibul}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle("qurban.realtime.sembelih", r.id)}>
                        {r.status_sembelih ? (
                          <CheckCircle2 className="text-orange-700" size={20} />
                        ) : (
                          <Circle className="text-gray-300" size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle("qurban.realtime.potong", r.id)}>
                        {r.status_potong ? (
                          <CheckCircle2 className="text-orange-700" size={20} />
                        ) : (
                          <Circle className="text-gray-300" size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder={r.berat_kg ?? "0"}
                          value={beratInput[r.id] ?? ""}
                          onChange={(e) => setBeratInput((p) => ({ ...p, [r.id]: e.target.value }))}
                          className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                        />
                        <button onClick={() => submitBerat(r.id)} className="text-orange-700 hover:text-orange-900">
                          <Scale size={18} />
                        </button>
                        {r.status_timbang && <CheckCircle2 className="text-orange-700" size={18} />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </QurbanLayout>
  );
}

function PengirimanRTModal({ rt, shohibul, onClose, onToggle }) {
  const terkirim = shohibul.filter((s) => s.status_kirim).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-700 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Daftar Shohibul RT {rt}</h2>
            <p className="text-xs text-white/80">{terkirim} / {shohibul.length} sudah terkirim</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto divide-y divide-gray-100 px-6">
          {shohibul.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.nama}</p>
                <p className="text-xs text-black">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mr-1 ${
                    s.jenis_hewan === "sapi" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}>
                    {s.jenis_hewan} #{s.nomor_hewan}
                  </span>
                  Panitia: {s.panitia}
                </p>
              </div>
              <button onClick={() => onToggle(s.id)}>
                {s.status_kirim ? (
                  <CheckCircle2 className="text-orange-700" size={24} />
                ) : (
                  <Circle className="text-gray-300" size={24} />
                )}
              </button>
            </div>
          ))}
          {shohibul.length === 0 && (
            <p className="text-sm text-black py-6 text-center">Tidak ada data shohibul di RT ini.</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, done, total, color, waktu }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-black">{label}</span>
        <span className="font-semibold text-gray-700">
          {done} / {total} ({percent}%)
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percent}%` }} />
      </div>
      {percent === 100 && waktu && (
        <p className="mt-1 text-right text-[11px] font-semibold text-gray-400">
          Selesai pukul {waktu} WIB
        </p>
      )}
    </div>
  );
}