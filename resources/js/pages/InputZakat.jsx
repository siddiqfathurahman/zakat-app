import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Save, Wheat, Banknote, X, Check, Printer } from "lucide-react";

export default function InputZakat({
    setting = { harga_2_5kg: 0, printer_connected: false, printer_name: "" },
}) {
    // QZ Security Setup
    if (typeof window !== "undefined" && window.qz) {
        qz.security.setCertificatePromise(function (resolve, reject) {
            resolve(
                "-----BEGIN CERTIFICATE-----\n" +
                    "MIIB...dummy...\n" +
                    "-----END CERTIFICATE-----",
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
    const [formData, setFormData] = useState({
        namaPembayar: "",
        namaPanitia: "",
        rt: "",
        rw: "",
        jumlahJiwa: "",
        beratBeras: 2.5,
        melalui: "uang",
        sodaqoh: "",
    });

    const [totalBayar, setTotalBayar] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const nilaiPerJiwa = {
        uang: setting.harga_2_5kg || 25000,
        beras: formData.beratBeras, 
    };

    const handleBeratBerasChange = (berat) => {
    setFormData((prev) => ({
        ...prev,
        beratBeras: berat,
    }));
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
            const totalBeras = jiwa * formData.beratBeras; 
            setTotalBayar(totalBeras);
        }
    }, [formData.jumlahJiwa, formData.melalui, formData.beratBeras]); 

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
            beratBeras: value === "beras" ? 2.5 : prev.beratBeras, 
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

        router.post("/zakat/input/pembayar/store", dataToSubmit, {
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

    // Khusus untuk print thermal - pure ASCII, tanpa unicode tersembunyi
    const formatRupiahPrint = (angka) => {
        const angkaBulat = Math.round(angka);
        const formatted = angkaBulat
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `Rp ${formatted}`;
    };

    const sodaqohValue = parseInt(formData.sodaqoh) || 0;
    const totalKeseluruhan =
        formData.melalui === "uang" ? totalBayar + sodaqohValue : totalBayar;

    const imageToEscPos = async (src, width = 384) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ratio = img.height / img.width;
                canvas.width = width;
                canvas.height = Math.floor(width * ratio);
                const ctx = canvas.getContext("2d");

                // Fill white background dulu biar transparan jadi putih
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
                const { data, width: w, height: h } = imageData;

                const bytes = [];

                // ESC/POS GS v 0 (raster bit image)
                bytes.push(0x1d, 0x76, 0x30, 0x00);
                const bytesPerRow = Math.ceil(w / 8);
                bytes.push(bytesPerRow & 0xff, (bytesPerRow >> 8) & 0xff);
                bytes.push(h & 0xff, (h >> 8) & 0xff);

                for (let y = 0; y < h; y++) {
                    for (let xByte = 0; xByte < bytesPerRow; xByte++) {
                        let byte = 0;
                        for (let bit = 0; bit < 8; bit++) {
                            const x = xByte * 8 + bit;
                            if (x < w) {
                                const idx = (y * w + x) * 4;
                                const r = data[idx];
                                const g = data[idx + 1];
                                const b = data[idx + 2];
                                // Grayscale luminance
                                const brightness =
                                    0.299 * r + 0.587 * g + 0.114 * b;
                                // Pixel gelap = cetak, pixel terang = skip
                                if (brightness < 128) {
                                    byte |= 0x80 >> bit;
                                }
                            }
                        }
                        bytes.push(byte);
                    }
                }

                resolve(bytes);
            };
            img.onerror = (err) =>
                reject(new Error("Gagal load gambar: " + src));
            img.src = src;
        });
    };

    const line = "--------------------------------\n";

    // Helper: convert array of byte numbers ke base64 string
    const bytesToBase64 = (bytes) => {
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    // Helper: convert ESC/POS command string ke base64 safely
    const cmdToBase64 = (str) => {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytesToBase64(bytes);
    };

    const handlePrint = async () => {
        if (!setting.printer_connected) {
            alert("Printer belum terhubung.");
            return;
        }

        try {
            await connectQZ();
            const config = qz.configs.create(setting.printer_name);

            const logo = await imageToEscPos("/logo.png", 384); // maksimal 384 untuk 58mm
            const logoBase64 = bytesToBase64(logo);

            const enc = new TextEncoder();
            const textToBase64 = (str) => {
                const bytes = enc.encode(str);
                return bytesToBase64(Array.from(bytes));
            };

            const FONT_NORMAL = cmdToBase64("\x1D\x21\x00");
            const FONT_MEDIUM = cmdToBase64("\x1D\x21\x01");
            const FONT_LARGE = cmdToBase64("\x1D\x21\x11");
            const CENTER = cmdToBase64("\x1B\x61\x01");
            const LEFT = cmdToBase64("\x1B\x61\x00");
            const BOLD_ON = cmdToBase64("\x1B\x45\x01"); // tambah ini
            const BOLD_OFF = cmdToBase64("\x1B\x45\x00"); // tambah ini
            // ═══ STRUK 1 (lengkap dengan logo) ═══
            const struk1 = [
                {
                    type: "raw",
                    format: "base64",
                    data: cmdToBase64("\x1B\x40"),
                },
                { type: "raw", format: "base64", data: CENTER },

                // LOGO - full width
                { type: "raw", format: "base64", data: logoBase64 },
                { type: "raw", format: "base64", data: cmdToBase64("\n") },

                // JUDUL - bold + double width+height
                { type: "raw", format: "base64", data: BOLD_ON },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("BUKTI\n"),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("PEMBAYARAN\n"),
                },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: BOLD_ON },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("ZAKAT FITRAH 1447 H\n"),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // DATA
                { type: "raw", format: "base64", data: LEFT },
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Nama        : ${formData.namaPembayar}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `RT/RW       : ${formData.rt}/${formData.rw}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Jumlah Jiwa : ${formData.jumlahJiwa} jiwa\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Dibayar     : ${formData.melalui === "uang" ? "Uang" : "Beras"}\n`,
                    ),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // ZAKAT
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Zakat Fitrah : ${formData.melalui === "uang" ? formatRupiahPrint(totalBayar) : `${totalBayar} kg`}\n`,
                    ),
                },
                ...(formData.melalui === "uang" && sodaqohValue > 0
                    ? [
                          {
                              type: "raw",
                              format: "base64",
                              data: textToBase64(
                                  `Sodaqoh      : ${formatRupiahPrint(sodaqohValue)}\n`,
                              ),
                          },
                      ]
                    : []),
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // PANITIA & WAKTU
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(`Panitia : ${formData.namaPanitia}\n`),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Hari    : ${new Date().toLocaleDateString("id-ID", { weekday: "long" })}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Tanggal : ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Jam     : ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}\n`,
                    ),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // FOOTER
                { type: "raw", format: "base64", data: CENTER },
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("Jazakumullahu Khairan Katsiran\n"),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("Semoga Berkah\n"),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                {
                    type: "raw",
                    format: "base64",
                    data: cmdToBase64("\x1B\x64\x02"),
                },
            ];

            const separator = [
                { type: "raw", format: "base64", data: CENTER },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("--------------------------------\n"),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: cmdToBase64("\x1B\x64\x01"),
                },
            ];

            const struk2 = [
                { type: "raw", format: "base64", data: CENTER },
                { type: "raw", format: "base64", data: BOLD_ON },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64("ZAKAT FITRAH 1447 H\n"),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // DATA
                { type: "raw", format: "base64", data: LEFT },
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Nama        : ${formData.namaPembayar}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `RT/RW       : ${formData.rt}/${formData.rw}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Jumlah Jiwa : ${formData.jumlahJiwa} jiwa\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Dibayar     : ${formData.melalui === "uang" ? "Uang" : "Beras"}\n`,
                    ),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // ZAKAT
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Zakat Fitrah : ${formData.melalui === "uang" ? formatRupiahPrint(totalBayar) : `${totalBayar} kg`}\n`,
                    ),
                },
                ...(formData.melalui === "uang" && sodaqohValue > 0
                    ? [
                          {
                              type: "raw",
                              format: "base64",
                              data: textToBase64(
                                  `Sodaqoh      : ${formatRupiahPrint(sodaqohValue)}\n`,
                              ),
                          },
                      ]
                    : []),
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },

                // PANITIA & WAKTU
                { type: "raw", format: "base64", data: BOLD_ON },
                { type: "raw", format: "base64", data: FONT_MEDIUM },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(`Panitia : ${formData.namaPanitia}\n`),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Hari    : ${new Date().toLocaleDateString("id-ID", { weekday: "long" })}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Tanggal : ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}\n`,
                    ),
                },
                {
                    type: "raw",
                    format: "base64",
                    data: textToBase64(
                        `Jam     : ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}\n`,
                    ),
                },
                { type: "raw", format: "base64", data: BOLD_OFF },
                { type: "raw", format: "base64", data: FONT_NORMAL },
                { type: "raw", format: "base64", data: textToBase64(line) },
            ];

            const printData = [...struk1, ...separator, ...struk2];

            await qz.print(config, printData);
            console.log("Printed via QZ Tray");
            handleSubmit();
        } catch (error) {
            console.error(error);
            alert("Gagal print: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="flex justify-end mb-6">
                <Link
                    href="/zakat/input/dashboard"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full font-medium transition-colors"
                >
                    Dashboard
                </Link>
            </div>
            <div className="max-w-4xl mx-auto">
                <div
                    className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                        setting.printer_connected
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                >
                    <Printer size={18} />
                    <span className="text-sm font-medium">
                        {setting.printer_connected
                            ? `Printer terhubung: ${setting.printer_name}`
                            : "Printer belum terhubung - Print tidak tersedia"}
                    </span>
                </div>
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

                        {formData.melalui === "beras" && (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            Pilihan Berat Beras <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
            {[2.5, 2.8, 3].map((berat) => (
                <button
                    key={berat}
                    type="button"
                    onClick={() => handleBeratBerasChange(berat)}
                    className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-colors border ${
                        formData.beratBeras === berat
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {berat} kg
                </button>
            ))}
        </div>
        <p className="text-xs text-gray-500">
            * Default: 2.5 kg per jiwa (standar zakat fitrah)
        </p>
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
                                                      nilaiPerJiwa.uang,
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
                                                            sodaqohValue,
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
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="brightness-0 w-60 mx-auto h-auto"
                                />
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
                                            },
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
                                onClick={handlePrint}
                                disabled={!setting.printer_connected}
                                className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                                    setting.printer_connected
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <Save size={20} />
                                {setting.printer_connected
                                    ? "Simpan & Print"
                                    : "Printer Tidak Terhubung"}
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

