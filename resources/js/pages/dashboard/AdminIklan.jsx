import React, { useState, useMemo } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    Plus, Trash2, X, AlertTriangle, Upload,
    ToggleLeft, ToggleRight, Tag, ChevronLeft, ChevronRight,
} from "lucide-react";

const STATUS_STYLE = {
    active:   "bg-emerald-50 text-emerald-700",
    upcoming: "bg-blue-50 text-blue-700",
    selesai:  "bg-gray-100 text-gray-500",
    nonaktif: "bg-red-50 text-red-500",
};
const STATUS_LABEL = {
    active:   "Aktif",
    upcoming: "Upcoming",
    selesai:  "Selesai",
    nonaktif: "Nonaktif",
};

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS   = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// ── Kalender Custom ──
const DateRangePicker = ({ startDate, endDate, onChange, occupiedRanges = [], excludeBannerId = null }) => {
    const today = new Date();
    const [viewYear, setViewYear]   = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selecting, setSelecting] = useState(null); // 'start' | 'end'

    const filteredRanges = occupiedRanges.filter(r => r.id !== excludeBannerId);

    const isOccupied = (dateStr) => {
        return filteredRanges.some(r => dateStr >= r.start_date && dateStr <= r.end_date);
    };

    const isInRange = (dateStr) => {
        if (!startDate || !endDate) return false;
        return dateStr > startDate && dateStr < endDate;
    };

    const isStart = (dateStr) => dateStr === startDate;
    const isEnd   = (dateStr) => dateStr === endDate;

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDay    = (year, month) => new Date(year, month, 1).getDay();

    const toDateStr = (year, month, day) => {
        const m = String(month + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        return `${year}-${m}-${d}`;
    };

    const handleDayClick = (dateStr) => {
        if (isOccupied(dateStr)) return;

        if (!startDate || (startDate && endDate)) {
            // Mulai pilih baru
            onChange({ start: dateStr, end: "" });
            setSelecting("end");
        } else {
            // Pilih end
            if (dateStr < startDate) {
                onChange({ start: dateStr, end: startDate });
            } else {
                // Cek apakah range melewati occupied
                const hasConflict = filteredRanges.some(r =>
                    r.start_date <= dateStr && r.end_date >= startDate
                );
                if (hasConflict) return;
                onChange({ start: startDate, end: dateStr });
            }
            setSelecting(null);
        }
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay    = getFirstDay(viewYear, viewMonth);

    const occupiedTitle = (dateStr) => {
        const r = filteredRanges.find(r => dateStr >= r.start_date && dateStr <= r.end_date);
        return r ? r.title : null;
    };

    return (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header navigasi bulan */}
            <div className="flex items-center justify-between bg-primary px-3 py-3 sm:px-4">
                <button type="button" onClick={prevMonth} className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/20">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-white sm:text-sm">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button type="button" onClick={nextMonth} className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/20">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Nama hari */}
            <div className="grid grid-cols-7 bg-gray-50">
                {DAYS.map(d => (
                    <div key={d} className="py-2 text-center text-[10px] font-bold text-gray-400">{d}</div>
                ))}
            </div>

            {/* Grid tanggal */}
            <div className="grid grid-cols-7 p-2 gap-y-1">
                {/* Padding awal */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`pad-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateStr  = toDateStr(viewYear, viewMonth, day);
                    const occupied = isOccupied(dateStr);
                    const inRange  = isInRange(dateStr);
                    const isS      = isStart(dateStr);
                    const isE      = isEnd(dateStr);
                    const title    = occupiedTitle(dateStr);

                    return (
                        <div key={day} className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => handleDayClick(dateStr)}
                                disabled={occupied}
                                title={title ? `Terpakai: ${title}` : undefined}
                                className={`
                                    relative h-7 w-7 rounded-full text-[11px] font-semibold transition sm:h-8 sm:w-8 sm:text-xs
                                    ${occupied
                                        ? "bg-red-100 text-red-400 cursor-not-allowed line-through"
                                        : isS || isE
                                            ? "bg-primary text-white"
                                            : inRange
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                            >
                                {day}
                                {occupied && (
                                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-400" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-200" />
                    <span className="text-[10px] text-gray-500">Sudah terpakai</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-200" />
                    <span className="text-[10px] text-gray-500">Dipilih</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-[10px] text-gray-500">Tanggal mulai/selesai</span>
                </div>
            </div>

            {/* Info pilihan */}
            {(startDate || endDate) && (
                <div className="px-4 py-2.5 border-t border-gray-100 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-gray-500">
                        {startDate && <span>Mulai: <strong>{startDate}</strong></span>}
                        {startDate && endDate && <span className="mx-2">→</span>}
                        {endDate && <span>Selesai: <strong>{endDate}</strong></span>}
                    </span>
                    <button
                        type="button"
                        onClick={() => { onChange({ start: "", end: "" }); setSelecting(null); }}
                        className="self-start text-[10px] text-red-400 hover:text-red-600 sm:self-auto"
                    >
                        Reset
                    </button>
                </div>
            )}

            {!startDate && (
                <p className="px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100">
                    Klik tanggal mulai, lalu klik tanggal selesai
                </p>
            )}
            {startDate && !endDate && (
                <p className="px-4 py-2 text-[10px] text-emerald-600 border-t border-gray-100">
                    Sekarang pilih tanggal selesai
                </p>
            )}
        </div>
    );
};

// ── Modal Form ──
const BannerModal = ({ banner, onClose, occupiedRanges }) => {
    const isEdit = !!banner;
    const [preview, setPreview] = useState(banner?.image ? `/storage/${banner.image}` : null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title:      banner?.title      ?? "",
        image:      null,
        is_active:  banner?.is_active  ?? true,
        start_date: banner?.start_date ?? "",
        end_date:   banner?.end_date   ?? "",
    });

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData("image", file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const r = isEdit ? route("admin.iklan.update", banner.id) : route("admin.iklan.store");
        post(r, { forceFormData: true, onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 sm:top-4 sm:right-4">
                    <X className="h-4 w-4" />
                </button>

                <h2 className="text-base font-bold text-gray-900 mb-5 pr-8 sm:text-lg">
                    {isEdit ? "Edit Banner" : "Tambah Banner"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Judul */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Banner</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Contoh: Iklan Ramadan 2026"
                            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-primary ${errors.title ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gambar Banner</label>
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-xl border border-gray-200 sm:h-40" />
                                <button type="button" onClick={() => { setPreview(null); setData("image", null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-emerald-50 transition sm:h-36">
                                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 text-center px-2">Klik untuk upload gambar</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (maks. 3MB)</span>
                                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                            </label>
                        )}
                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    </div>

                    {/* Kalender custom */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Jadwal Tayang</label>
                        <DateRangePicker
                            startDate={data.start_date}
                            endDate={data.end_date}
                            occupiedRanges={occupiedRanges}
                            excludeBannerId={banner?.id ?? null}
                            onChange={({ start, end }) => {
                                setData(d => ({ ...d, start_date: start, end_date: end }));
                            }}
                        />
                        {errors.start_date && (
                            <div className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                                <span className="text-red-500 text-sm">⚠</span>
                                <p className="text-xs text-red-600">{errors.start_date}</p>
                            </div>
                        )}
                    </div>

                    {/* Toggle aktif */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Status Aktif</p>
                            <p className="text-xs text-gray-400">Banner ditampilkan ke pengunjung</p>
                        </div>
                        <button type="button" onClick={() => setData("is_active", !data.is_active)}
                            className={`flex-shrink-0 transition ${data.is_active ? "text-primary" : "text-gray-300"}`}>
                            {data.is_active ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                        </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60">
                            {processing ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ── Modal Hapus ──
const DeleteModal = ({ banner, onConfirm, onCancel, loading }) => {
    if (!banner) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
                <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                        <AlertTriangle className="h-7 w-7 text-red-500" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Hapus Banner?</h3>
                    <p className="text-sm text-gray-500 mb-6">Banner <span className="font-semibold">"{banner.title}"</span> akan dihapus permanen.</p>
                    <div className="flex w-full gap-3">
                        <button onClick={onCancel} disabled={loading} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Batal</button>
                        <button onClick={onConfirm} disabled={loading} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50">
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main ──
const AdminIklan = ({ banners = [], occupiedRanges = [] }) => {
    const [showForm, setShowForm]         = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const activeCount   = banners.filter(b => b.status === "active").length;
    const upcomingCount = banners.filter(b => b.status === "upcoming").length;
    const nonaktifCount = banners.filter(b => b.status === "nonaktif" || b.status === "selesai").length;

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        router.delete(route("admin.iklan.destroy", deleteTarget.id), {
            onFinish: () => { setDeleteLoading(false); setDeleteTarget(null); },
        });
    };

    const formatDate = (d) => d
        ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "—";

    return (
        <DashboardLayout>
            {(showForm || editTarget) && (
                <BannerModal
                    banner={editTarget}
                    onClose={() => { setShowForm(false); setEditTarget(null); }}
                    occupiedRanges={occupiedRanges}
                />
            )}
            <DeleteModal
                banner={deleteTarget}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />

            <div className="w-full">
                <div className="flex items-center justify-between bg-white border border-gray-200 p-3 md:p-4 hidden sm:block">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900">Manajemen Iklan</h1>
                        <p className=" text-xs text-gray-400 mt-0.5 ">Kelola banner iklan yang tampil di halaman utama.</p>
                    </div>
                </div>

                <div className="space-y-5 px-4 py-6 md:py-8 md:px-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 text-center sm:p-4">
                            <p className="text-lg font-extrabold text-emerald-600 sm:text-2xl">{activeCount}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 sm:text-xs">Sedang Aktif</p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 text-center sm:p-4">
                            <p className="text-lg font-extrabold text-blue-600 sm:text-2xl">{upcomingCount}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 sm:text-xs">Upcoming</p>
                        </div>
                        <div className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100 text-center sm:p-4">
                            <p className="text-lg font-extrabold text-gray-400 sm:text-2xl">{nonaktifCount}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 sm:text-xs">Nonaktif / Selesai</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={() => setShowForm(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 sm:w-auto">
                            <Plus className="h-4 w-4" />
                            Tambah Banner
                        </button>
                    </div>

                    {banners.length === 0 ? (
                        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                            <Tag className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-400">Belum ada banner iklan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {banners.map((banner) => (
                                <div key={banner.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                                    <div className="flex gap-3 sm:min-w-0 sm:flex-1 sm:items-center sm:gap-4">
                                        <img src={`/storage/${banner.image}`} alt={banner.title}
                                            className="h-16 w-24 flex-shrink-0 rounded-xl object-cover bg-gray-100 sm:w-28" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                                <p className="font-bold text-gray-900 text-sm truncate max-w-full">{banner.title}</p>
                                                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLE[banner.status]}`}>
                                                    {STATUS_LABEL[banner.status]}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(banner.start_date)} — {formatDate(banner.end_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3 sm:mt-0 sm:justify-start sm:border-0 sm:pt-0 sm:flex-shrink-0">
                                        <button onClick={() => router.post(route("admin.iklan.toggle", banner.id))}
                                            className={`flex-shrink-0 transition ${banner.is_active ? "text-primary" : "text-gray-300"}`}>
                                            {banner.is_active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                                        </button>
                                        <button onClick={() => setEditTarget(banner)}
                                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-primary transition">
                                            <Tag className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setDeleteTarget(banner)}
                                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminIklan;