import React from "react";
import AppLayout from "../Layout/AppLayout";
import {
    TrendingUp,
    Package,
    Heart,
    Users,
    Box,
    AlertCircle,
    BoxesIcon,
} from "lucide-react";

export default function Dashboard({
    stats,
    distribusiRT,
    distribusiRW,
    maxJumlah,
    chartData,
    pemohonLuar,
    formulaJatah,
}) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard Zakat
                    </h1>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg shadow-md p-6 mb-4">
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                        <p className="text-sm font-medium text-yellow-800">
                            TOTAL DALAM JUMLAH KG ZAKAT
                        </p>
                        <p className="text-4xl font-bold text-gray-900">
                            {formulaJatah.totalBungkus * 2.5} KG /{" "}
                            {(formulaJatah.totalBungkus * 2.5) / 1000} TON
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-lg bg-yellow-200">
                                <BoxesIcon
                                    className="text-yellow-700"
                                    size={32}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    JUMLAH TOTAL BUNGKUS
                                </p>
                                <p className="text-4xl font-bold text-gray-900">
                                    {formulaJatah.totalBungkus}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-lg bg-yellow-200">
                                <Box className="text-yellow-700" size={32} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-yellow-800 mb-1">
                                    JATAH JAMAAH MASJID
                                </p>
                                <p className="text-4xl font-bold text-gray-900">
                                    {formulaJatah.totalBungkus -
                                        formulaJatah.sisaPembagian}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-lg bg-orange-200">
                                <AlertCircle
                                    className="text-orange-700"
                                    size={32}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-orange-800 mb-1">
                                    SISA PEMBAGIAN
                                </p>
                                <p className="text-4xl font-bold text-gray-900">
                                    {formulaJatah.sisaPembagian}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => {
                        const iconMap = {
                            TrendingUp,
                            Package,
                            Heart,
                            Users,
                        };
                        const Icon = iconMap[stat.icon];

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${stat.bgColor}`}
                                    >
                                        <Icon
                                            className={stat.iconColor}
                                            size={24}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Metode: Uang & Beras
                        </h3>
                        <div className="flex items-center justify-center py-8">
                            <div className="relative w-48 h-48">
                                <div
                                    className="w-full h-full rounded-full"
                                    style={{
                                        background: `conic-gradient(#16a34a 0% ${chartData.persentaseUang}%, #fbbf24 ${chartData.persentaseUang}% 100%)`,
                                    }}
                                ></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white rounded-full w-32 h-32 flex flex-col items-center justify-center">
                                    <p className="text-sm text-gray-600">
                                        Total
                                    </p>
                                    <p className="text-xl font-bold">
                                        {chartData.jumlahBayarUang +
                                            chartData.jumlahBayarBeras}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Pembayar
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded"></div>
                                <span className="text-sm text-gray-600">
                                    Uang {chartData.persentaseUang}% (
                                    {chartData.jumlahBayarUang})
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                                <span className="text-sm text-gray-600">
                                    Beras {chartData.persentaseBeras}% (
                                    {chartData.jumlahBayarBeras})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart - Bungkus per RT */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Jatah Bungkus per RT
                        </h3>
                        {distribusiRT.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-gray-500">
                                    Belum ada data distribusi RT
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {distribusiRT.map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative bg-gradient-to-br from-white text-center to-green-50 rounded-xl p-4 border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-200"
                                    >
                                        <div className="text-sm font-medium text-gray-600 mb-1">
                                            {item.rt}
                                        </div>
                                        <div className="flex items-baseline gap-1 text-center justify-center">
                                            <div className="text-3xl font-bold text-gray-900">
                                                {item.jumlah}
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-green-200">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${
                                                            (item.jumlah /
                                                                maxJumlah) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Pemohon Luar */}
                {pemohonLuar.jumlah > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Pemohon dari Luar RT/RW
                                </h3>
                                <p className="text-gray-600">
                                    Ada{" "}
                                    <span className="font-bold text-green-600">
                                        {pemohonLuar.jumlah}
                                    </span>{" "}
                                    pemohon dengan total permintaan{" "}
                                    <span className="font-bold text-blue-600">
                                        {pemohonLuar.totalPermintaan.toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </p>
                            </div>
                            <a
                                href="/pemohon"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Lihat Detail
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
