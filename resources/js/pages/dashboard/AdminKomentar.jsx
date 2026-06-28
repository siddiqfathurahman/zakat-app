import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { Trash2, ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, X, AlertTriangle } from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

// Modal hapus
const DeleteModal = ({ comment, onConfirm, onCancel, loading }) => {
    if (!comment) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
                <button onClick={onCancel} className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
                    <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
                        <AlertTriangle className="h-7 w-7 text-red-500" />
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Hapus Komentar?</h3>
                    <p className="text-sm text-gray-500 mb-1">Komentar dari <span className="font-semibold">{comment.name}</span>:</p>
                    <p className="text-sm text-gray-700 mb-6 line-clamp-2 italic">"{comment.body}"</p>
                    <div className="flex w-full gap-3">
                        <button onClick={onCancel} disabled={loading} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={loading} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50">
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminKomentar = ({ news, comments = [], pagination, filters = {} }) => {
    const [sentiment, setSentiment] = useState(filters.sentiment || "");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSentimentFilter = (val) => {
        setSentiment(val);
        router.get(route("admin.comments", news.slug), { sentiment: val });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        router.delete(route("admin.comments.destroy", deleteTarget.id), {
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteTarget(null);
            },
        });
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    const positiveCount = comments.filter((c) => c.sentiment === "positive").length;
    const negativeCount = comments.filter((c) => c.sentiment === "negative").length;

    return (
        <DashboardLayout>
            <DeleteModal
                comment={deleteTarget}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />

            <div className="w-full">
                <div className="flex items-center gap-4 bg-white border border-gray-200 p-4">
                    <Link
                        href={route("news.index")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Komentar Berita</h1>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{news.title}</p>
                    </div>
                </div>

                <div className="space-y-5 px-4 py-8 md:px-6">
                    {/* Statistik */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-extrabold text-gray-900">{comments.length}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Total Komentar</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-extrabold text-emerald-600">{positiveCount}</p>
                            <p className="text-xs text-emerald-500 mt-0.5">Positif</p>
                        </div>
                        <div className="rounded-2xl bg-red-50 border border-red-100 shadow-sm p-4 text-center">
                            <p className="text-2xl font-extrabold text-red-500">{negativeCount}</p>
                            <p className="text-xs text-red-400 mt-0.5">Negatif</p>
                        </div>
                    </div>

                    {/* Filter sentiment */}
                    <div className="flex gap-2">
                        {[
                            { value: "", label: "Semua" },
                            { value: "positive", label: "Positif" },
                            { value: "negative", label: "Negatif" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleSentimentFilter(opt.value)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    sentiment === opt.value
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* List komentar */}
                    {comments.length === 0 ? (
                        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
                            <MessageCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-400">Belum ada komentar.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className={`rounded-2xl bg-white border shadow-sm p-5 flex items-start gap-4 ${
                                        comment.sentiment === "negative"
                                            ? "border-red-100 bg-red-50/30"
                                            : "border-gray-100"
                                    }`}
                                >
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                                        comment.sentiment === "positive"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-red-50 text-red-500"
                                    }`}>
                                        {comment.name.charAt(0).toUpperCase()}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 gap-2">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-800">{comment.name}</p>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                    comment.sentiment === "positive"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-600"
                                                }`}>
                                                    {comment.sentiment === "positive" ? "Positif" : "Negatif"}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 shrink-0">
                                                {formatDate(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
                                    </div>

                                    <button
                                        onClick={() => setDeleteTarget(comment)}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminKomentar;