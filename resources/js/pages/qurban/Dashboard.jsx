import React from 'react';
import QurbanLayout from '../../Layout/QurbanLayout';

const rtData = [
    { rt: 'RT 48', sapi: 126, kambing: 70 },
    { rt: 'RT 49', sapi: 243, kambing: 43 },
    { rt: 'RT 50', sapi: 89, kambing: 12 },
    { rt: 'RT 51', sapi: 133, kambing: 43 },
    { rt: 'RT 52', sapi: 150, kambing: 60 },
    { rt: 'RT 53', sapi: 111, kambing: 32 },
    { rt: 'RT 56', sapi: 167, kambing: 99 },
    { rt: 'RT 57', sapi: 189, kambing: 44 },
];

export default function JumlahBungkus() {
    const totalBungkus = 1500;
    const bungkusSapi = 180;
    const jumlahSapi = 18;
    const bungkusKambing = 600;
    const jumlahKambing = 20;
    const penjualanKulit = '1.500.000';

    return (
        <QurbanLayout>
            <div className="bg-gray-50 p-5">
                <div className="bg-green-50 border-2 border-green-400 rounded-xl px-6 py-5 mb-3 text-center">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-1">
                        Total
                    </p>
                    <p className="text-7xl font-bold text-green-800 leading-none">
                        {totalBungkus.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm font-medium text-green-600 mt-1">bungkus daging qurban</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-yellow-200 flex items-center justify-center text-lg">
                                🐄
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide leading-tight">
                                    Bungkus Sapi
                                </p>
                                <p className="text-xs text-yellow-500">{jumlahSapi} ekor sapi</p>
                            </div>
                        </div>
                        <div className="border-t border-yellow-200 pt-2 text-center">
                            <p className="text-6xl font-bold text-yellow-800 leading-none">{bungkusSapi}</p>
                            <p className="text-xs text-yellow-600 mt-1">bungkus tersedia</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-200 flex items-center justify-center text-lg">
                                🐑
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide leading-tight">
                                    Bungkus Kambing
                                </p>
                                <p className="text-xs text-blue-500">{jumlahKambing} ekor kambing</p>
                            </div>
                        </div>
                        <div className="border-t border-blue-200 pt-2 text-center">
                            <p className="text-6xl font-bold text-blue-800 leading-none">{bungkusKambing}</p>
                            <p className="text-xs text-blue-600 mt-1">bungkus tersedia</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3">
                        Jatah bungkus per RT
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {rtData.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border-2 border-orange-200 rounded-xl p-3 flex flex-col items-center text-center shadow-sm"
                            >
                                <p className="text-xs font-medium mb-2">{item.rt}</p>


                                <p className="text-3xl font-bold text-gray-900 leading-none">{item.sapi}</p>
                                <div className="flex items-center justify-center gap-1 mt-0.5 mb-2">
                                    <p className="text-xs text-blue-500 font-medium">sapi</p>
                                </div>

                                <p className="text-3xl font-bold text-gray-900 leading-none">{item.kambing}</p>
                                <div className="flex items-center justify-center gap-1 mt-0.5 mb-2">
                                    <p className="text-xs text-green-500 font-medium">kambing</p>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-200 flex items-center justify-center text-lg">
                            🏷️
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Penjualan Kulit</p>
                            <p className="text-xs text-orange-500">hasil penjualan kulit hewan</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-orange-500 mb-0.5">total</p>
                        <p className="text-xl font-bold text-orange-700">Rp {penjualanKulit}</p>
                    </div>
                </div>

            </div>
        </QurbanLayout>
    );
}