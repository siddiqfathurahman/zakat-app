import React, { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import { Heart, Calendar, Share2, ArrowLeft, User, CheckCheck } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";

const BeritaDetail = ({ news }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(news?.like ?? 0);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (liked) return;
    router.post(route("berita.like", news.slug), {}, {
      onSuccess: () => {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      },
      preserveScroll: true,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: news.title, text: news.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (!news) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <p className="text-lg font-semibold text-gray-500">Berita tidak ditemukan.</p>
          <Link href={route("berita.index")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
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

          {/* ── Meta atas: kategori + tanggal ── */}
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

          {/* ── Judul ── */}
          <h1 className="mb-4 text-2xl font-extrabold leading-snug text-gray-900 md:text-3xl">
            {news.title}
          </h1>

          {/* ── Thumbnail ── */}
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
                <p className="text-sm font-semibold text-gray-800">{news.author}</p>
                <p className="text-[11px] text-gray-400">Penulis</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={liked}
                title={liked ? "Sudah disukai" : "Suka"}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  liked
                    ? "bg-red-50 text-red-500 cursor-default"
                    : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
                {likeCount}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                title="Bagikan"
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-500 transition hover:bg-emerald-50 hover:text-primary"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4 text-primary" />
                    <span className="text-primary text-xs">Disalin</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Bagikan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Konten Artikel ── */}
          <div
            className="article-body text-base"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* ── Kembali ── */}
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