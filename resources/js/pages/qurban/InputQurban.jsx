import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Html5QrcodeScanner } from "html5-qrcode";
import QurbanLayout from "../../Layout/QurbanLayout";
import { Search } from "lucide-react";
import axios from "axios";

export default function InputQurban() {
    const [scanResult, setScanResult] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Initialize QR Scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false,
        );

        scanner.render(
            (decodedText) => {
                // When scan successes
                scanner.pause(true); // pause so it doesn't repeatedly scan
                handleScanKode(decodedText);

                // resume after 3 seconds gracefully
                setTimeout(() => {
                    if (scanner.getState() === 2) {
                        // 2 corresponds to PUSED
                        scanner.resume();
                    }
                }, 3000);
            },
            (error) => {
                // Ignore general errors which are just "no qr code found in frame"
            },
        );

        return () => {
            scanner
                .clear()
                .catch((error) =>
                    console.error("Failed to clear scanner", error),
                );
        };
    }, []);

    const handleScanKode = async (kode) => {
        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch(
                `/qurban/input/scan/${encodeURIComponent(kode.trim())}`,
            );

            if (!response.ok) {
                // Not Found or other error
                const json = await response.json();
                throw new Error(json.message || "Data tidak ditemukan");
            }

            const data = await response.json();
            setScanResult(data);
        } catch (err) {
            setScanResult(null);
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        handleScanKode(searchQuery);
    };

    const handleClaim = async () => {
        if (!scanResult) return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                `/qurban/input/claim/${encodeURIComponent(scanResult.kode_unik)}`,
            );
            // Update UI
            setScanResult(response.data.data);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    err.message ||
                    "Gagal melakukan claim",
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Styling generator for the box based on status
    const getResultBoxStyle = (status) => {
        switch (status) {
            case "pending":
                return "border-green-400 bg-green-50 shadow-green-100";
            case "claimed":
                return "border-red-400 bg-red-50 shadow-red-100";
            case "shohibul":
                return "border-yellow-400 bg-yellow-50 shadow-yellow-100";
            default:
                return "border-gray-200 bg-gray-50";
        }
    };

    // Badge styling generator
    const getBadgeStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-green-600 text-white";
            case "claimed":
                return "bg-red-600 text-white";
            case "shohibul":
                return "bg-yellow-600 text-white";
            default:
                return "bg-gray-600 text-white";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Belum Diambil";
            case "claimed":
                return "Sudah Diambil";
            case "shohibul":
                return "Shohibul Qurban";
            default:
                return "Status Tidak Diketahui";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Scanner Qurban
                    </h1>
                    <p className="text-gray-600 mb-5">
                        Scan QR Code atau cari data penerima / shohibul Qurban
                    </p>
                    <a
                        href="/qurban/input/dashboard"
                        className="bg-orange-600  hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg"
                    >
                        Dashboard
                    </a>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3"
                >
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                            placeholder="Cari berdasarkan Kode Unik..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                    >
                        {isLoading ? "Mencari..." : "Cari"}
                    </button>
                </form>

                {/* QR Code Scanner */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
                    <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                        Arahkan Kamera ke QR Code
                    </h2>
                    <div
                        id="reader"
                        className="mx-auto max-w-sm rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
                    ></div>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center animate-pulse">
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* Scan Result */}
                {scanResult && (
                    <div
                        className={`border-2 rounded-xl p-6 shadow-lg transition-all ${getResultBoxStyle(scanResult.status)}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                    {scanResult.nama}
                                </h3>
                                <p className="text-gray-600 font-medium">
                                    RT {scanResult.rt} / RW {scanResult.rw}
                                </p>
                                <p className="text-sm font-mono mt-1 text-gray-500">
                                    {scanResult.kode_unik}
                                </p>
                            </div>
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${getBadgeStyle(scanResult.status)}`}
                            >
                                {getStatusText(scanResult.status)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-6">
                            <div className="bg-white/60 p-4 rounded-lg text-center border border-white">
                                <p className="text-sm text-gray-500 mb-1">
                                    Jumlah Jiwa
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {scanResult.jiwa}
                                </p>
                            </div>
                            <div className="bg-white/60 p-4 rounded-lg text-center border border-white">
                                <p className="text-sm text-gray-500 mb-1">
                                    Jatah Sapi
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {" "}
                                    {scanResult.jatah_sapi ?? 0}
                                </p>
                            </div>
                            <div className="bg-white/60 p-4 rounded-lg text-center border border-white">
                                <p className="text-sm text-gray-500 mb-1">
                                    Jatah Kambing
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {" "}
                                    {scanResult.jatah_kambing ?? 0}
                                </p>
                            </div>
                        </div>

                        {/* Action Button: only when pending */}
                        {scanResult.status === "pending" && (
                            <button
                                onClick={handleClaim}
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading
                                    ? "Memproses..."
                                    : "Tandai Sudah Diambil"}
                            </button>
                        )}

                        {scanResult.status === "claimed" && (
                            <div className="text-center font-bold text-red-600 bg-red-100 py-3 rounded-lg">
                                Data ini sudah diklaim dan tidak dapat diambil
                                kembali
                            </div>
                        )}

                        {scanResult.status === "shohibul" && (
                            <div className="text-center font-bold text-yellow-700 bg-yellow-100 py-3 rounded-lg">
                                Penerima merupakan Shohibul Qurban
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
