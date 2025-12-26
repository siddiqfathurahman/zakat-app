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
} from "lucide-react";
import AppLayout from "../Layout/AppLayout";

export default function SettingBeras({
    setting = { toko: "", harga_per_kg: 0, harga_2_5kg: 0, harga_sak: 0 },
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        toko: setting.toko || "",
        harga_per_kg: setting.harga_per_kg || 0,
        harga_sak: setting.harga_sak || 0,
    });

    const handleOpenModal = () => {
        setFormData({
            toko: setting.toko || "",
            harga_per_kg: setting.harga_per_kg || 0,
            harga_sak: setting.harga_sak || 0,
        });
        setIsModalOpen(true);
    };

    const handleConnectPrinter = async () => {
        try {
            // Cek apakah browser mendukung Web Bluetooth
            if ("bluetooth" in navigator) {
                const device = await navigator.bluetooth.requestDevice({
                    filters: [
                        { services: ["000018f0-0000-1000-8000-00805f9b34fb"] },
                    ],
                    optionalServices: ["battery_service"],
                });

                router.post("/setting-beras/printer", {
                    printer_connected: true,
                    printer_name: device.name,
                    printer_type: "bluetooth",
                    printer_address: device.id,
                });
            } else if ("usb" in navigator) {
                // USB printer
                const device = await navigator.usb.requestDevice({
                    filters: [{ vendorId: 0x0416 }], // Ganti dengan vendor ID printer Anda
                });

                router.post("/setting-beras/printer", {
                    printer_connected: true,
                    printer_name: device.productName,
                    printer_type: "usb",
                    printer_address: device.serialNumber,
                });
            } else {
                alert("Browser Anda tidak mendukung koneksi printer");
            }
        } catch (error) {
            console.error("Error connecting printer:", error);
            alert("Gagal menghubungkan printer: " + error.message);
        }
    };

    const handleDisconnectPrinter = () => {
        if (confirm("Apakah Anda yakin ingin memutuskan koneksi printer?")) {
            router.post("/setting-beras/printer/disconnect");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            toko: "",
            harga_per_kg: "",
            harga_sak: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post("/setting-beras", formData, {
            onSuccess: () => {
                setIsLoading(false);
                handleCloseModal();
            },
            onError: () => {
                setIsLoading(false);
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
        <AppLayout>
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
                {/* Modal */}
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
            </div>
        </AppLayout>
    );
}
