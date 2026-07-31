import React, { useState } from "react";
import DashboardLayout from "../../Layout/DashboardLayout";
import { useForm, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ArrowLeft, Upload, X, Save, Sparkles, Loader2 } from "lucide-react";
import TiptapEditor from "../../components/TiptapEditor";
import axios from "axios";

const CATEGORIES = ["Kegiatan", "Dakwah", "Sosial", "Pengumuman"];

const AdminBeritaForm = ({ news = null }) => {
    const isEdit = !!news;
    const [thumbnailPreview, setThumbnailPreview] = useState(
        news?.thumbnail ? `/storage/${news.thumbnail}` : null
    );

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        title:    news?.title    ?? "",
        category: news?.category ?? "",
        excerpt:  news?.excerpt  ?? "",
        content:  news?.content  ?? "",
        status:   news?.status   ?? "draft",
        thumbnail: null,
    });

    const handleGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setAiLoading(true);
        setAiError("");
        try {
            const res = await axios.post(route("ai.generate-news"), {
                prompt: aiPrompt,
            });
            const { title, excerpt, content } = res.data;
            setData((prev) => ({ ...prev, title, excerpt, content }));
        } catch (err) {
            setAiError(
                err.response?.data?.error ?? "Gagal generate, coba lagi."
            );
        } finally {
            setAiLoading(false);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData("thumbnail", file);
        const reader = new FileReader();
        reader.onload = (ev) => setThumbnailPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const removeThumbnail = () => {
        setData("thumbnail", null);
        setThumbnailPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("news.update", { news: news.slug }), { forceFormData: true });
        } else {
            post(route("news.store"), { forceFormData: true });
        }
    };

    return (
        <DashboardLayout>
            <div className="p-4">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href={route("news.index")}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="md:text-2xl text-xl font-bold text-gray-900">
                            {isEdit ? "Edit Berita" : "Tambah Berita"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {isEdit ? `Mengedit: ${news.title}` : "Buat artikel berita baru"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-5">
                            {/* Judul */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Berita <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Masukkan judul berita yang menarik..."
                                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                                        errors.title ? "border-red-400 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠ {errors.title}</p>
                                )}
                            </div>

                            {/* Ringkasan */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ringkasan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) => setData("excerpt", e.target.value)}
                                    rows={3}
                                    placeholder="Tulis ringkasan singkat..."
                                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                                        errors.excerpt ? "border-red-400 bg-red-50" : "border-gray-300"
                                    }`}
                                    maxLength={500}
                                />
                                <div className="flex items-center justify-between mt-1.5">
                                    {errors.excerpt ? (
                                        <p className="text-red-500 text-xs">⚠ {errors.excerpt}</p>
                                    ) : <span />}
                                    <span className="text-xs text-gray-400">{data.excerpt.length}/500</span>
                                </div>
                            </div>

                            {/* Konten */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Konten Berita <span className="text-red-500">*</span>
                                </label>
                                <TiptapEditor
                                    value={data.content}
                                    onChange={(html) => setData("content", html)}
                                    placeholder="Tulis isi berita lengkap di sini..."
                                />
                                {errors.content && (
                                    <p className="text-red-500 text-xs mt-1.5">⚠ {errors.content}</p>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-72 space-y-5">
                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-white">
                                        <Sparkles className="h-4 w-4" />
                                    </span>
                                    <h3 className="text-sm font-bold text-violet-800">
                                        Generate dengan AI
                                    </h3>
                                </div>

                                <p className="text-xs text-violet-600 mb-3 leading-relaxed">
                                    Deskripsikan topik berita, AI akan otomatis mengisi judul, ringkasan, dan konten.
                                </p>

                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={4}
                                    placeholder="Contoh: Pelaksanaan sholat Idul Adha 1446 H di Masjid Al Anhar yang dihadiri ratusan jamaah..."
                                    className="w-full px-3 py-2.5 border border-violet-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                                />

                                {aiError && (
                                    <p className="text-red-500 text-xs mt-2">⚠ {aiError}</p>
                                )}

                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={aiLoading || !aiPrompt.trim()}
                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Generate Berita
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Thumbnail */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thumbnail</h3>
                                {thumbnailPreview ? (
                                    <div className="relative">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Preview"
                                            className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                                        <Upload size={24} className="text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500 text-center">Klik untuk upload gambar</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (maks. 2MB)</span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.thumbnail && (
                                    <p className="text-red-500 text-xs mt-2">{errors.thumbnail}</p>
                                )}
                            </div>

                            {/* Publikasi */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Publikasi</h3>

                                {/* Penulis readonly */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Penulis</label>
                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50">
                                        {isEdit ? news?.author : "Otomatis dari akun Anda"}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Diisi otomatis saat menyimpan</p>
                                </div>

                                {/* Kategori */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.category ? "border-red-400 bg-red-50" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">📝 Draft</option>
                                        <option value="published">🟢 Published</option>
                                    </select>
                                </div>

                                <div className={`text-xs px-3 py-2 rounded-lg mb-5 ${
                                    data.status === "published"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                }`}>
                                    {data.status === "published"
                                        ? "✓ Berita akan langsung tampil ke publik"
                                        : "○ Berita tidak ditampilkan ke publik"}
                                </div>

                                <div className="space-y-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:brightness-110 transition font-medium text-sm disabled:opacity-60"
                                    >
                                        <Save size={16} />
                                        {processing
                                            ? (isEdit ? "Menyimpan..." : "Mempublikasikan...")
                                            : (isEdit ? "Simpan Perubahan" : "Simpan Berita")}
                                    </button>
                                    <Link
                                        href={route("news.index")}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </div>

                            {/* Info (edit mode) */}
                            {isEdit && (
                                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Info</h3>
                                    <div className="space-y-1.5 text-xs text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Slug</span>
                                            <span className="font-mono text-gray-700 truncate ml-2 max-w-[140px]">{news.slug}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Like</span>
                                            <span className="font-semibold text-gray-700">{news.like ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AdminBeritaForm;