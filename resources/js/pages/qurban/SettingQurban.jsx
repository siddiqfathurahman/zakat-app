import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Printer, X } from 'lucide-react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function SettingQurban({ setting = null }) {
    const { flash } = usePage().props;

    const [form, setForm] = useState({
        jual_kulit:          setting?.jual_kulit          ?? '',
        operasional_kambing: setting?.operasional_kambing ?? '',
        tanggal_pengambilan: setting?.tanggal_pengambilan ?? '',
        waktu_pengambilan:   setting?.waktu_pengambilan ?? '',
        tempat_pengambilan:  setting?.tempat_pengambilan ?? '',
    });

    if (typeof window !== "undefined" && window.qz) {
        qz.security.setCertificatePromise(function (resolve, reject) {
            resolve(
                "-----BEGIN CERTIFICATE-----\n" +
                    "MIIB...dummy...\n" +
                    "-----END CERTIFICATE-----"
            );
        });

        qz.security.setSignaturePromise(function (toSign) {
            return function (resolve, reject) {
                resolve();
            };
        });
    }

    const connectQZ = async () => {
        if (!window.qz) {
            throw new Error("QZ Tray tidak terdeteksi");
        }

        if (!qz.websocket.isActive()) {
            await qz.websocket.connect();
            console.log("QZ Connected");
        }
    };

    const handleConnectPrinter = async () => {
        try {
            await connectQZ();
            const printers = await qz.printers.find();

            const selectedPrinter = window.prompt(
                "Printer tersedia:\n" + printers.map((p, i) => `${i+1}. ${p}`).join("\n") + 
                "\n\nMasukkan nama printer persis:"
            );

            if (!selectedPrinter || !printers.includes(selectedPrinter)) {
                alert("Nama printer tidak valid.");
                return;
            }

            router.post("/qurban/input/setting/printer", {
                printer_connected: true,
                printer_name: selectedPrinter,
            });

        } catch (error) {
            console.error("Error connecting printer:", error);
            alert("Gagal menghubungkan printer: " + error.message);
        }
    };

    const handleDisconnectPrinter = () => {
        if (confirm("Apakah Anda yakin ingin memutuskan koneksi printer?")) {
            router.post("/qurban/input/setting/printer/disconnect");
        }
    };

    const [errors, setErrors]   = useState({});
    const [confirm, setConfirm] = useState(false);

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setErrors(er => ({ ...er, [e.target.name]: '' }));
    };

    const validate = () => {
        const err = {};
        if (form.jual_kulit === '' || isNaN(form.jual_kulit))
            err.jual_kulit = 'Wajib diisi dan harus angka';
        if (form.operasional_kambing === '' || isNaN(form.operasional_kambing))
            err.operasional_kambing = 'Wajib diisi dan harus angka';
        if (!form.tanggal_pengambilan) err.tanggal_pengambilan = 'Wajib diisi';
        if (!form.waktu_pengambilan) err.waktu_pengambilan = 'Wajib diisi';
        if (!form.tempat_pengambilan) err.tempat_pengambilan = 'Wajib diisi';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const save = () => {
        if (!validate()) return;
        if (setting) {
            router.post(`/qurban/input/setting/${setting.id}/update`, form, {
                onError: e => setErrors(e),
            });
        } else {
            router.post('/qurban/input/setting/store', form, {
                onError: e => setErrors(e),
            });
        }
    };

    const doReset = () => {
        router.post(`/qurban/input/setting/${setting.id}/destroy`, {}, {
            onSuccess: () => {
                setConfirm(false);
                setForm({ jual_kulit: '', operasional_kambing: '', tanggal_pengambilan: '', waktu_pengambilan: '', tempat_pengambilan: '' });
            },
        });
    };

    const fmt = val => {
        const n = parseInt(val);
        if (isNaN(n)) return 'Rp 0';
        return 'Rp ' + n.toLocaleString('id-ID');
    };

    return (
        <QurbanLayout>
            {/* Page Header */}
            <div className="bg-orange-700 rounded-2xl px-6 py-5 mb-6 text-white">
                <h1 className="text-xl font-bold">Setting Qurban</h1>
                <p className="text-orange-100 text-sm mt-1">
                    Pengaturan nilai qurban dan jadwal & tempat pengambilan daging.
                </p>
            </div>

            {/* Flash */}
            {flash?.success && (
                <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Form Card ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800 pl-1">Data Keuangan Qurban</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Jual Kulit */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Hasil Jual Kulit (Rp) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Rp</span>
                                    <input
                                        type="number"
                                        name="jual_kulit"
                                        min="0"
                                        value={form.jual_kulit}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition ${
                                            errors.jual_kulit
                                                ? 'border-red-400 focus:border-red-400'
                                                : 'border-gray-200 focus:border-orange-400'
                                        }`}
                                    />
                                </div>
                                {errors.jual_kulit && (
                                    <p className="text-xs text-red-500 mt-1">{errors.jual_kulit}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Pendapatan dari penjualan kulit hewan qurban.
                                </p>
                            </div>

                            {/* Operasional Kambing */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Biaya Operasional Kambing (Rp) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Rp</span>
                                    <input
                                        type="number"
                                        name="operasional_kambing"
                                        min="0"
                                        value={form.operasional_kambing}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition ${
                                            errors.operasional_kambing
                                                ? 'border-red-400 focus:border-red-400'
                                                : 'border-gray-200 focus:border-orange-400'
                                        }`}
                                    />
                                </div>
                                {errors.operasional_kambing && (
                                    <p className="text-xs text-red-500 mt-1">{errors.operasional_kambing}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    Total biaya operasional pemotongan dan distribusi kambing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800 pl-1">Jadwal & Tempat Pengambilan</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Tanggal Pengambilan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tanggal_pengambilan"
                                    value={form.tanggal_pengambilan}
                                    onChange={handleChange}
                                    placeholder="contoh: Rabu, 27 Mei 2026"
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition ${
                                        errors.tanggal_pengambilan
                                            ? 'border-red-400 focus:border-red-400'
                                            : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                />
                                {errors.tanggal_pengambilan && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tanggal_pengambilan}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Waktu / Jam Pengambilan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="waktu_pengambilan"
                                    value={form.waktu_pengambilan}
                                    onChange={handleChange}
                                    placeholder="contoh: 15.00 - 16.30 WIB"
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition ${
                                        errors.waktu_pengambilan
                                            ? 'border-red-400 focus:border-red-400'
                                            : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                />
                                {errors.waktu_pengambilan && (
                                    <p className="text-xs text-red-500 mt-1">{errors.waktu_pengambilan}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                                    Tempat Pengambilan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tempat_pengambilan"
                                    value={form.tempat_pengambilan}
                                    onChange={handleChange}
                                    placeholder="contoh: Masjid Al-Anhar Dalem Mangunjayan"
                                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition ${
                                        errors.tempat_pengambilan
                                            ? 'border-red-400 focus:border-red-400'
                                            : 'border-gray-200 focus:border-orange-400'
                                    }`}
                                />
                                {errors.tempat_pengambilan && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tempat_pengambilan}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
                            {setting && (
                                <button
                                    type="button"
                                    onClick={() => setConfirm(true)}
                                    className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl px-4 py-2 text-sm transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Reset Setting
                                </button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={save}
                                    className="flex items-center gap-2 bg-orange-700 hover:bg-orange-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition shadow-sm active:scale-[0.98]"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    {setting ? 'Update Setting' : 'Simpan Setting'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Printer Settings */}   
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="font-semibold text-gray-800 pl-1">Setting Printer Thermal</h2>
                        </div>
                        <div className="p-6">
                            {setting?.printer_connected ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-700">
                                            Printer Terhubung
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 font-medium">Nama:</span>
                                            <span className="font-semibold text-gray-800">{setting.printer_name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDisconnectPrinter}
                                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <X size={16} />
                                        <span className="text-sm font-medium">Putuskan Koneksi</span>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-600">
                                            Printer Belum Terhubung
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleConnectPrinter}
                                        className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Printer size={16} />
                                        <span className="text-sm font-medium">Hubungkan Printer</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Preview Card ── */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Status */}
                    <div className={`rounded-2xl border p-5 ${setting ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${setting ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</span>
                        </div>
                        <p className={`text-sm font-bold ${setting ? 'text-green-700' : 'text-gray-500'}`}>
                            {setting ? 'Setting Tersimpan' : 'Belum Ada Setting'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {setting ? 'Data setting sudah dikonfigurasi.' : 'Isi form dan simpan untuk mulai.'}
                        </p>
                    </div>

                    {/* Preview Values */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-100">
                            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Preview Nilai</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Hasil Jual Kulit</p>
                                <p className="text-lg font-bold text-orange-700">{fmt(form.jual_kulit)}</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400 mb-0.5">Biaya Operasional Kambing</p>
                                <p className="text-lg font-bold text-green-700">{fmt(form.operasional_kambing)}</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400 mb-0.5">Pengambilan</p>
                                <p className="text-sm font-semibold text-gray-800">{form.tanggal_pengambilan || '-'}</p>
                                <p className="text-sm text-gray-600">{form.waktu_pengambilan || '-'}</p>
                                <p className="text-sm text-gray-600">{form.tempat_pengambilan || '-'}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Confirm Reset Modal */}
            {confirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">Reset Setting?</p>
                                <p className="text-xs text-gray-500">Semua konfigurasi akan dihapus dan tidak bisa dikembalikan.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirm(false)}
                                className="border border-gray-200 rounded-xl px-4 py-2 text-sm hover:bg-gray-50 transition">
                                Batal
                            </button>
                            <button onClick={doReset}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition">
                                Ya, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </QurbanLayout>
    );
}