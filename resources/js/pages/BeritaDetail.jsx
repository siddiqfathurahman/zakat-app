import React, { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import {
    Heart,
    Calendar,
    Share2,
    ArrowLeft,
    User,
    CheckCheck,
    MessageCircle,
    Send,
    ThumbsUp,
    Eye,
} from "lucide-react";
import { Link, router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";

const BeritaDetail = ({ news, comments = [] }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(news?.like ?? 0);
    const [copied, setCopied] = useState(false);
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        body: "",
    });

    const handleLike = () => {
        if (liked) return;
        router.post(
            route("berita.like", news.slug),
            {},
            {
                onSuccess: () => {
                    setLiked(true);
                    setLikeCount((prev) => prev + 1);
                },
                preserveScroll: true,
            },
        );
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: news.title,
                text: news.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleComment = (e) => {
        e.preventDefault();
        post(route("berita.comment.store", news.slug), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatCommentDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    if (!news) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                    <p className="text-lg font-semibold text-gray-500">
                        Berita tidak ditemukan.
                    </p>
                    <Link
                        href={route("berita.index")}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full">
                <section className="mx-auto max-w-4xl px-4 py-8 md:px-6">
                    <Link
                        href={route("berita.index")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Berita
                    </Link>

                    <div className="mb-3 flex items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-primary uppercase tracking-wide">
                            {news.category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 font-normal text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(news.created_at)}
                        </span>
                    </div>

                    <h1 className="mb-4 text-2xl font-extrabold leading-snug text-gray-900 md:text-3xl">
                        {news.title}
                    </h1>

                    {news.thumbnail && (
                        <div className="mb-7 overflow-hidden rounded-2xl">
                            <img
                                src={`/storage/${news.thumbnail}`}
                                alt={news.title}
                                className="w-full max-h-[420px] object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-primary">
                                <User className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {news.author}
                                </p>
                                <p className="text-[11px] text-gray-400">
                                    Penulis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              {news.views ?? 0}
                          </span>
                            <button
                                onClick={handleLike}
                                disabled={liked}
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                                    liked
                                        ? "bg-red-50 text-red-500 cursor-default"
                                        : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                                }`}
                            >
                                <Heart
                                    className="h-4 w-4"
                                    fill={liked ? "currentColor" : "none"}
                                />
                                {likeCount}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-500 transition hover:bg-emerald-50 hover:text-primary"
                            >
                                {copied ? (
                                    <>
                                        <CheckCheck className="h-4 w-4 text-primary" />
                                        <span className="text-primary text-xs">
                                            Disalin
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div
                        className="article-body text-base"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    <div id="komentar" className="mt-10 border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-2 mb-6">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-extrabold text-gray-900">
                                Komentar 
                            </h2>
                        </div>

                        {/* {flash?.success && (
                            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
                                ✓ {flash.success}
                            </div>
                        )} */}

                        <form
                            onSubmit={handleComment}
                            className="mb-8 rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
                        >
                            <h3 className="text-sm font-bold text-gray-700 mb-4">
                                Tulis Komentar
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Nama Anda"
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-primary ${
                                            errors.name
                                                ? "border-red-400 bg-red-50"
                                                : "border-gray-200"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        value={data.body}
                                        onChange={(e) =>
                                            setData("body", e.target.value)
                                        }
                                        placeholder="Tulis komentar Anda..."
                                        rows={4}
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-primary resize-none ${
                                            errors.body
                                                ? "border-red-400 bg-red-50"
                                                : "border-gray-200"
                                        }`}
                                    />

                                    {errors.body && (
                                        <div className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                                            <span className="text-red-500 text-sm mt-0.5">
                                                ⚠
                                            </span>
                                            <p className="text-xs text-red-600 leading-relaxed">
                                                {errors.body}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim Komentar"}
                                </button>
                            </div>
                        </form>

                        {comments.length === 0 ? (
                            <div className="rounded-2xl bg-gray-50 py-10 text-center">
                                <MessageCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-400">
                                    Belum ada komentar. Jadilah yang pertama!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary font-bold text-sm">
                                                {comment.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-bold text-gray-800">
                                                        {comment.name}
                                                    </p>
                                                    <span className="text-[11px] text-gray-400">
                                                        {formatCommentDate(
                                                            comment.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {comment.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <Link
                            href={route("berita.index")}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke daftar berita
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
};

export default BeritaDetail;
