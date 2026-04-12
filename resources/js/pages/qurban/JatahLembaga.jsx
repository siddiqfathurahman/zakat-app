import React, { useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function JatahLembaga({ jatah = [] }) {
    const { flash } = usePage().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [formErr, setFormErr] = useState('');

    const [form, setForm] = useState({
        nama_lembaga: '',
        jumlah_sapi: '',
        jumlah_kambing: '',
    });

    const [page, setPage] = useState(1);
    const PER = 10;

    // ─── Stats ───
    const stats = useMemo(() => ({
        totalLembaga: jatah.length,
        totalSapi: jatah.reduce((acc, r) => acc + Number(r.jumlah_sapi || 0), 0),
        totalKambing: jatah.reduce((acc, r) => acc + Number(r.jumlah_kambing || 0), 0),
    }), [jatah]);

    // ─── Pagination ───
    const totalPages = Math.max(1, Math.ceil(jatah.length / PER));
    const paginated = jatah.slice((page - 1) * PER, page * PER);
    const showPagination = jatah.length > PER;

    const pageNumbers = useMemo(() => {
        const pages = [];
        const delta = 2;
        for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
            pages.push(i);
        }
        return pages;
    }, [page, totalPages]);

    const start = jatah.length === 0 ? 0 : (page - 1) * PER + 1;
    const end = Math.min(page * PER, jatah.length);

    // ─── Modal helpers ───
    const openAdd = () => {
        setEditData(null);
        setForm({ nama_lembaga: '', jumlah_sapi: '', jumlah_kambing: '' });
        setFormErr('');
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditData(row);
        setForm({
            nama_lembaga: row.nama_lembaga,
            jumlah_sapi: String(row.jumlah_sapi),
            jumlah_kambing: String(row.jumlah_kambing),
        });
        setFormErr('');
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    // ─── Save ───
    const saveData = () => {
        const { nama_lembaga, jumlah_sapi, jumlah_kambing } = form;
        if (!nama_lembaga || jumlah_sapi === '' || jumlah_kambing === '') {
            setFormErr('Semua field wajib diisi');
            return;
        }
        if (editData) {
            router.post(`/qurban/input/jatah-lembaga/${editData.id}/update`, form, {
                onSuccess: () => closeModal(),
                onError: (e) => setFormErr(Object.values(e).join(', ')),
            });
        } else {
            router.post('/qurban/input/jatah-lembaga/store', form, {
                onSuccess: () => closeModal(),
                onError: (e) => setFormErr(Object.values(e).join(', ')),
            });
        }
    };

    // ─── Delete ───
    const doDelete = () => {
        router.post(`/qurban/input/jatah-lembaga/${confirmId}/destroy`, {}, {
            onSuccess: () => setConfirmId(null),
        });
    };

    return (
        <QurbanLayout>
            {/* Flash */}
            {flash?.success && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                    {flash.error}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data Jatah Lembaga Qurban</h1>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Data
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: 'Jumlah Lembaga',
                        val: stats.totalLembaga,
                        sub: 'lembaga terdaftar',
                        color: 'bg-orange-50 border-orange-200',
                        valColor: 'text-orange-700',
                        icon: (
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        ),
                    },
                    {
                        label: 'Total Jatah Sapi',
                        val: stats.totalSapi,
                        sub: 'bungkus sapi',
                        color: 'bg-blue-50 border-blue-200',
                        valColor: 'text-blue-700',
                        icon: (
                            <span className="text-2xl">🐄</span>
                        ),
                    },
                    {
                        label: 'Total Jatah Kambing',
                        val: stats.totalKambing,
                        sub: 'bungkus kambing',
                        color: 'bg-green-50 border-green-200',
                        valColor: 'text-green-700',
                        icon: (
                            <span className="text-2xl">🐐</span>
                        ),
                    },
                ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-4 border ${s.color} flex items-center gap-4`}>
                        <div className="flex-shrink-0">{s.icon}</div>
                        <div>
                            <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
                            <div className={`text-3xl font-bold ${s.valColor}`}>{s.val}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info row */}
            <div className="text-sm text-gray-500 mb-2">
                Menampilkan <span className="font-semibold text-gray-700">{start} - {end}</span> dari{' '}
                <span className="font-semibold text-gray-700">{jatah.length}</span> data
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-orange-600 text-white">
                            {['No', 'Nama Lembaga', 'Jumlah Sapi', 'Jumlah Kambing', 'Aksi'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                                        </svg>
                                        Belum ada data lembaga
                                    </div>
                                </td>
                            </tr>
                        ) : paginated.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`border-b border-gray-100 hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <td className="px-4 py-3 text-gray-400 text-xs w-12">{(page - 1) * PER + i + 1}</td>
                                <td className="px-4 py-3 font-semibold text-gray-800">{row.nama_lembaga}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {row.jumlah_sapi} bungkus
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {row.jumlah_kambing} bungkus
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => openEdit(row)}
                                            title="Edit"
                                            className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setConfirmId(row.id)}
                                            title="Hapus"
                                            className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination — hanya muncul jika data > 10 */}
            {showPagination && (
                <div className="flex justify-center items-center gap-1.5 mt-5">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >«</button>
                    <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >‹</button>

                    {pageNumbers[0] > 1 && (
                        <>
                            <button onClick={() => setPage(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition">1</button>
                            {pageNumbers[0] > 2 && <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>}
                        </>
                    )}

                    {pageNumbers.map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition border ${
                                p === page
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                                    : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300'
                            }`}
                        >{p}</button>
                    ))}

                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>}
                            <button onClick={() => setPage(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition">{totalPages}</button>
                        </>
                    )}

                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >›</button>
                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >»</button>
                </div>
            )}

            {/* Modal Tambah / Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="bg-orange-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">
                                {editData ? 'Edit Jatah Lembaga' : 'Tambah Jatah Lembaga'}
                            </h2>
                            <button onClick={closeModal} className="text-white/80 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                    Nama Lembaga <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={form.nama_lembaga}
                                    onChange={e => setForm(f => ({ ...f, nama_lembaga: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    placeholder="Masukkan nama lembaga"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                                        Jumlah Sapi <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.jumlah_sapi}
                                            onChange={e => setForm(f => ({ ...f, jumlah_sapi: e.target.value }))}
                                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                                        Jumlah Kambing <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.jumlah_kambing}
                                            onChange={e => setForm(f => ({ ...f, jumlah_kambing: e.target.value }))}
                                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {formErr && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                                    {formErr}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button
                                onClick={closeModal}
                                className="border border-gray-200 rounded-lg px-5 py-2 text-sm hover:bg-gray-50 transition text-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveData}
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-5 py-2 text-sm font-semibold transition shadow-sm"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            {confirmId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">Hapus Data?</p>
                                <p className="text-xs text-gray-500">Tindakan ini tidak bisa dibatalkan.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={doDelete}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </QurbanLayout>
    );
}