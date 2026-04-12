import React, { useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function Shohibul({ shohibulqurbans = [], filters = {} }) {
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search || '');
    const [jenisHewan, setJenisHewan] = useState(filters.jenis_hewan || '');
    const [nomorHewan, setNomorHewan] = useState(filters.nomor_hewan || '');
    const [sortUrutan, setSortUrutan] = useState(filters.sort_urutan || 'asc');

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmId, setConfirmId] = useState(null);
    const [formErr, setFormErr] = useState('');

    const [form, setForm] = useState({
        nama: '', panitia: '', rt: '', rw: '', jenis_hewan: '', nomor_hewan: ''
    });

    const [page, setPage] = useState(1);
    const PER = 10;

    const nomorOptions = useMemo(() => {
        const filtered = shohibulqurbans.filter(r =>
            !jenisHewan || r.jenis_hewan === jenisHewan
        );
        return [...new Set(filtered.map(r => r.nomor_hewan))].sort((a, b) => a - b);
    }, [shohibulqurbans, jenisHewan]);

    const stats = useMemo(() => {
        const sapi = shohibulqurbans.filter(r => r.jenis_hewan === 'sapi');
        const kambing = shohibulqurbans.filter(r => r.jenis_hewan === 'kambing');
        return {
            total: shohibulqurbans.length,
            sapi: sapi.length,
            sapiHewan: new Set(sapi.map(r => r.nomor_hewan)).size,
            kambing: kambing.length,
            kambingHewan: new Set(kambing.map(r => r.nomor_hewan)).size,
        };
    }, [shohibulqurbans]);

    const countSlot = (jenis, nomor) =>
        shohibulqurbans.filter(r => r.jenis_hewan === jenis && r.nomor_hewan === nomor).length;

    const nomorFormOptions = useMemo(() => {
        if (!form.jenis_hewan) return [];
        const max = form.jenis_hewan === 'sapi' ? 10 : 20;
        const limit = form.jenis_hewan === 'sapi' ? 7 : 99;
        const result = [];
        for (let i = 1; i <= max; i++) {
            const used = shohibulqurbans.filter(r =>
                r.jenis_hewan === form.jenis_hewan &&
                r.nomor_hewan === i &&
                (editData === null || r.id !== editData.id)
            ).length;
            if (used < limit) result.push({ nomor: i, used, limit });
        }
        return result;
    }, [form.jenis_hewan, shohibulqurbans, editData]);

    const totalPages = Math.max(1, Math.ceil(shohibulqurbans.length / PER));
    const paginated = shohibulqurbans.slice((page - 1) * PER, page * PER);
    const showPagination = shohibulqurbans.length > PER;

    const applyFilters = (overrides = {}) => {
        const params = {
            search,
            jenis_hewan: jenisHewan,
            nomor_hewan: nomorHewan,
            sort_urutan: sortUrutan,
            ...overrides,
        };
        router.get('/qurban/input/shohibul', params, {
            preserveState: true,
            replace: true,
        });
        setPage(1);
    };

    const openAdd = () => {
        setEditData(null);
        setForm({ nama: '', panitia: '', rt: '', rw: '', jenis_hewan: '', nomor_hewan: '' });
        setFormErr('');
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditData(row);
        setForm({
            nama: row.nama,
            panitia: row.panitia,
            rt: row.rt,
            rw: row.rw,
            jenis_hewan: row.jenis_hewan,
            nomor_hewan: String(row.nomor_hewan),
        });
        setFormErr('');
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const saveData = () => {
        const { nama, panitia, rt, rw, jenis_hewan, nomor_hewan } = form;
        if (!nama || !panitia || !rt || !rw || !jenis_hewan || !nomor_hewan) {
            setFormErr('Semua field wajib diisi');
            return;
        }
        if (editData) {
            router.post(`/qurban/input/shohibul/${editData.id}/update`, form, {
                onSuccess: () => closeModal(),
                onError: (e) => setFormErr(Object.values(e).join(', ')),
            });
        } else {
            router.post('/qurban/input/shohibul/store', form, {
                onSuccess: () => closeModal(),
                onError: (e) => setFormErr(Object.values(e).join(', ')),
            });
        }
    };

    const doDelete = () => {
        router.post(`/qurban/input/shohibul/${confirmId}/destroy`, {}, {
            onSuccess: () => setConfirmId(null),
        });
    };

    const SlotBar = ({ jenis, nomor }) => {
        const max = jenis === 'sapi' ? 7 : 1;
        const used = countSlot(jenis, nomor);
        return (
            <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 ml-1">{used}/{max}</span>
            </div>
        );
    };

    // Pagination page numbers
    const pageNumbers = useMemo(() => {
        const pages = [];
        const delta = 2;
        for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
            pages.push(i);
        }
        return pages;
    }, [page, totalPages]);

    const start = shohibulqurbans.length === 0 ? 0 : (page - 1) * PER + 1;
    const end = Math.min(page * PER, shohibulqurbans.length);

    return (
        <QurbanLayout>
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
                <h1 className="text-2xl font-bold text-gray-800">Data Shohibul Qurban</h1>
                <div className="flex gap-2">
                    <a
                        href={`/qurban/input/shohibul/print?search=${encodeURIComponent(search)}&jenis_hewan=${encodeURIComponent(jenisHewan)}&nomor_hewan=${encodeURIComponent(nomorHewan)}&sort_urutan=${encodeURIComponent(sortUrutan)}`}
                        target="_blank"
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Data
                    </a>
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
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Shohibul', val: stats.total, color: 'bg-orange-50 border-orange-200', valColor: 'text-orange-700' },
                    { label: 'Shohibul Sapi', val: stats.sapi, sub: `${stats.sapiHewan} ekor`, color: 'bg-blue-50 border-blue-200', valColor: 'text-blue-700' },
                    { label: 'Shohibul Kambing', val: stats.kambing, sub: `${stats.kambingHewan} ekor`, color: 'bg-green-50 border-green-200', valColor: 'text-green-700' },
                ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-4 border ${s.color}`}>
                        <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                        <div className={`text-3xl font-bold ${s.valColor}`}>{s.val}</div>
                        {s.sub && <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>}
                    </div>
                ))}
            </div>

            {/* Filter Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex flex-nowrap gap-3 items-end overflow-x-auto">

                    <div className="min-w-[220px]">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Cari Nama / Panitia
                    </label>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                        placeholder="Cari..."
                        className="w-200 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                        <button
                        onClick={() => applyFilters({ search })}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm flex items-center"
                        >
                        Cari
                        </button>
                    </div>
                    </div>

                    <div className="min-w-[160px]">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Jenis Hewan
                    </label>
                    <select
                        value={jenisHewan}
                        onChange={e => {
                        setJenisHewan(e.target.value);
                        setNomorHewan('');
                        applyFilters({ jenis_hewan: e.target.value, nomor_hewan: '' });
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    >
                        <option value="">Semua</option>
                        <option value="sapi">Sapi</option>
                        <option value="kambing">Kambing</option>
                    </select>
                    </div>

                    <div className="min-w-[160px]">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Nomor Hewan
                    </label>
                    <select
                        value={nomorHewan}
                        onChange={e => {
                        setNomorHewan(e.target.value);
                        applyFilters({ nomor_hewan: e.target.value });
                        }}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    >
                        <option value="">Semua</option>
                        {nomorOptions.map(n => (
                        <option key={n} value={n}>No {n}</option>
                        ))}
                    </select>
                    </div>

                    <div className="min-w-[120px]">
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                        Urutan
                    </label>
                    <button
                        onClick={() => {
                        const nextSort = sortUrutan === 'asc' ? 'desc' : 'asc';
                        setSortUrutan(nextSort);
                        applyFilters({ sort_urutan: nextSort });
                        }}
                        className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition"
                    >
                        {sortUrutan === 'asc' ? (
                        <ArrowDownAZ className="w-4 h-4" />
                        ) : (
                        <ArrowUpZA className="w-4 h-4" />
                        )}
                    </button>
                    </div>

                </div>
                </div>

            {/* Info row */}
            <div className="text-sm text-gray-500 mb-2">
                Menampilkan <span className="font-semibold text-gray-700">{start} - {end}</span> dari <span className="font-semibold text-gray-700">{shohibulqurbans.length}</span> data
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-orange-600 text-white">
                            {['No', 'Nama Shohibul', 'Panitia', 'RT/RW', 'Jenis Hewan', 'No. Hewan', 'Slot', 'Aksi'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                                        </svg>
                                        Belum ada data
                                    </div>
                                </td>
                            </tr>
                        ) : paginated.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`border-b border-gray-100 hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PER + i + 1}</td>
                                <td className="px-4 py-3 font-semibold text-gray-800">{row.nama}</td>
                                <td className="px-4 py-3 text-gray-600">{row.panitia}</td>
                                <td className="px-4 py-3 text-gray-600">{row.rt}/{row.rw}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        row.jenis_hewan === 'sapi'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-green-100 text-green-700'
                                    }`}>
                                        {row.jenis_hewan === 'sapi' ? '🐄' : '🐐'} {row.jenis_hewan}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{row.nomor_hewan}</td>
                                <td className="px-4 py-3">
                                    <SlotBar jenis={row.jenis_hewan} nomor={row.nomor_hewan} />
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
                    >
                        «
                    </button>
                    <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >
                        ‹
                    </button>

                    {/* Ellipsis kiri */}
                    {pageNumbers[0] > 1 && (
                        <>
                            <button
                                onClick={() => setPage(1)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition"
                            >
                                1
                            </button>
                            {pageNumbers[0] > 2 && (
                                <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>
                            )}
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
                        >
                            {p}
                        </button>
                    ))}

                    {/* Ellipsis kanan */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>
                            )}
                            <button
                                onClick={() => setPage(totalPages)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >
                        ›
                    </button>
                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition"
                    >
                        »
                    </button>
                </div>
            )}

            {/* Modal Tambah / Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-orange-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">
                                {editData ? 'Edit Data Shohibul' : 'Tambah Data Shohibul'}
                            </h2>
                            <button onClick={closeModal} className="text-white/80 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Shohibul <span className="text-red-500">*</span></label>
                                <input
                                    value={form.nama}
                                    onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    placeholder="Masukkan nama shohibul"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Panitia <span className="text-red-500">*</span></label>
                                <input
                                    value={form.panitia}
                                    onChange={e => setForm(f => ({ ...f, panitia: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    placeholder="Nama panitia"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">RT <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.rt}
                                        onChange={e => setForm(f => ({ ...f, rt: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="01"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">RW <span className="text-red-500">*</span></label>
                                    <input
                                        value={form.rw}
                                        onChange={e => setForm(f => ({ ...f, rw: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="02"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Jenis Hewan <span className="text-red-500">*</span></label>
                                    <select
                                        value={form.jenis_hewan}
                                        onChange={e => setForm(f => ({ ...f, jenis_hewan: e.target.value, nomor_hewan: '' }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="sapi">🐄 Sapi</option>
                                        <option value="kambing">🐐 Kambing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Nomor Hewan <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.nomor_hewan}
                                        onChange={e => setForm(f => ({ ...f, nomor_hewan: e.target.value }))}
                                        disabled={!form.jenis_hewan}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 disabled:bg-gray-50 disabled:text-gray-400"
                                        placeholder="Masukkan nomor..."
                                    />
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