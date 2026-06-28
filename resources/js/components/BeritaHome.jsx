import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

const AUTHOR = "Admin Alanhar";

const BeritaHome = ({ news = [] }) => {
    const hero = news[0] ?? null;
    const latestNews = news[1] ?? null; // Hanya 1 berita terbaru

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="w-full">
            {/* ── Hero Banner ── */}
            <div className="relative w-full h-[570px] md:h-[650px] overflow-hidden flex items-end">
                {hero?.thumbnail ? (
                    <img
                        src={`/storage/${hero.thumbnail}`}
                        alt={hero.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="dakwah.webp"
                        alt="Foto dakwah"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                <div className="relative z-10 md:p-10 p-5">
                    <span className="inline-block bg-secondary text-[#251A00] md:text-sm text-xs font-semibold px-3 py-1 rounded-full mb-2">
                        BERITA TERBARU
                    </span>
                    <h1 className="text-white text-2xl md:text-4xl font-bold leading-snug mb-2 max-w-[800px]">
                        {hero?.title}
                    </h1>
                    <p className="text-white/80 text-sm md:text-lg leading-relaxed md:mb-6 mb-2 max-w-[800px]">
                        {hero?.excerpt}
                    </p>
                    {hero ? (
                        <Link
                            href={route("berita.show", hero.slug)}
                            className="inline-flex items-center text-xs md:text-lg gap-2 bg-secondary text-[#251A00] font-medium md:px-5 md:py-2.5 px-3 py-1.5 rounded-full hover:bg-[#f0e68c] transition"
                        >
                            Baca Selengkapnya <ArrowRight />
                        </Link>
                    ) : (
                        <a
                            href="#"
                            className="inline-flex items-center text-xs md:text-lg gap-2 bg-secondary text-[#251A00] font-medium md:px-5 md:py-2.5 px-3 py-1.5 rounded-full hover:bg-[#f0e68c] transition"
                        >
                            Baca Selengkapnya <ArrowRight />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeritaHome;