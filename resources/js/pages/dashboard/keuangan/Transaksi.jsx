import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layout/DashboardLayout";
import CatatTransaksiModal from "@/components/keuangan/CatatTransaksiModal";
import ConfirmDialog from "@/components/keuangan/ConfirmDialog";
import {
    Plus,
    Search,
    Paperclip,
    Trash2,
    Pencil,
    TrendingUp,
    TrendingDown,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const formatTanggal = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

function buildPageWindow(current, last) {
    const siblings = 1;
    const totalDitampilkan = siblings * 2 + 5;

    if (last <= totalDitampilkan) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const left = Math.max(current - siblings, 2);
    const right = Math.min(current + siblings, last - 1);
    const pages = [1];

    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < last - 1) pages.push("...");

    pages.push(last);
    return pages;
}

export default function Transaksi() {
    const { transaksis, kasList, kategoriList, filters, flash } = usePage().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        search: filters?.search || "",
        kas_id: filters?.kas_id || "",
        kategori_id: filters?.kategori_id || "",
        jenis: filters?.jenis || "",
        status: filters?.status || "",
        tanggal_dari: filters?.tanggal_dari || "",
        tanggal_sampai: filters?.tanggal_sampai || "",
    });

    const applyFilters = (next) => {
        const merged = { ...localFilters, ...next };
        setLocalFilters(merged);
        router.get(route("admin.keuangan.transaksi.index"), merged, {
            preserveState: true,
            replace: true,
        });
    };

    const gotoPage = (page) => {
        router.get(
            route("admin.keuangan.transaksi.index"),
            { ...localFilters, page },
            { preserveState: true }
        );
    };

    const openTambah = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const openEdit = (trx) => {
        setOpenActionId(null);
        setEditData(trx);
        setModalOpen(true);
    };

    const handleDelete = () => {
        setDeleting(true);
        router.post(
            route("admin.keuangan.transaksi.destroy", confirmDelete.id),
            {},
            {
                onFinish: () => {
                    setDeleting(false);
                    setConfirmDelete(null);
                },
            }
        );
    };

    const handleKategoriBaru = (nama, tipe, callback) => {
        router.post(
            route("admin.keuangan.kategori.quick"),
            { nama, tipe },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const baru = page.props.flash?.kategoriBaru;
                    if (baru) callback(baru.id);
                },
            }
        );
    };

    const pageWindow = buildPageWindow(transaksis.current_page, transaksis.last_page);

    return (
        <>
            <Head title="Transaksi" />
            <div className="hidden items-center justify-between border border-gray-200 bg-white p-3 sm:flex md:p-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 md:text-xl">History Transaksi</h1>
                    <p className="mt-0.5 text-xs text-gray-400">Kelola seluruh transaksi masjid.</p>
                </div>
            </div>

            <div className="mx-4 my-5 space-y-5 md:mx-10">
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        className="rounded-xl bg-white px-4 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 sm:px-5 sm:text-base"
                        href="/admin/keuangan"
                    >
                        Keuangan
                    </a>
                    <a
                        className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-white sm:px-5 sm:text-base"
                        href="/admin/keuangan/transaksi"
                    >
                        History Transaksi
                    </a>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={openTambah}
                        className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
                    >
                        <Plus size={16} /> Catat Transaksi
                    </button>
                </div>

                {flash?.success && (
                    <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                {/* Filter bar */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                        <div className="relative lg:col-span-2">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nomor / keterangan..."
                                value={localFilters.search}
                                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && applyFilters({})}
                                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-emerald-400 focus:outline-none"
                            />
                        </div>

                        <select
                            value={localFilters.jenis}
                            onChange={(e) => applyFilters({ jenis: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="">Semua Jenis</option>
                            <option value="income">Pemasukan</option>
                            <option value="expense">Pengeluaran</option>
                        </select>

                        <select
                            value={localFilters.kas_id}
                            onChange={(e) => applyFilters({ kas_id: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="">Semua Kas</option>
                            {kasList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>

                        <select
                            value={localFilters.kategori_id}
                            onChange={(e) => applyFilters({ kategori_id: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoriList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>

                        <select
                            value={localFilters.status}
                            onChange={(e) => applyFilters({ status: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <input
                            type="date"
                            value={localFilters.tanggal_dari}
                            onChange={(e) => applyFilters({ tanggal_dari: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        />
                        <input
                            type="date"
                            value={localFilters.tanggal_sampai}
                            onChange={(e) => applyFilters({ tanggal_sampai: e.target.value })}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                        />
                    </div>
                </div>

                {/* List transaksi */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {transaksis.data.length === 0 && (
                        <div className="p-10 text-center text-sm text-slate-400">
                            Belum ada transaksi. Klik "Catat Transaksi" untuk mulai mencatat.
                        </div>
                    )}

                    <div className="divide-y divide-slate-100">
                        {transaksis.data.map((trx) => {
                            const isIncome = trx.jenis === "income";
                            return (
                                <div key={trx.id} className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 sm:px-5">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                            isIncome ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        {isIncome ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-800">
                                                    {trx.kategori?.nama || "Tanpa kategori"}
                                                </p>
                                                <p className="truncate text-xs text-slate-400">
                                                    {trx.kas?.nama} · {formatTanggal(trx.tanggal)}
                                                    {trx.keterangan && (
                                                        <span className="hidden sm:inline"> · {trx.keterangan}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <p
                                                className={`shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums ${
                                                    isIncome ? "text-emerald-700" : "text-rose-600"
                                                }`}
                                            >
                                                {isIncome ? "+" : "-"}
                                                {formatRupiah(trx.jumlah)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Aksi - desktop: ikon terpisah */}
                                    <div className="hidden shrink-0 items-center gap-1 sm:flex">
                                        {trx.lampiran && (
                                            <a
                                                href={`/storage/${trx.lampiran}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                title="Lihat bukti"
                                            >
                                                <Paperclip size={16} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => openEdit(trx)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(trx)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Aksi - mobile: menu titik 3 */}
                                    <div className="relative shrink-0 sm:hidden">
                                        <button
                                            onClick={() => setOpenActionId(openActionId === trx.id ? null : trx.id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {openActionId === trx.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setOpenActionId(null)}
                                                />
                                                <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                                                    {trx.lampiran && (
                                                        <a
                                                            href={`/storage/${trx.lampiran}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={() => setOpenActionId(null)}
                                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                                                        >
                                                            <Paperclip size={14} /> Lihat Bukti
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => openEdit(trx)}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
                                                    >
                                                        <Pencil size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenActionId(null);
                                                            setConfirmDelete(trx);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 size={14} /> Hapus
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination */}
                {transaksis.total > 0 && (
                    <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-center sm:text-left">
                            Menampilkan {transaksis.from}-{transaksis.to} dari {transaksis.total} transaksi
                        </span>

                        {/* Mobile: prev / hal X dari Y / next */}
                        <div className="flex items-center justify-between gap-2 sm:hidden">
                            <button
                                disabled={transaksis.current_page <= 1}
                                onClick={() => gotoPage(transaksis.current_page - 1)}
                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 disabled:opacity-40"
                            >
                                <ChevronLeft size={16} /> Sebelumnya
                            </button>
                            <span className="font-medium text-slate-700">
                                {transaksis.current_page} / {transaksis.last_page}
                            </span>
                            <button
                                disabled={transaksis.current_page >= transaksis.last_page}
                                onClick={() => gotoPage(transaksis.current_page + 1)}
                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 disabled:opacity-40"
                            >
                                Berikutnya <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Desktop: nomor halaman dengan jendela */}
                        <div className="hidden gap-1 sm:flex">
                            <button
                                disabled={transaksis.current_page <= 1}
                                onClick={() => gotoPage(transaksis.current_page - 1)}
                                className="rounded-lg px-2 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {pageWindow.map((p, i) =>
                                p === "..." ? (
                                    <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-slate-400">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => gotoPage(p)}
                                        className={`rounded-lg px-3 py-1.5 ${
                                            p === transaksis.current_page
                                                ? "bg-emerald-700 text-white"
                                                : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                            <button
                                disabled={transaksis.current_page >= transaksis.last_page}
                                onClick={() => gotoPage(transaksis.current_page + 1)}
                                className="rounded-lg px-2 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <CatatTransaksiModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                kasList={kasList}
                kategoriList={kategoriList}
                editData={editData}
                onKategoriBaru={handleKategoriBaru}
            />

            <ConfirmDialog
                open={!!confirmDelete}
                title="Hapus transaksi ini?"
                description={
                    confirmDelete
                        ? `${confirmDelete.nomor_transaksi} senilai ${formatRupiah(confirmDelete.jumlah)} akan dihapus dan saldo kas disesuaikan kembali.`
                        : ""
                }
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
                loading={deleting}
            />
        </>
    );
}

Transaksi.layout = (page) => <DashboardLayout children={page} title="Transaksi" />;