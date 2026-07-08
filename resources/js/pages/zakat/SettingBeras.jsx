import React, { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Edit2,
    Package,
    DollarSign,
    Calendar,
    AlertCircle,
    Printer,
    X,
    Archive,
    Download,
    Trash2,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import ZakatLayout from "../../Layout/ZakatLayout";
import SuccessNotification from "../../components/SuccessNotification";

function NotificationModal({ notification, onClose }) {
    if (!notification?.open) return null;

    const isError = notification.type === "error";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                <div
                    className={`p-6 flex items-start gap-3 ${
                        isError ? "bg-red-50" : "bg-green-50"
                    }`}
                >
                    {isError ? (
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                    ) : (
                        <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={24} />
                    )}
                    <div>
                        <h3
                            className={`font-bold text-sm ${
                                isError ? "text-red-800" : "text-green-800"
                            }`}
                        >
                            {notification.title || (isError ? "Terjadi Kesalahan" : "Berhasil")}
                        </h3>
                        <p
                            className={`text-xs mt-1 leading-relaxed ${
                                isError ? "text-red-700" : "text-green-700"
                            }`}
                        >
                            {notification.message}
                        </p>
                    </div>
                </div>
                <div className="p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                            isError
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        Oke
                    </button>
                </div>
            </div>
        </div>
    );
}


