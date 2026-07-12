import React, { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  Calendar,
  ArrowUpRight,
  User,
  MessageCircle,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";

const CATEGORIES = ["Semua", "Kegiatan", "Dakwah", "Sosial", "Pengumuman"];

const STATIC_CATS = ["Kegiatan", "Sosial", "Dakwah", "Pengumuman"];
const getCat = (index) => STATIC_CATS[index % STATIC_CATS.length];

const Berita = ({ news = [], pagination, filters = {} }) => {
  const [search, setSearch] = useState(filters.search || "");
  const [activeCategory, setActiveCategory] = useState(filters.category || "Semua");
  const [likedNews, setLikedNews] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("berita.index"), { search, category: activeCategory === "Semua" ? "" : activeCategory });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    router.get(route("berita.index"), {
      search,
      category: cat === "Semua" ? "" : cat,
    });
  };


  const handleLike = (slug) => {
    router.post(
      route("berita.like", slug),
      {},
      {
        onSuccess: () => {
          setLikedNews((prev) => {
            const next = new Set(prev);
            next.has(slug) ? next.delete(slug) : next.add(slug);
            return next;
          });
        },
      }
    );
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const truncate = (text, n) =>
    text && text.length > n ? text.substring(0, n) + "..." : text;

  const hero = news[0] ?? null;
  const gridNews = news.slice(1);

  return (
    <AppLayout>
      <div className="w-full">
        <section className="content px-4 py-8 md:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="md:text-4xl text-xl font-second  font-extrabold text-primary">Berita Terbaru</h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => router.get(route("berita.index"), { page: Math.max(1, (pagination?.current_page ?? 1) - 1), search })}
                disabled={!pagination || pagination.current_page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.get(route("berita.index"), { page: Math.min(pagination?.last_page ?? 1, (pagination?.current_page ?? 1) + 1), search })}
                disabled={!pagination || pagination.current_page === pagination.last_page}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {hero && (
            <div className="relative isolate mb-7 h-72 overflow-hidden md:rounded-3xl rounded-lg md:h-96">
              {hero.thumbnail ? (
                <img
                  src={`/storage/${hero.thumbnail}`}
                  alt={hero.title}
                  className="absolute inset-0 -z-20 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 -z-20 bg-gray-200" />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              <div className="flex h-full flex-col justify-end p-6 md:p-10">
                <span className="mb-2 inline-block w-fit rounded-full bg-secondary px-3 py-1 md:text-[10px] text-[8px] font-bold tracking-widest text-primary backdrop-blur-sm">
                  BERITA TERBARU
                </span>
                <h2 className="max-w-xl text-sm font-extrabold leading-snug text-white md:text-3xl">
                  {hero.title}
                </h2>
                <p className="mt-2 max-w-lg md:text-sm text-xs text-white/80 line-clamp-2">
                  {hero.excerpt}
                </p>
                <Link
                  href={route("berita.show", hero.slug)}
                  className="mt-4 inline-flex w-fit items-center gap-1.5 md:text-sm text-xs font-semibold text-white underline-offset-4 hover:underline"
                >
                  Baca Selengkapnya
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berita..."
                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {gridNews.length === 0 ? (
            <div className="rounded-2xl bg-white py-16 text-center text-sm text-gray-400 shadow-sm">
              Tidak ada berita yang cocok.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridNews.map((item, idx) => {
                const cat = getCat(item.id ?? idx);
                const liked = likedNews.has(item.slug);
                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-200/70 flex flex-col"
                  >      
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      {item.thumbnail ? (
                        <img
                          src={`/storage/${item.thumbnail}`}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                          <span className="text-3xl font-bold text-primary/20">
                            A
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-2 flex items-center justify-between gap-2 text-[11px] font-bold">
                        <span className="text-primary uppercase">{item.category}</span>
                        <span className="text-gray-400 font-normal">
                          {formatDate(item.created_at)}
                        </span>
                      </div>

                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 flex-1">
                        {item.excerpt}
                      </p>
                          <Link
                            href={route("berita.show", item.slug)}
                            className="flex items-center gap-0.5 text-sm mt-2 font-semibold text-primary hover:underline"
                          >
                            Baca Selengkapnya
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                              <User className="h-3 w-3" />
                          </span>
                          <span className="text-[11px] text-gray-500">{item.author}</span>
                      </div>

                      <div className="flex items-center gap-3">
                          <button
                              onClick={() => handleLike(item.slug)}
                              className={`flex items-center gap-1 text-xs transition ${
                                  liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                              }`}
                          >
                              <Heart
                                  className="h-3.5 w-3.5"
                                  fill={liked ? "currentColor" : "none"}
                              />
                              {item.like ?? 0}
                          </button>

                          <Link
                              href={route("berita.show", item.slug) + "#komentar"}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition"
                          >
                              <MessageCircle className="h-3.5 w-3.5" />
                              {item.comments_count ?? 0}
                          </Link>
                      </div>
                  </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={pagination.current_page === 1}
                onClick={() =>
                  router.get(route("berita.index"), {
                    page: pagination.current_page - 1,
                    search,
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from(
                { length: Math.min(5, pagination.last_page) },
                (_, i) => Math.max(1, pagination.current_page - 2) + i
              )
                .filter((p) => p <= pagination.last_page)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      router.get(route("berita.index"), { page, search })
                    }
                    className={`h-9 min-w-[36px] rounded-xl px-3 text-sm font-semibold transition ${
                      page === pagination.current_page
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              {pagination.last_page > 5 &&
                pagination.current_page < pagination.last_page - 2 && (
                  <>
                    <span className="text-gray-400">…</span>
                    <button
                      onClick={() =>
                        router.get(route("berita.index"), {
                          page: pagination.last_page,
                          search,
                        })
                      }
                      className="h-9 min-w-[36px] rounded-xl border border-gray-200 px-3 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      {pagination.last_page}
                    </button>
                  </>
                )}

              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() =>
                  router.get(route("berita.index"), {
                    page: pagination.current_page + 1,
                    search,
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </section>
      </div>
    </AppLayout>
  );
};

export default Berita;