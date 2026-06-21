import React, { useEffect, useState } from "react";
import axios from "axios";
import { Moon, Sunrise, Sun, Sunset, MapPin, Calendar, Clock } from "lucide-react";

const prayerDefs = [
  { key: "Fajr",    label: "Subuh",   Icon: Sunrise },
  { key: "Sunrise", label: "Terbit",  Icon: Sun     },
  { key: "Dhuhr",   label: "Dzuhur",  Icon: Sun     },
  { key: "Asr",     label: "Ashar",   Icon: Sun     },
  { key: "Maghrib", label: "Maghrib", Icon: Sunset  },
  { key: "Isha",    label: "Isya",    Icon: Moon    },
];

const schedule5 = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function JadwalSholat() {
  const [timings, setTimings] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    axios
      .get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Yogyakarta", country: "Indonesia", method: 8 },
      })
      .then((res) => setTimings(res.data.data.timings))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const wib = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const pad = (n) => String(n).padStart(2, "0");
  const clockStr = `${pad(wib.getHours())}:${pad(wib.getMinutes())}:${pad(wib.getSeconds())}`;
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const dateStr = `${days[wib.getDay()]}, ${wib.getDate()} ${months[wib.getMonth()]} ${wib.getFullYear()}`;

  const curMin = wib.getHours() * 60 + wib.getMinutes();
  const next = timings
    ? schedule5.find((p) => curMin < toMin(timings[p])) || schedule5[0]
    : null;

  let countdown = "";
  if (timings && next) {
    const [h, m] = timings[next].split(":").map(Number);
    let target = new Date(wib);
    target.setHours(h, m, 0, 0);
    if (target <= wib) target.setDate(target.getDate() + 1);
    const diff = target - wib;
    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    countdown = `${hh}j ${mm}m ${ss}d`;
  }

  const nextLabel = prayerDefs.find((p) => p.key === next)?.label;

  return (
    <div className="content px-4 md:px-8 py-10 bg-gray-50">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-2xl md:text-3xl font-bold font-second text-primary   ">Jadwal Sholat</h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-800">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> Yogyakarta, ID
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            <span className="font-bold text-gray-700 tabular-nums">{clockStr}</span>
            <span className="text-xs">WIB</span>
          </span>
        </div>
      </div>

      {/* Prayer Cards */}
      {timings ? (
        <>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {prayerDefs.map(({ key, label, Icon }) => {
              const isNext = key === next;
              return (
                <div
                  key={key}
                  className={`text-center py-3 px-2 transition-all border-t-4 ${
                    isNext
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                >
                  <Icon
                    size={22}
                    className={`mx-auto mb-1.5 ${isNext ? "text-green-500" : "text-gray-800"}`}
                  />
                  <div className={`md:text-[14px] text-[10px] font-bold uppercase tracking-wider ${isNext ? "text-green-600" : "text-gray-800"}`}>
                    {label}
                  </div>
                  <div className="text-sm md:text-4xl font-extrabold text-gray-800 mt-1">
                    {timings[key]?.substring(0, 5)}
                  </div>
                  <div className={`md:text-[12px] text-[10px] font-medium ${isNext ? "text-green-800" : "text-gray-800"}`}>
                    WIB
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next bar */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-2">
            <div>
              <div className="text-xs text-gray-800">Waktu sholat berikutnya</div>
              <div className="text-sm font-bold text-green-600">
                {nextLabel} · {timings[next]?.substring(0, 5)} WIB
              </div>
            </div>
            <div className="text-sm font-semibold text-green-600">{countdown}</div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-800 text-sm">Memuat jadwal sholat...</div>
      )}
    </div>
  );
}