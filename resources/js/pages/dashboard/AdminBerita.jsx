import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
    Search,
    Edit2,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    Newspaper,
    AlertTriangle,
    X,
    Heart,
    Eye,
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { MessageCircle } from "lucide-react";

const CATEGORIES = ["Kegiatan", "Dakwah", "Sosial", "Pengumuman"];

const DeleteModal = ({ news, onConfirm, onCancel, loading }) => {
    if (!news) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                        <AlertTriangle className="h-7 w-7 text-red-500" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Hapus Berita?
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                        Berita berikut akan dihapus permanen:
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mb-6 line-clamp-2">
                        "{news.title}"
                    </p>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50"
                        >
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => (
    <span
        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            status === "published"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
        }`}
    >
        {status === "published" ? "Published" : "Draft"}
    </span>
);

const AdminBerita = ({ news, pagination, filters = {}, stats = {} }) => {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [category, setCategory] = useState(filters.category || "");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("news.index"), { search, status, category });
    };

    const handleStatusFilter = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        router.get(route("news.index"), {
            search,
            status: newStatus,
            category,
        });
    };

    const handleCategoryFilter = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        router.get(route("news.index"), {
            search,
            status,
            category: newCategory,
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        router.post(route("news.destroy", { news: deleteTarget.slug }), {
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteTarget(null);
            },
        });
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const truncateText = (text, length) =>
        text?.length > length ? text.substring(0, length) + "..." : text;

    const getPageNumbers = () => {
        if (!pagination) return [];
        const { current_page, last_page } = pagination;
        const delta = 1;
        const pages = new Set();
        pages.add(1);
        pages.add(last_page);
        for (let p = current_page - delta; p <= current_page + delta; p++) {
            if (p > 1 && p < last_page) pages.add(p);
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    return (
        <DashboardLayout>
            <DeleteModal
                news={deleteTarget}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />

            <div className="w-full">
                <div className="flex items-center justify-between bg-white border border-gray-200 p-3 md:p-4 hidden sm:block">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900">
                            Manajemen Berita
                        </h1>
                        <p className=" text-xs text-gray-400 mt-0.5 ">
                            Kelola seluruh artikel dan pengumuman masjid.
                        </p>
                    </div>
                </div>

                {/* ── Kotak Statistik ── */}
                <div className="grid grid-cols-2 gap-3 px-4 mt-6 md:mx-10 md:mt-10 md:gap-4 md:px-0 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60">
                        <div className="flex items-center justify-between mb-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                                <Newspaper className="h-4 w-4 text-amber-500" />
                            </span>
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 rounded-full px-2 py-0.5">
                                Total
                            </span>
                        </div>
                        <p className="text-xl md:text-3xl font-extrabold text-gray-900 truncate">
                            {stats.totalNews ?? 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Jumlah Berita
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60">
                        <div className="flex items-center justify-between mb-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                                <Heart className="h-4 w-4 text-red-500" />
                            </span>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 rounded-full px-2 py-0.5">
                                Total
                            </span>
                        </div>
                        <p className="text-xl md:text-3xl font-extrabold text-gray-900 truncate">
                            {stats.totalLikes ?? 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Total Like
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60">
                        <div className="flex items-center justify-between mb-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                <MessageCircle className="h-4 w-4 text-blue-500" />
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 rounded-full px-2 py-0.5">
                                Total
                            </span>
                        </div>
                        <p className="text-xl md:text-3xl font-extrabold text-gray-900 truncate">
                            {stats.totalComments ?? 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Total Komentar
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60">
                        <div className="flex items-center justify-between mb-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                                <Eye className="h-4 w-4 text-emerald-500" />
                            </span>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 rounded-full px-2 py-0.5">
                                Total
                            </span>
                        </div>
                        <p className="text-xl md:text-3xl font-extrabold text-gray-900 truncate">
                            {stats.totalViews >= 1000
                                ? (stats.totalViews / 1000).toFixed(1) + "K"
                                : (stats.totalViews ?? 0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Total Pengunjung
                        </p>
                    </div>
                </div>

                <div className="space-y-5 px-4 py-6 md:py-8 md:px-6">
                    <div className="flex justify-end">
                        <Link
                            href={route("news.create")}
                            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Berita
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/60">
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari berita..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 text-sm text-gray-700 transition focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <select
                                        value={status}
                                        onChange={handleStatusFilter}
                                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition focus:border-primary sm:w-44 sm:flex-none"
                                    >
                                        <option value="">Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                    <select
                                        value={category}
                                        onChange={handleCategoryFilter}
                                        className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition focus:border-primary sm:w-44 sm:flex-none"
                                    >
                                        <option value="">
                                            Kategori
                                        </option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
                        {news && news.length > 0 ? (
                            <>
                                {/* Mobile: list card */}
                                <div className="divide-y divide-gray-50 md:hidden">
                                    {news.map((item) => (
                                        <div key={item.id} className="p-4">
                                            <div className="flex gap-3">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={`/storage/${item.thumbnail}`}
                                                        alt={item.title}
                                                        className="h-16 w-20 flex-shrink-0 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                        <Newspaper className="h-6 w-6 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 leading-snug">
                                                        {truncateText(
                                                            item.title,
                                                            50,
                                                        )}
                                                    </p>
                                                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                                        <StatusBadge
                                                            status={
                                                                item.status
                                                            }
                                                        />
                                                        {item.category && (
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                                                                {
                                                                    item.category
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                                <span>
                                                    {item.author ?? "—"}
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3.5 w-3.5" />
                                                        {item.like ?? 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        {item.views ?? 0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={route(
                                                            "news.edit",
                                                            {
                                                                news: item.slug,
                                                            },
                                                        )}
                                                        title="Edit"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-emerald-50 hover:text-primary"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.comments",
                                                            {
                                                                slug: item.slug,
                                                            },
                                                        )}
                                                        title="Komentar"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                item,
                                                            )
                                                        }
                                                        title="Hapus"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop: tabel */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {[
                                                    "THUMBNAIL",
                                                    "JUDUL & SLUG",
                                                    "STATUS",
                                                    "KATEGORI",
                                                    "PENULIS",
                                                    "LIKE",
                                                    "VIEWS",
                                                    "TANGGAL",
                                                    "AKSI",
                                                ].map((h) => (
                                                    <th
                                                        key={h}
                                                        className="px-5 py-3.5 text-left text-[11px] font-bold tracking-wide text-primary"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {news.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="group hover:bg-gray-50/60 transition"
                                                >
                                                    <td className="px-5 py-4">
                                                        {item.thumbnail ? (
                                                            <img
                                                                src={`/storage/${item.thumbnail}`}
                                                                alt={
                                                                    item.title
                                                                }
                                                                className="h-12 w-16 rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gray-100">
                                                                <Newspaper className="h-5 w-5 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 max-w-xs">
                                                        <p className="font-semibold text-gray-900 leading-snug">
                                                            {truncateText(
                                                                item.title,
                                                                45,
                                                            )}
                                                        </p>
                                                        <span className="mt-1 inline-block rounded-lg bg-gray-100 px-2 py-0.5 font-mono text-[10px] text-gray-400">
                                                            {item.slug}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <StatusBadge
                                                            status={
                                                                item.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {item.category ? (
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                                                                {
                                                                    item.category
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-gray-700">
                                                        {item.author ?? (
                                                            <span className="text-gray-300 text-xs">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-gray-700">
                                                        {item.like ?? 0}
                                                    </td>
                                                    <td className="px-5 py-4 font-semibold text-gray-700">
                                                        {item.views ?? 0}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                                                        {formatDate(
                                                            item.created_at,
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Link
                                                                href={route(
                                                                    "news.edit",
                                                                    {
                                                                        news: item.slug,
                                                                    },
                                                                )}
                                                                title="Edit"
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-emerald-50 hover:text-primary"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    "admin.comments",
                                                                    {
                                                                        slug: item.slug,
                                                                    },
                                                                )}
                                                                title="Komentar"
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                            >
                                                                <MessageCircle className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        item,
                                                                    )
                                                                }
                                                                title="Hapus"
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300 mb-4">
                                    <Newspaper className="h-7 w-7" />
                                </span>
                                <p className="font-semibold text-gray-500">
                                    Belum ada berita
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    Mulai tambahkan berita atau pengumuman baru.
                                </p>
                                <Link
                                    href={route("news.create")}
                                    className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buat Berita Pertama
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() =>
                                    router.get(route("news.index"), {
                                        page: pagination.current_page - 1,
                                        search,
                                        status,
                                        category,
                                    })
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            {getPageNumbers().map((page, idx, arr) => (
                                <React.Fragment key={page}>
                                    {idx > 0 && page - arr[idx - 1] > 1 && (
                                        <span className="px-1 text-sm text-gray-400">
                                            ...
                                        </span>
                                    )}
                                    <button
                                        onClick={() =>
                                            router.get(route("news.index"), {
                                                page,
                                                search,
                                                status,
                                                category,
                                            })
                                        }
                                        className={`h-9 min-w-[36px] rounded-xl px-3 text-sm font-semibold transition ${
                                            page === pagination.current_page
                                                ? "bg-primary text-white"
                                                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))}

                            <button
                                disabled={
                                    pagination.current_page ===
                                    pagination.last_page
                                }
                                onClick={() =>
                                    router.get(route("news.index"), {
                                        page: pagination.current_page + 1,
                                        search,
                                        status,
                                        category,
                                    })
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminBerita;