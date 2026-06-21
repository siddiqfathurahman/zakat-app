import React, { useMemo, useState } from "react";
import AppLayout from "../Layout/AppLayout";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, User } from "lucide-react";


const placeholderImage = "/dakwah.webp";

const categories = ["Semua", "Kegiatan", "Dakwah", "Sosial", "Pengumuman"];

const featuredNews = [
  {
    tag: "KAJIAN UTAMA",
    title: "Persiapan Menyambut Bulan Suci Ramadhan di Masjid Al Anhar",
    excerpt:
      "Mari persiapkan diri dengan program-program edukatif dan sosial yang telah kami susun untuk mempererat tali silaturahmi seluruh jamaah...",
    image: placeholderImage,
  },
  {
    tag: "AGENDA",
    title: "Renovasi Tempat Wudhu Selesai, Kini Lebih Nyaman & Bersih",
    excerpt:
      "Setelah dua bulan pengerjaan, area tempat wudhu Masjid Al Anhar kini hadir dengan fasilitas yang lebih luas dan ramah jamaah lansia...",
    image: placeholderImage,
  },
  {
    tag: "PENGUMUMAN",
    title: "Jadwal Imam & Khatib Sholat Jumat Bulan Ini Telah Terbit",
    excerpt:
      "Simak jadwal lengkap imam dan khatib sholat Jumat untuk bulan ini yang telah disusun oleh takmir Masjid Al Anhar...",
    image: placeholderImage,
  },
];

const newsList = [
  {
    category: "Kegiatan",
    date: "12 Mar 2024",
    title: "Pelatihan Manajemen Zakat Modern untuk Amil",
    excerpt:
      "Masjid Al Anhar mengadakan pelatihan intensif bagi pengelola zakat untuk meningkatkan transparansi dan...",
    author: "Admin Al Anhar",
    image: placeholderImage,
  },
  {
    category: "Sosial",
    date: "10 Mar 2024",
    title: "Program 'Nasi Jumat' Berbagi Berkah Kembali Hadir",
    excerpt:
      "Program rutin pembagian paket makanan setiap hari Jumat setelah sholat jamaah kini menjangkau lebih banyak penerima...",
    author: "Humas Masjid",
    image: placeholderImage,
  },
  {
    category: "Dakwah",
    date: "08 Mar 2024",
    title: "Kajian Tematik: Membangun Keluarga Sakinah di Era Digital",
    excerpt:
      "Mengundang seluruh keluarga muslim untuk hadir dalam bedah buku dan diskusi interaktif mengenai tantangan parenting di...",
    author: "Ust. Ahmad",
    image: placeholderImage,
  },
  {
    category: "Pengumuman",
    date: "05 Mar 2024",
    title: "Peluncuran Portal 'Qur'an Online' Masjid Al Anhar",
    excerpt:
      "Kini jamaah dapat mengakses murottal serta terjemahan Al-Qur'an secara gratis melalui website resmi kami dengan fitur...",
    author: "IT Team",
    image: placeholderImage,
  },
  {
    category: "Kegiatan",
    date: "02 Mar 2024",
    title: "Inovasi Energi Terbarukan: Masjid Al Anhar Go Green",
    excerpt:
      "Implementasi panel surya untuk kebutuhan listrik masjid sebagai langkah nyata dalam menjaga kelestarian lingkungan dan...",
    author: "DKM Masjid",
    image: placeholderImage,
  },
  {
    category: "Sosial",
    date: "28 Feb 2024",
    title: "Pendaftaran TK & TPA Al Anhar Tahun Ajaran Baru",
    excerpt:
      "Telah dibuka pendaftaran untuk tingkat dasar pendidikan Islam dengan kurikulum yang menyenangkan bagi berbasis...",
    author: "Admin Pendidikan",
    image: placeholderImage,
  },
];

const categoryStyles = {
  Kegiatan: "text-second",
  Sosial: "text-second",
  Dakwah: "text-second",
  Pengumuman: "text-second",
};

const Berita = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const matchCategory =
        activeCategory === "Semua" || item.category === activeCategory;
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  const featured = featuredNews[featuredIndex];

  const goPrev = () =>
    setFeaturedIndex((prev) => (prev === 0 ? featuredNews.length - 1 : prev - 1));
  const goNext = () =>
    setFeaturedIndex((prev) => (prev === featuredNews.length - 1 ? 0 : prev + 1));

  return (
    <AppLayout>
      <div className="w-full bg-gray-50">
        <section className="content px-4 py-10 md:px-6">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold font-second text-primary">
              Berita Terbaru
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-50"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goNext}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-50"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Banner Unggulan */}
          <div className="relative isolate mb-8 h-80 overflow-hidden rounded-3xl md:h-96">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            <div className="flex h-full flex-col justify-end p-6 md:p-10">
              <span className="mb-1 px-3 py-1 rounded-full inline-block w-fit text-xs font-bold tracking-wide text-primary bg-secondary">
                {featured.tag}
              </span>
              <h2 className="max-w-xl text-2xl font-extrabold leading-snug text-white md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm text-gray-200">
                {featured.excerpt}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-secondary underline-offset-4 hover:underline"
              >
                Baca Selengkapnya
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berita..."
                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-indigo-50/70 text-gray-500 hover:bg-indigo-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Berita */}
          {filteredNews.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">
              Tidak ada berita yang cocok dengan pencarianmu.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-200/70"
                >
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      <span className={categoryStyles[item.category]}>
                        {item.category.toUpperCase()}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">{item.date}</span>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                      {item.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                          <User className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.author}
                        </span>
                      </div>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Baca
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Berita;
