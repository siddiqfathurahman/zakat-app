import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import QurbanLayout from '../../Layout/QurbanLayout';

const STATUS_CONFIG = {
    pending:  { label: 'Belum Diambil', bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200'  },
    claimed:  { label: 'Sudah Diambil', bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200' },
    shohibul: { label: 'Shohibul',      bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200'},
};

export default function PenerimaQurban({ penerimas = [], configs = {} }) {
    const { flash } = usePage().props;

    // ─── State ───
    const [search, setSearch]               = useState('');
    const [filterStatus, setFilterStatus]   = useState('');
    const [filterAgama, setFilterAgama]     = useState('');
    const [page, setPage]                   = useState(1);
    const [modalOpen, setModalOpen]         = useState(false);
    const [editData, setEditData]           = useState(null);
    const [confirmId, setConfirmId]         = useState(null);
    const [detailData, setDetailData]       = useState(null);
    const [formErr, setFormErr]             = useState('');
    const [filterRt, setFilterRt] = useState('');

    useEffect(() => { setPage(1); }, [search, filterStatus, filterAgama, filterRt]);

    const [form, setForm] = useState({
        nama: '', rt: '', rw: '', agama: 'muslim', jiwa: '',
    });

    const getJatah = (jiwa, isNonMuslim = false) => {
        const cat = isNonMuslim ? 'nonmuslim' : 'muslim';
        return configs.find(c => c.kategori === cat && c.jiwa === jiwa) || { jatah_sapi: 0, jatah_kambing: 0 };
    };

    const [jatahConfig, setJatahConfig] = useState({
        1: { jatah_sapi: getJatah(1).jatah_sapi, jatah_kambing: getJatah(1).jatah_kambing },
        2: { jatah_sapi: getJatah(2).jatah_sapi, jatah_kambing: getJatah(2).jatah_kambing },
        3: { jatah_sapi: getJatah(3).jatah_sapi, jatah_kambing: getJatah(3).jatah_kambing },
        4: { jatah_sapi: getJatah(4).jatah_sapi, jatah_kambing: getJatah(4).jatah_kambing },
        5: { jatah_sapi: getJatah(5).jatah_sapi, jatah_kambing: getJatah(5).jatah_kambing },
    });

    const [nonMuslimConfig, setNonMuslimConfig] = useState({
        jatah_sapi: getJatah(1, true).jatah_sapi,
        jatah_kambing: getJatah(1, true).jatah_kambing,
    });

    const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
    const [isConfirmApplyOpen, setIsConfirmApplyOpen] = useState(false);

    const PER = 10;

    useEffect(() => { setPage(1); }, [search, filterStatus, filterAgama]);

    // ─── Filter ───
    const filtered = useMemo(() => {
        return penerimas.filter(r => {
            const matchSearch = !search ||
                r.nama.toLowerCase().includes(search.toLowerCase()) ||
                r.kode_unik?.toLowerCase().includes(search.toLowerCase());
            const matchStatus = !filterStatus || r.status === filterStatus;
            const matchAgama  = !filterAgama  || r.agama  === filterAgama;
            const matchRt     = !filterRt     || r.rt     === filterRt;
            
            return matchSearch && matchStatus && matchAgama && matchRt;
        });
    }, [penerimas, search, filterStatus, filterAgama, filterRt]);

    const totalPages    = Math.max(1, Math.ceil(filtered.length / PER));
    const paginated     = filtered.slice((page - 1) * PER, page * PER);
    const showPagination = filtered.length > PER;
    const start         = filtered.length === 0 ? 0 : (page - 1) * PER + 1;
    const end           = Math.min(page * PER, filtered.length);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
        return pages;
    }, [page, totalPages]);

    // ─── Modal helpers ───
    const openAdd = () => {
        setEditData(null);
        setForm({ nama: '', rt: '', rw: '', agama: 'muslim', jiwa: '' });
        setFormErr('');
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditData(row);
        setForm({
            nama:  row.nama,
            rt:    row.rt,
            rw:    row.rw,
            agama: row.agama,
            jiwa:  String(row.jiwa),
        });
        setFormErr('');
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const saveData = () => {
        const { nama, rt, rw, agama, jiwa } = form;
        if (!nama || !rt || !rw || !agama || !jiwa) {
            setFormErr('Semua field wajib diisi');
            return;
        }
        if (editData) {
            router.post(`/qurban/input/penerima/${editData.id}/update`, form, {
                onSuccess: () => closeModal(),
                onError:   (e) => setFormErr(Object.values(e).join(', ')),
            });
        } else {
            router.post('/qurban/input/penerima', form, {
                onSuccess: () => closeModal(),
                onError:   (e) => setFormErr(Object.values(e).join(', ')),
            });
        }
    };

    const doDelete = () => {
        router.post(`/qurban/input/penerima/${confirmId}/destroy`, {}, {
            onSuccess: () => setConfirmId(null),
        });
    };

    const updateStatus = (row, status) => {
        router.post(`/qurban/input/penerima/${row.id}/update`, { ...row, status });
    };

    const handleJatahConfigChange = (jiwa, field, value) => {
        setJatahConfig(prev => ({
            ...prev,
            [jiwa]: { ...prev[jiwa], [field]: value }
        }));
    };

    const handleSaveJatahConfig = () => {
        // payload format expecting array of objects with jiwa & kategori
        const payload = [
            ...[1, 2, 3, 4, 5].map(jiwa => ({
                jiwa,
                kategori: 'muslim',
                jatah_sapi: jatahConfig[jiwa].jatah_sapi,
                jatah_kambing: jatahConfig[jiwa].jatah_kambing,
            })),
            {
                jiwa: 1, // Non-muslim uses 1 flat config
                kategori: 'nonmuslim',
                jatah_sapi: nonMuslimConfig.jatah_sapi,
                jatah_kambing: nonMuslimConfig.jatah_kambing,
            }
        ];

        router.post('/qurban/input/jatah-config', { configs: payload }, {
            onSuccess: () => setIsConfirmSaveOpen(false)
        });
    };

    const handleApplyJatah = () => {
        router.post('/qurban/input/jatah-config/apply', {}, {
            onSuccess: () => setIsConfirmApplyOpen(false)
        });
    };

    // ─── QR Code renderer (pakai API google charts / simple canvas) ───
    const QRImage = ({ kode }) => (
        <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(kode)}`}
            alt="QR"
            className="w-28 h-28 rounded-lg border border-gray-200"
        />
    );

    const rtList = useMemo(() => {
        const set = new Set(penerimas.map(r => r.rt));
        return [...set].sort((a, b) => Number(a) - Number(b));
    }, [penerimas]);

    return (
        <QurbanLayout>
            {flash?.success && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">{flash.success}</div>
            )}
            {flash?.error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{flash.error}</div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data Penerima Qurban</h1>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Penerima
                </button>
            </div>

            {/* Konfigurasi Jatah Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-gray-800">
                            Konfigurasi Jatah per Jiwa
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsConfirmSaveOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            💾 Simpan Konfigurasi
                        </button>
                        <button
                            onClick={() => setIsConfirmApplyOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
                        >
                            Terapkan ke Semua Penerima
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-orange-600 text-white text-sm">
                            <tr>
                                <th className="px-4 py-3 text-center border-r border-orange-500/30">Kategori / Jiwa</th>
                                <th className="px-4 py-3 text-center" colSpan={5}>Muslim (Berdasarkan Jiwa)</th>
                                <th className="px-4 py-3 text-center border-l border-orange-500/30">Non Muslim</th>
                            </tr>
                            <tr className="bg-orange-500">
                                <th className="px-4 py-2 text-center border-r border-orange-400/30"></th>
                                <th className="px-4 py-2 text-center text-xs">1</th>
                                <th className="px-4 py-2 text-center text-xs">2</th>
                                <th className="px-4 py-2 text-center text-xs">3</th>
                                <th className="px-4 py-2 text-center text-xs">4</th>
                                <th className="px-4 py-2 text-center text-xs">5+</th>
                                <th className="px-4 py-2 text-center text-xs border-l border-orange-400/30">Semua Jiwa</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-gray-100">
                                <td className="px-4 py-3 text-center font-medium text-gray-700 bg-orange-50 border-r border-gray-100">Jatah Sapi</td>
                                {[1, 2, 3, 4, 5].map((jiwa) => (
                                    <td key={`sapi-${jiwa}`} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={jatahConfig[jiwa].jatah_sapi}
                                            onChange={(e) => handleJatahConfigChange(jiwa, 'jatah_sapi', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="0"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 bg-gray-50 border-l border-gray-100">
                                    <input
                                        type="number"
                                        value={nonMuslimConfig.jatah_sapi}
                                        onChange={(e) => setNonMuslimConfig({ ...nonMuslimConfig, jatah_sapi: e.target.value })}
                                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="0"
                                    />
                                </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <td className="px-4 py-3 text-center font-medium text-gray-700 bg-orange-50 border-r border-gray-100">Jatah Kambing</td>
                                {[1, 2, 3, 4, 5].map((jiwa) => (
                                    <td key={`kambing-${jiwa}`} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={jatahConfig[jiwa].jatah_kambing}
                                            onChange={(e) => handleJatahConfigChange(jiwa, 'jatah_kambing', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="0"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 bg-gray-50 border-l border-gray-100">
                                    <input
                                        type="number"
                                        value={nonMuslimConfig.jatah_kambing}
                                        onChange={(e) => setNonMuslimConfig({ ...nonMuslimConfig, jatah_kambing: e.target.value })}
                                        className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="0"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Cari Nama / Kode</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama atau kode unik..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Filter Status</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 min-w-[150px]">
                            <option value="">Semua Status</option>
                            <option value="pending">Belum Diambil</option>
                            <option value="claimed">Sudah Diambil</option>
                            <option value="shohibul">Shohibul</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Filter Agama</label>
                        <select value={filterAgama} onChange={e => setFilterAgama(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 min-w-[130px]">
                            <option value="">Semua Agama</option>
                            <option value="muslim">Muslim</option>
                            <option value="nonmuslim">Non Muslim</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Filter RT</label>
                        <select value={filterRt} onChange={e => setFilterRt(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 min-w-[120px]">
                            <option value="">Semua RT</option>
                            {rtList.map(rt => (
                                <option key={rt} value={rt}>RT {rt}</option>
                            ))}
                        </select>
                    </div>
                    {(search || filterStatus || filterAgama) && (
                        <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterAgama(''); setFilterRt(''); }}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-500 mb-2">
                Menampilkan <span className="font-semibold text-gray-700">{start} - {end}</span> dari{' '}
                <span className="font-semibold text-gray-700">{filtered.length}</span> data
                {filtered.length !== penerimas.length && (
                    <span className="text-gray-400"> (dari total {penerimas.length})</span>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-orange-600 text-white">
                                {['No', 'Nama', 'RT/RW', 'Agama', 'Jiwa', 'Jatah Sapi', 'Jatah Kambing', 'Kode QR', 'Status', 'Aksi'].map(h => (
                                    <th key={h} className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-16 text-gray-400 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                                            </svg>
                                            Belum ada data penerima
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map((row, i) => {
                                const st = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={row.id}
                                        className={`border-b border-gray-100 hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-3 py-3 text-gray-400 text-xs">{(page - 1) * PER + i + 1}</td>
                                        <td className="px-3 py-3 font-semibold text-gray-800 whitespace-nowrap">{row.nama}</td>
                                        <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{row.rt}/{row.rw}</td>
                                        <td className="px-3 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                row.agama === 'muslim'
                                                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                            }`}>
                                                {row.agama === 'muslim' ? 'Muslim' : 'Non Muslim'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-gray-700 font-medium text-center">{row.jiwa}</td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                                                 {row.jatah_sapi ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                                                {row.jatah_kambing ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <button onClick={() => setDetailData(row)}
                                                className="inline-flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                                                </svg>
                                                Lihat QR
                                            </button>
                                        </td>
                                        <td className="px-3 py-3">
                                            <select
                                                value={row.status}
                                                onChange={e => updateStatus(row, e.target.value)}
                                                className={`text-xs font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400 cursor-pointer ${st.bg} ${st.text} ${st.border}`}
                                            >
                                                <option value="pending">Belum Diambil</option>
                                                <option value="claimed">Sudah Diambil</option>
                                                <option value="shohibul">Shohibul</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex gap-1.5">
                                                <button onClick={() => openEdit(row)} title="Edit"
                                                    className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setConfirmId(row.id)} title="Hapus"
                                                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {showPagination && (
                <div className="flex justify-center items-center gap-1.5 mt-5">
                    <button onClick={() => setPage(1)} disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition">«</button>
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition">‹</button>
                    {pageNumbers[0] > 1 && (
                        <>
                            <button onClick={() => setPage(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs">1</button>
                            {pageNumbers[0] > 2 && <span className="text-gray-400 text-xs px-1">...</span>}
                        </>
                    )}
                    {pageNumbers.map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition border ${
                                p === page ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-200 text-gray-600 hover:bg-orange-50'
                            }`}>{p}</button>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-400 text-xs px-1">...</span>}
                            <button onClick={() => setPage(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs">{totalPages}</button>
                        </>
                    )}
                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition">›</button>
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition">»</button>
                </div>
            )}

            {/* Modal Tambah / Edit */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="bg-orange-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">
                                {editData ? 'Edit Penerima' : 'Tambah Penerima'}
                            </h2>
                            <button onClick={closeModal} className="text-white/80 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama <span className="text-red-500">*</span></label>
                                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                    placeholder="Nama penerima" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">RT <span className="text-red-500">*</span></label>
                                    <input value={form.rt} onChange={e => setForm(f => ({ ...f, rt: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="01" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">RW <span className="text-red-500">*</span></label>
                                    <input value={form.rw} onChange={e => setForm(f => ({ ...f, rw: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="02" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Agama <span className="text-red-500">*</span></label>
                                    <select value={form.agama} onChange={e => setForm(f => ({ ...f, agama: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 bg-white">
                                        <option value="muslim">Muslim</option>
                                        <option value="nonmuslim">Non Muslim</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Jumlah Jiwa <span className="text-red-500">*</span></label>
                                    <input type="number" min="1" value={form.jiwa} onChange={e => setForm(f => ({ ...f, jiwa: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="1" />
                                </div>
                            </div>
                            {formErr && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">{formErr}</div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-6">
                            <button onClick={closeModal}
                                className="border border-gray-200 rounded-lg px-5 py-2 text-sm hover:bg-gray-50 transition text-gray-600">Batal</button>
                            <button onClick={saveData}
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-5 py-2 text-sm font-semibold transition shadow-sm">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail QR */}
            {detailData && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                        <div className="bg-orange-600 rounded-t-2xl px-6 py-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-white">Kode QR Penerima</h2>
                            <button onClick={() => setDetailData(null)} className="text-white/80 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-4">
                            <QRImage kode={detailData.kode_unik} />
                            <div className="text-center">
                                <p className="font-bold text-gray-800 text-base">{detailData.nama}</p>
                                <p className="text-xs text-gray-500 mt-0.5">RT {detailData.rt} / RW {detailData.rw}</p>
                                <p className="text-xs font-mono text-gray-400 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 break-all">
                                    {detailData.kode_unik}
                                </p>
                            </div>
                            <div className="w-full grid grid-cols-3 gap-2 text-center">
                                {[
                                    { label: 'Jiwa',   val: detailData.jiwa },
                                    { label: 'Sapi',   val: ` ${detailData.jatah_sapi ?? 0}` },
                                    { label: 'Kambing',val: ` ${detailData.jatah_kambing ?? 0}` },
                                ].map(s => (
                                    <div key={s.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                        <div className="text-xs text-gray-400">{s.label}</div>
                                        <div className="font-bold text-gray-700 text-sm">{s.val}</div>
                                    </div>
                                ))}
                            </div>
                            <div className={`w-full text-center py-2 rounded-lg text-xs font-semibold border ${STATUS_CONFIG[detailData.status]?.bg} ${STATUS_CONFIG[detailData.status]?.text} ${STATUS_CONFIG[detailData.status]?.border}`}>
                                {STATUS_CONFIG[detailData.status]?.label}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Save Jatah */}
            {isConfirmSaveOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">Simpan Konfigurasi?</p>
                                <p className="text-xs text-gray-500">Konfigurasi jatah qurban per jiwa akan disimpan.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsConfirmSaveOpen(false)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition">Batal</button>
                            <button onClick={handleSaveJatahConfig}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition">Ya, Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Apply Jatah */}
            {isConfirmApplyOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">Terapkan Jatah?</p>
                                <p className="text-xs text-gray-500">Jatah sapi & kambing akan diaplikasikan ke SEMUA data penerima yang tersimpan saat ini secara otomatis.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsConfirmApplyOpen(false)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition">Batal</button>
                            <button onClick={handleApplyJatah}
                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition">Ya, Terapkan</button>
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
                                <p className="font-semibold text-gray-800 text-sm">Hapus Data Penerima?</p>
                                <p className="text-xs text-gray-500">Tindakan ini tidak bisa dibatalkan.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmId(null)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition">Batal</button>
                            <button onClick={doDelete}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </QurbanLayout>
    );
}