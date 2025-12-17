import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Save, Wheat, Banknote, X, Check } from "lucide-react";

export default function InputZakat({ setting = { harga_2_5kg: 0 } }) {
    const [formData, setFormData] = useState({
        namaPembayar: "",
        namaPanitia: "",
        rt: "",
        rw: "",
        jumlahJiwa: "",
        melalui: "uang",
        sodaqoh: "",
    });

    const [totalBayar, setTotalBayar] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const nilaiPerJiwa = {
        uang: setting.harga_2_5kg || 25000,
        beras: 2.5,
    };

    const rtRwData = [
        { rt: "48", rw: "11" },
        { rt: "49", rw: "11" },
        { rt: "50", rw: "11" },
        { rt: "51", rw: "12" },
        { rt: "52", rw: "12" },
        { rt: "53", rw: "12" },
        { rt: "56", rw: "13" },
        { rt: "57", rw: "13" },
    ];

    useEffect(() => {
        const jiwa = parseInt(formData.jumlahJiwa) || 0;

        if (formData.melalui === "uang") {
            const totalZakat = jiwa * nilaiPerJiwa.uang;
            setTotalBayar(totalZakat);
        } else {
            const totalBeras = jiwa * nilaiPerJiwa.beras;
            setTotalBayar(totalBeras);
        }
    }, [formData.jumlahJiwa, formData.melalui]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRtChange = (e) => {
        const selectedRt = e.target.value;
        const rtData = rtRwData.find((item) => item.rt === selectedRt);

        setFormData((prev) => ({
            ...prev,
            rt: selectedRt,
            rw: rtData ? rtData.rw : "",
        }));
    };

    const handleMelaluiChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            melalui: value,
            sodaqoh: value === "beras" ? "" : prev.sodaqoh,
        }));
    };

    const handlePreview = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    const handleSubmit = () => {
        const dataToSubmit = {
            ...formData,
            totalBayar,
            nilaiPerJiwa: nilaiPerJiwa[formData.melalui],
        };

        router.post("/pembayar/store", dataToSubmit, {
            onSuccess: () => {
                setShowPreview(false);
                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                    setFormData({
                        namaPembayar: "",
                        namaPanitia: "",
                        rt: "",
                        rw: "",
                        jumlahJiwa: "",
                        melalui: "uang",
                        sodaqoh: "",
                    });
                    setTotalBayar(0);
                }, 2000);
            },
            onError: (errors) => {
                console.error("Error:", errors);
                alert("Terjadi kesalahan saat menyimpan data");
            },
        });
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const sodaqohValue = parseInt(formData.sodaqoh) || 0;
    const totalKeseluruhan =
        formData.melalui === "uang" ? totalBayar + sodaqohValue : totalBayar;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="flex justify-end mb-6">
                <Link
                    href="/dashboard"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full font-medium transition-colors"
                >
                    Dashboard
                </Link>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-green-600 text-white p-6">
                        <h1 className="text-2xl font-semibold mb-1">
                            Input Pembayaran Zakat
                        </h1>
                        <p className="text-green-100 text-sm">
                            Formulir pencatatan zakat fitrah
                        </p>
                    </div>

                    <form onSubmit={handlePreview} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="namaPembayar"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama Pembayar{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="namaPembayar"
                                name="namaPembayar"
                                type="text"
                                placeholder="Masukkan nama pembayar zakat"
                                value={formData.namaPembayar}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="namaPanitia"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama Panitia{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="namaPanitia"
                                name="namaPanitia"
                                type="text"
                                placeholder="Masukkan nama panitia"
                                value={formData.namaPanitia}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="rt"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    RT <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="rt"
                                    name="rt"
                                    value={formData.rt}
                                    onChange={handleRtChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Pilih RT</option>
                                    {rtRwData.map((item) => (
                                        <option key={item.rt} value={item.rt}>
                                            {item.rt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="rw"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    RW <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="rw"
                                    name="rw"
                                    type="text"
                                    value={formData.rw}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="jumlahJiwa"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Jumlah Jiwa{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="jumlahJiwa"
                                    name="jumlahJiwa"
                                    type="number"
                                    placeholder="4"
                                    min="1"
                                    value={formData.jumlahJiwa}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Melalui{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMelaluiChange("uang")
                                        }
                                        className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
                                            formData.melalui === "uang"
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Banknote size={18} />
                                            <span>Uang</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMelaluiChange("beras")
                                        }
                                        className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
                                            formData.melalui === "beras"
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Wheat size={18} />
                                            <span>Beras</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {formData.melalui === "uang" && (
                            <div className="space-y-2">
                                <label
                                    htmlFor="sodaqoh"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sodaqoh (Opsional)
                                </label>
                                <input
                                    id="sodaqoh"
                                    name="sodaqoh"
                                    type="number"
                                    placeholder="Masukkan jumlah sodaqoh (Rp)"
                                    min="0"
                                    value={formData.sodaqoh}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {formData.jumlahJiwa && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">
                                        Rincian Perhitungan:
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                    <div className="flex justify-between">
                                        <span>Jumlah Jiwa:</span>
                                        <span className="font-medium">
                                            {formData.jumlahJiwa} jiwa
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Nilai per Jiwa:</span>
                                        <span className="font-medium">
                                            {formData.melalui === "uang"
                                                ? formatRupiah(
                                                      nilaiPerJiwa.uang
                                                  )
                                                : `${nilaiPerJiwa.beras} kg`}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-green-300 pt-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-gray-800">
                                            Total Zakat Fitrah:
                                        </span>
                                        <span className="text-xl font-bold text-green-600">
                                            {formData.melalui === "uang"
                                                ? formatRupiah(totalBayar)
                                                : `${totalBayar} kg`}
                                        </span>
                                    </div>

                                    {formData.melalui === "uang" &&
                                        sodaqohValue > 0 && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-base font-semibold text-gray-800">
                                                        Sodaqoh:
                                                    </span>
                                                    <span className="text-xl font-bold text-pink-600">
                                                        {formatRupiah(
                                                            sodaqohValue
                                                        )}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            Preview Data Zakat
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal Preview - Thermal Printer Style */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">
                                Preview Nota
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Thermal Printer Style Receipt */}
                        <div className="p-6 font-mono text-sm">
                            <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-300">
                                <h3 className="font-bold text-base mb-1">
                                    BUKTI PEMBAYARAN
                                </h3>
                                <p className="text-xs">ZAKAT FITRAH 1447 H</p>
                            </div>

                            <div className="space-y-2 mb-4 border-b-2 border-dashed border-gray-300 pb-4">
                                <div className="flex">
                                    <span className="w-32">Nama</span>
                                    <span className="mr-2">:</span>
                                    <span className="font-semibold flex-1">
                                        {formData.namaPembayar}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-32">RT/RW</span>
                                    <span className="mr-2">:</span>
                                    <span className="font-semibold flex-1">
                                        {formData.rt}/{formData.rw}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-32">Jumlah Jiwa</span>
                                    <span className="mr-2">:</span>
                                    <span className="font-semibold flex-1">
                                        {formData.jumlahJiwa} jiwa
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-32">Dibayar</span>
                                    <span className="mr-2">:</span>
                                    <span className="font-semibold flex-1">
                                        {formData.melalui === "uang"
                                            ? "Uang"
                                            : "Beras"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-b-2 border-dashed border-gray-300 pb-3 mb-3">
                                <div className="flex justify-between">
                                    <span>Zakat Fitrah</span>
                                    <span className="font-semibold">
                                        {formData.melalui === "uang"
                                            ? formatRupiah(totalBayar)
                                            : `${totalBayar} kg`}
                                    </span>
                                </div>
                                {formData.melalui === "uang" &&
                                    sodaqohValue > 0 && (
                                        <div className="flex justify-between mt-1">
                                            <span>Sodaqoh</span>
                                            <span className="font-semibold">
                                                {formatRupiah(sodaqohValue)}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            <div className="border-b-2 border-dashed border-gray-300 pb-3 mb-3">
                                <div className="flex">
                                    <span className="w-32">Panitia</span>
                                    <span className="mr-2">:</span>
                                    <span className="flex-1">
                                        {formData.namaPanitia}
                                    </span>
                                </div>
                                <div className="text-center mt-3 text-xs">
                                    <p>
                                        {new Date().toLocaleDateString(
                                            "id-ID",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center text-xs">
                                <p>Jazakumullahu Khairan Katsiran</p>
                                <p className="font-semibold">Semoga Berkah</p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Simpan & Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Success */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="bg-green-100 rounded-full p-4">
                                <Check
                                    size={48}
                                    className="text-green-600"
                                    strokeWidth={3}
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Berhasil!
                        </h3>
                        <p className="text-gray-600">
                            Data zakat telah tersimpan
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
