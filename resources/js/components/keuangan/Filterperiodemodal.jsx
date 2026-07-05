import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const PRESETS = [
    ["today", "Hari ini"],
    ["7_days", "7 hari terakhir"],
    ["30_days", "30 hari terakhir"],
    ["this_week", "Minggu ini"],
    ["this_month", "Bulan ini"],
    ["last_month", "Bulan lalu"],
    ["3_months", "3 bulan terakhir"],
    ["this_year", "Tahun ini"],
    ["12_months", "12 bulan terakhir"],
    ["all_time", "Sejak awal"],
];

function PresetButton({ label, active, onClick }) {
    if (active) {
        return (
            <button
                type="button"
                onClick={onClick}
                className="flex items-center justify-between rounded-full border border-primary px-4 py-2.5 text-sm font-medium text-primary"
            >
                {label}
                <Check size={16} className="ml-2 text-primary" />
            </button>
        );
    }
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
        >
            {label}
        </button>
    );
}

export default function FilterPeriodeModal({ open, onClose, value, onApply }) {
    const [periode, setPeriode] = useState(value?.periode || "this_month");
    const [dari, setDari] = useState(value?.tanggal_dari || "");
    const [sampai, setSampai] = useState(value?.tanggal_sampai || "");

    useEffect(() => {
        if (open) {
            setPeriode(value?.periode || "this_month");
            setDari(value?.tanggal_dari || "");
            setSampai(value?.tanggal_sampai || "");
        }
    }, [open, value]);

    if (!open) return null;

    const pilihPreset = (key) => setPeriode(key);

    const ubahTanggalManual = (field, val) => {
        setPeriode("custom");
        if (field === "dari") setDari(val);
        else setSampai(val);
    };

    const terapkan = () => {
        onApply({ periode, tanggal_dari: dari, tanggal_sampai: sampai });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Pilih periode laporan</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {PRESETS.map(([key, label]) => (
                        <PresetButton
                            key={key}
                            label={label}
                            active={periode === key}
                            onClick={() => pilihPreset(key)}
                        />
                    ))}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-2 text-sm font-medium text-slate-700">Tanggal khusus</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-slate-400">Dari</label>
                            <input
                                type="date"
                                value={dari}
                                onChange={(e) => ubahTanggalManual("dari", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-slate-400">Sampai</label>
                            <input
                                type="date"
                                value={sampai}
                                onChange={(e) => ubahTanggalManual("sampai", e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={terapkan}
                    className="mt-6 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
                >
                    Terapkan
                </button>
            </div>
        </div>
    );
}