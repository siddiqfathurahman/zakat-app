import React, { useState } from 'react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function Dashboard({
    totalBungkus = 0,
    bungkusSapi = 0,
    jumlahSapi = 0,
    bungkusKambing = 0,
    jumlahKambing = 0,
    penjualanKulit = '0',
    rtData = []
}) {
    const [selectedRT, setSelectedRT] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (item) => {
        setSelectedRT(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => setSelectedRT(null), 300);
    };

    const sudahPersen = selectedRT
        ? Math.round((selectedRT.sudahAmbil / (selectedRT.total || 1)) * 100)
        : 0;

    return (
        <QurbanLayout>
            <div className="bg-gray-50 p-1">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard Qurban
                    </h1>
                </div>
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
                            <div className="w-9 h-9 rounded-lg bg-yellow-200 flex items-center justify-center text-lg font-semibold">
                                {jumlahSapi}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide leading-tight">
                                    Bungkus Sapi
                                </p>
                                <p className="text-xs text-yellow-500"> ekor sapi</p>
                            </div>
                        </div>
                        <div className="border-t border-yellow-200 pt-2 text-center">
                            <p className="text-6xl font-bold text-yellow-800 leading-none">{bungkusSapi}</p>
                            <p className="text-xs text-yellow-600 mt-1">bungkus tersedia</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-200 flex items-center justify-center text-lg font-semibold">
                                {jumlahKambing}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide leading-tight">
                                    Bungkus Kambing
                                </p>
                                <p className="text-xs text-blue-500">ekor kambing</p>
                            </div>
                        </div>
                        <div className="border-t border-blue-200 pt-2 text-center">
                            <p className="text-6xl font-bold text-blue-800 leading-none">{bungkusKambing}</p>
                            <p className="text-xs text-blue-600 mt-1">bungkus tersedia</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-gray-500">
                        Jatah bungkus per RT
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {rtData.map((item, index) => {
                            const persen = Math.round(((item.sudahAmbil ?? 0) / (item.total || 1)) * 100);
                            return (
                                <button
                                    key={index}
                                    onClick={() => openModal(item)}
                                    className="bg-white border-2 border-orange-200 rounded-xl p-3 flex flex-col items-center text-center shadow-sm
                                               hover:border-orange-400 hover:shadow-md hover:scale-105 hover:bg-orange-50
                                               active:scale-95 transition-all duration-200 cursor-pointer w-full"
                                >
                                    <p className="text-xs font-semibold text-gray-600 mb-1">{item.rt}</p>

                                    <p className="text-3xl font-bold text-yellow-700 leading-none">{item.sapi}</p>
                                    <p className="text-xs text-yellow-500 font-medium mb-1">sapi</p>

                                    <p className="text-3xl font-bold text-blue-700 leading-none">{item.kambing}</p>
                                    <p className="text-xs text-blue-500 font-medium mb-2">kambing</p>

                                    {/* Progress mini */}
                                    {item.total > 0 && (
                                        <div className="w-full">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${persen}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{persen}%</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
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

            {/* ===== MODAL DETAIL RT ===== */}
            {modalOpen && selectedRT && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                        style={{ animation: 'modalIn 0.25s ease-out' }}
                    >
                        {/* Header Modal */}
                        <div className="bg-orange-700 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-white text-2xl font-bold">{selectedRT.rt}</h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 border-b border-gray-200">
                            <div className="px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-gray-800">{selectedRT.total ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Total Penerima</p>
                            </div>
                            <div className="px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-green-600">{selectedRT.sudahAmbil ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Sudah Ambil</p>
                            </div>
                            <div className="px-4 py-3 text-center">
                                <p className="text-2xl font-bold text-red-500">{selectedRT.belumAmbil ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Belum Ambil</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 py-3 border-b border-gray-100">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress Pengambilan</span>
                                <span className="font-semibold text-green-600">{sudahPersen}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="h-3 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${sudahPersen}%`,
                                        background: 'linear-gradient(90deg, #22c55e, #16a34a)'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                                    <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                                        Belum Mengambil 
                                    </h3>
                                </div>
                                {(selectedRT.listBelum ?? []).length === 0 ? (
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-600">
                                        <span>Semua sudah mengambil!</span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                                        {(selectedRT.listBelum ?? []).map((p, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-[10px] font-bold flex-shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800">{p.nama}</span>
                                                </div>
                                                <div className="flex gap-1.5 text-[10px]">
                                                    {p.sapi > 0 && (
                                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                                            {p.sapi} Sapi
                                                        </span>
                                                    )}
                                                    {p.kambing > 0 && (
                                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                            {p.kambing} Kambing
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sudah Ambil
                            {(selectedRT.listSudah ?? []).length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                                        <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                                            Sudah Mengambil ({selectedRT.sudahAmbil ?? 0})
                                        </h3>
                                    </div>
                                    <div className="space-y-1.5">
                                        {(selectedRT.listSudah ?? []).map((p, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-500 text-sm">✓</span>
                                                    <span className="text-sm text-gray-600 line-through decoration-gray-400">{p.nama}</span>
                                                </div>
                                                <div className="flex gap-1.5 text-[10px]">
                                                    {p.sapi > 0 && (
                                                        <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">
                                                            🐄 {p.sapi}
                                                        </span>
                                                    )}
                                                    {p.kambing > 0 && (
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                                            🐐 {p.kambing}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="w-full bg-orange-700
                                           text-white font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animasi modal */}
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.92) translateY(16px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </QurbanLayout>
    );
}