function ConfirmModal({ confirmDialog, onCancel, onConfirm }) {
    if (!confirmDialog?.open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                <div className="p-6 flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h3 className="font-bold text-sm text-amber-800">
                            {confirmDialog.title || "Konfirmasi"}
                        </h3>
                        <p className="text-xs mt-1 leading-relaxed text-amber-700">
                            {confirmDialog.message}
                        </p>
                    </div>
                </div>
                <div className="p-4 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                    >
                        Ya, Lanjutkan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SettingBeras({
    setting = { toko: "", tahun: new Date().getFullYear(), harga_per_kg: 0, harga_2_5kg: 0, harga_sak: 0 },
    flash,
    archives = [],
}) {
    // QZ Security Setup
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

    // ---------------------------------------------
    // State Notifikasi & Konfirmasi (pengganti alert/confirm)
    // ---------------------------------------------
    const [notification, setNotification] = useState({
        open: false,
        type: "success", // "success" | "error"
        title: "",
        message: "",
    });

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    const notify = (type, message, title = "") => {
        setNotification({ open: true, type, message, title });
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    const askConfirm = (message, onConfirm, title = "Konfirmasi") => {
        setConfirmDialog({ open: true, title, message, onConfirm });
    };

    const closeConfirm = () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        toko: setting.toko || "",
        tahun: setting.tahun || new Date().getFullYear(),
        harga_per_kg: setting.harga_per_kg || 0,
        harga_sak: setting.harga_sak || 0,
    });

    // Archive State
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [archiveYear, setArchiveYear] = useState(setting.tahun || new Date().getFullYear());

    const handleOpenArchiveModal = () => {
        setArchiveYear(setting.tahun || new Date().getFullYear());
        setIsArchiveModalOpen(true);
    };

    const handleCloseArchiveModal = () => {
        setIsArchiveModalOpen(false);
    };

    const handleArchiveSubmit = (e) => {
        e.preventDefault();
        setIsArchiving(true);

        router.post("/zakat/input/archive", { tahun: archiveYear }, {
            onSuccess: () => {
                setIsArchiving(false);
                handleCloseArchiveModal();
            },
            onError: (errors) => {
                setIsArchiving(false);
                if (errors.tahun) {
                    notify("error", errors.tahun, "Gagal Mengarsipkan");
                } else {
                    notify("error", "Gagal melakukan pengarsipan.", "Gagal Mengarsipkan");
                }
            },
        });
    };

    const handleDeleteArchive = (id, tahun) => {
        askConfirm(
            `Apakah Anda yakin ingin menghapus arsip tahun ${tahun}? File PDF terkait juga akan dihapus secara permanen.`,
            () => {
                closeConfirm();
                router.post(`/zakat/input/archive/${id}/destroy`, {}, {
                    onSuccess: () => {
                        notify("success", `Arsip tahun ${tahun} berhasil dihapus.`, "Berhasil Dihapus");
                    },
                    onError: () => {
                        notify("error", `Gagal menghapus arsip tahun ${tahun}.`, "Gagal Menghapus");
                    },
                });
            },
            "Hapus Arsip"
        );
    };

    const handleOpenModal = () => {
        setFormData({
            toko: setting.toko || "",
            tahun: setting.tahun || new Date().getFullYear(),
            harga_per_kg: setting.harga_per_kg || 0,
            harga_sak: setting.harga_sak || 0,
        });
        setIsModalOpen(true);
    };

    const handleConnectPrinter = async () => {
        try {
            await connectQZ();
            const printers = await qz.printers.find();

            const selectedPrinter = window.prompt(
                "Printer tersedia:\n" + printers.map((p, i) => `${i + 1}. ${p}`).join("\n") +
                "\n\nMasukkan nama printer persis:"
            );

            if (!selectedPrinter || !printers.includes(selectedPrinter)) {
                notify("error", "Nama printer tidak valid.", "Gagal Menghubungkan");
                return;
            }

            router.post("/zakat/input/setting-beras/printer", {
                printer_connected: true,
                printer_name: selectedPrinter,
                printer_type: "qz-tray",
                printer_address: "localhost",
            });

        } catch (error) {
            console.error("Error connecting printer:", error);
            notify("error", "Gagal menghubungkan printer: " + error.message, "Gagal Menghubungkan");
        }
    };

    const handleDisconnectPrinter = () => {
        askConfirm(
            "Apakah Anda yakin ingin memutuskan koneksi printer?",
            () => {
                closeConfirm();
                router.post("/zakat/input/setting-beras/printer/disconnect");
            },
            "Putuskan Koneksi Printer"
        );
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            toko: "",
            tahun: new Date().getFullYear(),
            harga_per_kg: "",
            harga_sak: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post("/zakat/input/setting-beras", formData, {
            onSuccess: () => {
                setIsLoading(false);
                handleCloseModal();
            },
            onError: (errors) => {
                setIsLoading(false);
                const firstError = Object.values(errors)[0];
                notify(
                    "error",
                    firstError || "Gagal menyimpan pengaturan harga beras.",
                    "Gagal Menyimpan"
                );
            },
        });
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <ZakatLayout>
            <SuccessNotification message={flash?.success} />
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="mb-6 flex gap-40">
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Setting Harga Beras
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Harga beras untuk perhitungan zakat fitrah
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border-2 border-green-400 ring-2 ring-green-200 max-w-md mt-6">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-4 py-2 rounded-t-lg ">
                                Harga Beras
                            </div>
                            <div className="p-6">
                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                                        <DollarSign size={16} />
                                        <span className="text-xs font-medium">
                                            Toko Beli Beras
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-700">
                                        {setting.toko || "-"}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium">
                                            Tahun
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-700">
                                        {setting.tahun || "-"}
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center gap-2 text-green-700 mb-1">
                                        <DollarSign size={16} />
                                        <span className="text-xs font-medium">
                                            Harga per KG
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">
                                        {formatRupiah(
                                            setting.harga_per_kg || 0
                                        )}
                                    </p>
                                </div>

                                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 text-amber-700 mb-1">
                                        <Package size={16} />
                                        <span className="text-xs font-medium">
                                            Harga 2.5 KG (Zakat Fitrah)
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-700">
                                        {formatRupiah(setting.harga_2_5kg || 0)}
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                                        <Package size={16} />
                                        <span className="text-xs font-medium">
                                            Harga per Sak (25 KG)
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {formatRupiah(setting.harga_sak || 0)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                                    <Calendar size={14} />
                                    <span>
                                        Update:{" "}
                                        {formatDate(
                                            setting.updated_at ||
                                                setting.created_at
                                        )}
                                    </span>
                                </div>

                                <button
                                    onClick={handleOpenModal}
                                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    <Edit2 size={16} />
                                    <span className="text-sm font-medium">
                                        Edit Harga
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Setting Printer Nota
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Untuk Menyambungkan di input pembayar zakat
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-400 ring-2 ring-blue-200 max-w-md mt-6">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-t-lg">
                                Pengaturan Printer Thermal
                            </div>
                            <div className="p-6">
                                {setting.printer_connected ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-green-700">
                                                Printer Terhubung
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Nama:
                                                    </span>
                                                    <span className="font-medium">
                                                        {setting.printer_name}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Tipe:
                                                    </span>
                                                    <span className="font-medium capitalize">
                                                        {setting.printer_type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleDisconnectPrinter}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                        >
                                            <X size={16} />
                                            <span className="text-sm font-medium">
                                                Putuskan Koneksi
                                            </span>
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
                                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Printer size={16} />
                                            <span className="text-sm font-medium">
                                                Hubungkan Printer
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Arsip Zakat */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Arsip Data Zakat Fitrah
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 mb-6">
                        Simpan data zakat tahun-tahun sebelumnya dan kelola laporan arsip PDF
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Card Jalankan Arsip */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 text-green-700 mb-4">
                                    <Archive size={24} />
                                    <h3 className="font-bold text-lg text-gray-800">Arsipkan & Reset Data</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Gunakan fitur ini di akhir Ramadhan setelah seluruh penyaluran zakat selesai.
                                    Sistem akan menyusun semua data ke dalam file PDF dan mereset database zakat aktif agar bersih untuk tahun berikutnya.
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-6">
                                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                    <span className="text-amber-800 text-xs leading-relaxed font-medium">
                                        Peringatan: Seluruh data aktif (Muzakki, Mustahik, Laporan Belanja, & Formula) akan dihapus secara permanen dari database.
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleOpenArchiveModal}
                                className="w-full bg-green-700 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <Archive size={16} />
                                <span className="text-sm font-semibold">Mulai Pengarsipan</span>
                            </button>
                        </div>

                        {/* List Arsip PDF */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <Package size={20} className="text-green-600" />
                                Daftar Arsip Laporan PDF
                            </h3>

                            {archives.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Archive size={48} className="mb-2 stroke-1" />
                                    <p className="text-sm">Belum ada data zakat yang diarsipkan.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Tahun</th>
                                                <th scope="col" className="px-4 py-3">Tanggal Diarsipkan</th>
                                                <th scope="col" className="px-4 py-3">Ringkasan Data</th>
                                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {archives.map((archive) => {
                                                const summary = archive.summary_data || {};
                                                return (
                                                    <tr key={archive.id} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-4 py-4 font-bold text-gray-900">
                                                            Tahun {archive.tahun}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {formatDate(archive.created_at)}
                                                        </td>
                                                        <td className="px-4 py-4 text-xs">
                                                            <div className="space-y-1">
                                                                <p>• Muzakki: <span className="font-semibold text-gray-700">{summary.jumlah_pembayar || 0} orang</span></p>
                                                                <p>• Uang: <span className="font-semibold text-green-600">{formatRupiah(summary.total_uang || 0)}</span></p>
                                                                <p>• Beras: <span className="font-semibold text-amber-600">{(summary.total_beras || 0).toLocaleString("id-ID")} kg</span></p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <a
                                                                    href={`/zakat/archive/${archive.id}/download`}
                                                                    className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-green-200"
                                                                >
                                                                    <Download size={14} />
                                                                    <span className="text-xs font-semibold">PDF</span>
                                                                </a>
                                                                <button
                                                                    onClick={() => handleDeleteArchive(archive.id, archive.tahun)}
                                                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-red-200"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Archive Warning Modal */}
                {isArchiveModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                            <div className="bg-green-700 text-white p-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={24} className="animate-bounce" />
                                    <h2 className="text-xl font-bold">Konfirmasi Pengarsipan</h2>
                                </div>
                                <p className="text-amber-100 text-sm mt-2 font-medium">
                                    Tindakan ini permanen dan tidak dapat dibatalkan!
                                </p>
                            </div>

                            <form onSubmit={handleArchiveSubmit} className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun Laporan yang Diarsipkan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={archiveYear}
                                        onChange={(e) => setArchiveYear(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder={new Date().getFullYear()}
                                        required
                                        min="2000"
                                        max="2100"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Masukkan tahun data aktif saat ini.
                                    </p>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800 text-xs leading-relaxed space-y-2">
                                    <p className="font-bold uppercase flex items-center gap-1.5">
                                        <AlertCircle size={14} /> PENTING:
                                    </p>
                                    <p>
                                        1. Seluruh data pembayar zakat (muzakki), penerima (mustahik), pemohon luar, laporan belanja, serta perhitungan formula saat ini akan <strong>diarsipkan ke dalam file PDF</strong>.
                                    </p>
                                    <p>
                                        2. Setelah file berhasil disimpan, sistem akan <strong>menghapus bersih (TRUNCATE)</strong> seluruh data aktif tersebut dari database agar bersih untuk tahun depan.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseArchiveModal}
                                        disabled={isArchiving}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isArchiving}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        {isArchiving ? "Memproses..." : "Ya, Generate & Reset"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Edit Harga */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl">
                                <h2 className="text-xl font-bold">
                                    Edit Harga Beras
                                </h2>
                                <p className="text-green-100 text-sm mt-1">
                                    Perbarui harga beras untuk perhitungan zakat
                                    fitrah
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                {/* Toko */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Toko{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.toko}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                toko: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Nama Toko"
                                        required
                                    />
                                </div>

                                {/* Harga per KG */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Harga per KG{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={formData.harga_per_kg}
                                            onChange={(e) => {
                                                const hargaKg =
                                                    Number(e.target.value) || 0;
                                                setFormData({
                                                    ...formData,
                                                    harga_per_kg: hargaKg,
                                                });
                                            }}
                                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="15000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.tahun}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tahun: Number(e.target.value) || "",
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder={new Date().getFullYear()}
                                        required
                                    />
                                </div>

                                {/* Harga 2.5 KG (AUTO / READ ONLY) */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Harga 2.5 KG (Zakat Fitrah)
                                    </label>
                                    <input
                                        type="text"
                                        value={formatRupiah(
                                            formData.harga_per_kg * 2.5
                                        )}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                    />
                                </div>

                                {/* Harga per Sak (25 KG) */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Harga per Sak (25 KG)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={formData.harga_sak}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    harga_sak:
                                                        Number(
                                                            e.target.value
                                                        ) || 0,
                                                })
                                            }
                                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="375000"
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                    >
                                        {isLoading ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Notifikasi (pengganti alert) */}
                <NotificationModal
                    notification={notification}
                    onClose={closeNotification}
                />

                {/* Modal Konfirmasi (pengganti confirm) */}
                <ConfirmModal
                    confirmDialog={confirmDialog}
                    onCancel={closeConfirm}
                    onConfirm={confirmDialog.onConfirm}
                />
            </div>
        </ZakatLayout>
    );
}