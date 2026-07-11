    import React, { useState, useMemo, useEffect } from 'react';
    import { router, usePage } from '@inertiajs/react';
    import QurbanLayout from '../../Layout/QurbanLayout';
    import CetakCocard from './CetakCocard';

    export default function PanitiaQurban({ panitiaqurbans = [], setting = {} }) {

    const JABATAN_OPTIONS = [
        'Penasehat',
        'Ketua',
        'Sekretaris',
        'Bendahara',
        'Koordinator Lapangan', 
        'Doa Penyembelihan',
        'Pencari Hewan Qurban',
        'Shohibul Qurban',
        'Penerima Hewan Kambing',
        'Jagal',
        'Perlengkapan',
        'Penimbangan Daging',
        'Balungan dan Kelet',
        'Pembagian Daging Sapi',
        'Pembagian Daging Kambing',
        'Konsumsi',
        'Sound Sistem',
        'Keamanan',
        'Brodot',
        'Kulit',
        'P3K',
        'Humas',
        'Pembantu Umum',
        'Dokumentasi',
    ];

        const { flash } = usePage().props;

        const [modalOpen, setModalOpen] = useState(false);
        const [editData, setEditData] = useState(null);
        const [confirmId, setConfirmId] = useState(null);
        const [formErr, setFormErr] = useState('');
        const [search, setSearch] = useState('');
        const [filterJabatan, setFilterJabatan] = useState('');
        const [filterStatus, setFilterStatus] = useState('');

        useEffect(() => {
            setPage(1);
        }, [search, filterJabatan, filterStatus]);

        const [form, setForm] = useState({
            nama: '',
            jabatan: '',
            rt: '',
            rw: '',
            sudah_diambil: '0',
        });

        const [page, setPage] = useState(1);
        const PER = 10;

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

        // ─── Stats ───
        const stats = useMemo(() => {
            const totalJobdesk = new Set(panitiaqurbans.map(r => r.jabatan)).size;
            const sudahAmbil = panitiaqurbans.filter(r => r.sudah_diambil == 1 || r.sudah_diambil === true).length;
            return {
                totalPanitia: panitiaqurbans.length,
                totalJobdesk,
                sudahAmbil,
                belumAmbil: panitiaqurbans.length - sudahAmbil,
            };
        }, [panitiaqurbans]);

        // ─── Pagination ───
        // ─── Filter ───
        const filtered = useMemo(() => {
            return panitiaqurbans.filter(r => {
                const matchSearch = !search ||
                    r.nama.toLowerCase().includes(search.toLowerCase());
                const matchJabatan = !filterJabatan || r.jabatan === filterJabatan;
                const matchStatus = filterStatus === ''
                    ? true
                    : filterStatus === '1'
                        ? (r.sudah_diambil == 1 || r.sudah_diambil === true)
                        : (r.sudah_diambil == 0 || r.sudah_diambil === false);
                return matchSearch && matchJabatan && matchStatus;
            });
        }, [panitiaqurbans, search, filterJabatan, filterStatus]);

        // ─── Pagination (ganti yang lama) ───
        const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
        const paginated = filtered.slice((page - 1) * PER, page * PER);
        const showPagination = filtered.length > PER;
        const start = filtered.length === 0 ? 0 : (page - 1) * PER + 1;
        const end = Math.min(page * PER, filtered.length);

        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // ─── Modal helpers ───
        const openAdd = () => {
            setEditData(null);
            setForm({ nama: '', jabatan: '', rt: '', rw: '', sudah_diambil: '0' });
            setFormErr('');
            setModalOpen(true);
        };

        const openEdit = (row) => {
            setEditData(row);
            setForm({
                nama: row.nama,
                jabatan: row.jabatan,
                rt: row.rt,
                rw: row.rw,
                sudah_diambil: String(row.sudah_diambil ? '1' : '0'),
            });
            setFormErr('');
            setModalOpen(true);
        };

        const closeModal = () => setModalOpen(false);

        // ─── Save ───
        const saveData = () => {
            const { nama, jabatan, rt, rw, sudah_diambil } = form;
            if (!nama || !jabatan || !rt || !rw) {
                setFormErr('Semua field wajib diisi');
                return;
            }
            if (editData) {
                router.post(`/qurban/input/panitia/${editData.id}/update`, form, {
                    onSuccess: () => closeModal(),
                    onError: (e) => setFormErr(Object.values(e).join(', ')),
                });
            } else {
                router.post('/qurban/input/panitia/store', form, {
                    onSuccess: () => closeModal(),
                    onError: (e) => setFormErr(Object.values(e).join(', ')),
                });
            }
        };

        // ─── Toggle status sudah_diambil ───
        const toggleStatus = (row) => {
            const newStatus = row.sudah_diambil == 1 || row.sudah_diambil === true ? '0' : '1';
            router.post(`/qurban/input/panitia/${row.id}/update`, {
                nama: row.nama,
                jabatan: row.jabatan,
                rt: row.rt,
                rw: row.rw,
                sudah_diambil: newStatus,
            });
        };

        // ─── Delete ───
        const doDelete = () => {
            router.post(`/qurban/input/panitia/${confirmId}/destroy`, {}, {
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
                    <h1 className="text-2xl font-bold text-gray-800">Data Panitia Qurban</h1>
                    
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-orange-700 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Panitia
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Panitia',
                            val: stats.totalPanitia,
                            sub: 'orang terdaftar',
                            color: 'bg-orange-50 border-orange-200',
                            valColor: 'text-orange-700',
                            icon: (
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Total Jobdesk',
                            val: stats.totalJobdesk,
                            sub: 'jabatan berbeda',
                            color: 'bg-blue-50 border-blue-200',
                            valColor: 'text-blue-700',
                            icon: (
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Sudah Ambil',
                            val: stats.sudahAmbil,
                            sub: 'daging qurban',
                            color: 'bg-green-50 border-green-200',
                            valColor: 'text-green-700',
                            icon: (
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                        {
                            label: 'Belum Ambil',
                            val: stats.belumAmbil,
                            sub: 'daging qurban',
                            color: 'bg-red-50 border-red-200',
                            valColor: 'text-red-600',
                            icon: (
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                    ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-4 border ${s.color} flex items-center gap-3`}>
                            <div className="flex-shrink-0">{s.icon}</div>
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
                                <div className={`text-2xl font-bold ${s.valColor}`}>{s.val}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="mb-2 justify-end items-end flex">
                    <CetakCocard panitiaqurbans={panitiaqurbans} setting={setting}  />
                </div>

                {/* Filter Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[180px]">
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Cari Nama</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari nama panitia..."
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Filter Jabatan</label>
                        <select
                            value={filterJabatan}
                            onChange={e => setFilterJabatan(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 min-w-[170px]"
                        >
                            <option value="">Semua Jabatan</option>
                            {JABATAN_OPTIONS.map(j => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 font-medium">Status Ambil</label>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 min-w-[150px]"
                        >
                            <option value="">Semua Status</option>
                            <option value="1">Sudah Ambil</option>
                            <option value="0">Belum Ambil</option>
                        </select>
                    </div>
                    {(search || filterJabatan || filterStatus) && (
                        <button
                            onClick={() => { setSearch(''); setFilterJabatan(''); setFilterStatus(''); }}
                            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reset
                        </button>
                    )}
                </div>
            </div>

                {/* Info row */}
            <div className="text-sm text-gray-500 mb-2">
                Menampilkan <span className="font-semibold text-gray-700">{start} - {end}</span> dari{' '}
                <span className="font-semibold text-gray-700">{filtered.length}</span> data
                {filtered.length !== panitiaqurbans.length && (
                    <span className="text-gray-400"> (dari total {panitiaqurbans.length} panitia)</span>
                )}
            </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-orange-700 text-white">
                                {['No', 'Nama', 'Jabatan', 'RT/RW', 'Status Ambil', 'Aksi'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Belum ada data panitia
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map((row, i) => {
                                const sudah = row.sudah_diambil == 1 || row.sudah_diambil === true;
                                return (
                                    <tr
                                        key={row.id}
                                        className={`border-b border-gray-100 hover:bg-orange-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                    >
                                        <td className="px-4 py-3 text-gray-400 text-xs w-12">{(page - 1) * PER + i + 1}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-800">{row.nama}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                                {row.jabatan}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{row.rt}/{row.rw}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleStatus(row)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                                    sudah
                                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                {sudah ? (
                                                    <>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Sudah Ambil
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Belum Ambil
                                                    </>
                                                )}
                                            </button>
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
                                );
                            })}
                        </tbody>
                    </table>
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
                                <button onClick={() => setPage(1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition">1</button>
                                {pageNumbers[0] > 2 && <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>}
                            </>
                        )}
                        {pageNumbers.map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold transition border ${
                                    p === page ? 'bg-orange-700 text-white border-orange-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300'
                                }`}>{p}</button>
                        ))}
                        {pageNumbers[pageNumbers.length - 1] < totalPages && (
                            <>
                                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">...</span>}
                                <button onClick={() => setPage(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 text-xs transition">{totalPages}</button>
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
                            <div className="bg-orange-700 rounded-t-2xl px-6 py-4 flex items-center justify-between">
                                <h2 className="text-base font-bold text-white">
                                    {editData ? 'Edit Data Panitia' : 'Tambah Data Panitia'}
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
                                    <input
                                        value={form.nama}
                                        onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                                        placeholder="Nama panitia"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                                        Jabatan / Jobdesk <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={form.jabatan}
                                        onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 bg-white"
                                    >
                                        <option value="">Pilih jabatan...</option>
                                        {JABATAN_OPTIONS.map(j => (
                                            <option key={j} value={j}>{j}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 mb-1 block">RT <span className="text-red-500">*</span></label>
                                        <select
                                            value={form.rt}
                                            onChange={e => {
                                                const selectedRt = e.target.value;
                                                const match = rtRwData.find(item => item.rt === selectedRt);
                                                setForm(f => ({
                                                    ...f,
                                                    rt: selectedRt,
                                                    rw: match ? match.rw : f.rw,
                                                }));
                                            }}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 bg-white"
                                        >
                                            <option value="">Pilih RT...</option>
                                            {rtRwData.map(item => (
                                                <option key={item.rt} value={item.rt}>{item.rt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 mb-1 block">RW <span className="text-red-500">*</span></label>
                                        <select
                                            value={form.rw}
                                            onChange={e => setForm(f => ({ ...f, rw: e.target.value }))}
                                            disabled={!!form.rt}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200 bg-white disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Pilih RW...</option>
                                            {rtRwData.map(item => (
                                                <option key={item.rw} value={item.rw}>{item.rw}</option>
                                            ))}
                                        </select>
                                        {form.rt && (
                                            <p className="text-xs text-gray-400 mt-1">Otomatis dari RT</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Status Ambil Daging</label>
                                    <div className="flex gap-3 mt-1">
                                        {[
                                            { val: '0', label: 'Belum Ambil', color: 'border-gray-300 text-gray-600' },
                                            { val: '1', label: 'Sudah Ambil', color: 'border-green-400 text-green-700' },
                                        ].map(opt => (
                                            <label
                                                key={opt.val}
                                                className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition ${
                                                    form.sudah_diambil === opt.val
                                                        ? opt.val === '1' ? 'bg-green-50 border-green-400' : 'bg-gray-100 border-gray-400'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="sudah_diambil"
                                                    value={opt.val}
                                                    checked={form.sudah_diambil === opt.val}
                                                    onChange={e => setForm(f => ({ ...f, sudah_diambil: e.target.value }))}
                                                    className="accent-orange-700"
                                                />
                                                <span className="text-xs font-medium">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {formErr && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                                        {formErr}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 px-6 pb-6">
                                <button onClick={closeModal}
                                    className="border border-gray-200 rounded-lg px-5 py-2 text-sm hover:bg-gray-50 transition text-gray-600">
                                    Batal
                                </button>
                                <button onClick={saveData}
                                    className="bg-orange-700 hover:bg-orange-700 text-white rounded-lg px-5 py-2 text-sm font-semibold transition shadow-sm">
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
                                    <p className="font-semibold text-gray-800 text-sm">Hapus Data Panitia?</p>
                                    <p className="text-xs text-gray-500">Tindakan ini tidak bisa dibatalkan.</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setConfirmId(null)}
                                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition">
                                    Batal
                                </button>
                                <button onClick={doDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </QurbanLayout>
        );
    }