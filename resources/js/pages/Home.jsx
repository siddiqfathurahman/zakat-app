import { Link } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import { ArrowRight, CheckCircle2, CircleDollarSign, X } from "lucide-react";
import JadwalSholat from "../components/JadwalSholat";
import { BookOpen, GraduationCap, HandHeart } from "lucide-react";
import { Wallet } from "lucide-react";
import BeritaHome from "../components/BeritaHome";
import { useState, useEffect } from "react";

const agendaItems = [
    {
        title: "Kajian Tafsir Al-Quran",
        description: "Pembahasan Fiqih & Akhlak bersama Ustadz Dwi.",
        schedule: "RABU • 19:00 - 20:30",
        icon: BookOpen,
    },
    {
        title: "TPA ",
        description: "Pendidikan Al-Qur'an dan karakter untuk anak-anak.",
        schedule: "RABU & SABTU • 15:30 - 17:00",
        icon: GraduationCap,
    },
    {
        title: "Jumat Berkah",
        description: "Pembagian makan siang gratis untuk jamaah dan dhuafa.",
        schedule: "JUMAT • 11:30 - 13:30",
        icon: HandHeart,
    },
];

const partnerLogos = [
    { name: "Takmir", logo: "/logo-takmir.webp" },
    { name: "Taman Pendidikan Al-Qur'an Al-Anhar", logo: "/logo-tpa.webp" },
    { name: "Ramah Mergangsan", logo: "/logo-ramah.webp" },
    { name: "Aisyiyah", logo: "/logo-aisyiyah.jpg" },
    { name: "PRM", logo: "/logo-prm.png" },
];

export default function Home({ news = [], banner = null }) {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!banner) return;

        const key = `banner_shown_${banner.id}`;
        const alreadyShown = sessionStorage.getItem(key);

        if (!alreadyShown) {
            const t = setTimeout(() => {
                setShowBanner(true);
                sessionStorage.setItem(key, "1"); 
            }, 800);
            return () => clearTimeout(t);
        }
    }, [banner]);

    useEffect(() => {
        if (showBanner) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [showBanner]);

    return (
        <AppLayout>

            {showBanner && banner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowBanner(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full object-cover"
                        />
                    </div>
                </div>
            )}

            <BeritaHome news={news} />

            <JadwalSholat />

            <section className="bg-gray-50 px-6 py-22 md:px-10 lg:px-10">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-6 w-1 bg-secondary" />
                            <h2 className="text-2xl font-bold text-primary font-second md:text-3xl">
                                Oase Keteduhan di Tengah Kota
                            </h2>
                        </div>

                        <p className="mb-4 leading-relaxed text-gray-700">
                            Berdiri sejak tahun 1994,{" "}
                            <span className="font-semibold text-primary">
                                Masjid Al Anhar
                            </span>{" "}
                            telah tumbuh bukan sekadar sebagai tempat bersujud,
                            melainkan sebagai pusat gravitasi spiritual dan
                            intelektual bagi masyarakat sekitar. Arsitektur kami
                            yang memadukan garis modern dengan esensi tradisi
                            mencerminkan visi kami untuk tetap relevan di zaman
                            yang terus berubah tanpa kehilangan akar keimanan.
                        </p>

                        <p className="mb-6 leading-relaxed text-gray-700">
                            Misi kami melampaui batas dinding masjid. Melalui
                            berbagai program pemberdayaan ekonomi, pendidikan
                            Al-Qur'an untuk tunas bangsa, hingga pengelolaan
                            zakat yang transparan, kami berkomitmen untuk
                            mewujudkan Islam yang rahmatan lil 'alamin.
                        </p>

                        <blockquote className="border-l-2 border-secondary pl-4 text-sm italic text-gray-500">
                            "Bersama-sama kita membangun bukan hanya struktur
                            fisik, tapi
                            <br />
                            juga karakter dan kekuatan ekonomi umat yang
                            mandiri."
                        </blockquote>
                    </div>

                    <div className="h-72 w-full overflow-hidden rounded-2xl md:h-96">
                        <img
                            src="/dakwah.webp"
                            alt="Masjid"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-primary px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-4 bg-secondary" />
                            <h3 className="text-xl font-bold text-white ">
                                Visi Kami
                            </h3>
                        </div>
                        <p className="leading-relaxed text-gray-100">
                            Menjadi pusat peradaban Islam yang unggul, mandiri,
                            dan inklusif dalam mewujudkan masyarakat yang
                            religius, berakhlak mulia, dan sejahtera di bawah
                            naungan ridha Allah SWT.
                        </p>
                    </div>

                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-4 bg-secondary" />
                            <h3 className="text-xl font-bold text-white">
                                Misi Kami
                            </h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Menyelenggarakan ibadah yang khusyuk dan sesuai tuntunan Al-Qur'an dan Sunnah.",
                                "Mengembangkan pendidikan Islam yang berkualitas bagi seluruh lapisan generasi.",
                                "Memberdayakan ekonomi umat melalui pengelolaan ZISWAF yang profesional dan transparan.",
                                "Membangun ukhuwah Islamiyah dan kepedulian sosial di tengah masyarakat.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                                    <span className="leading-relaxed text-gray-100">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">       
                    <div className="mb-14 text-center">
                        <h2 className="text-2xl font-extrabold text-primary font-second md:text-4xl">
                            Agenda Kegiatan Rutin
                        </h2>
                        <p className="mt-3 text-gray-700">
                            Menjalin Ukhuwah, Memperdalam Ilmu di Masjid Al
                            Anhar
                        </p>
                    </div>

                    <div className="relative hidden md:block">
                        <span className="absolute left-1/2 top-2 bottom-2 z-0 w-px -translate-x-1/2 bg-gray-300" />

                        <div className="space-y-14">
                            {agendaItems.map((item, index) => {
                                const Icon = item.icon;
                                const isEven = index % 2 === 0; 

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_auto_1fr] items-center gap-6"
                                    >
                                        {isEven ? (
                                            <div className="text-right">
                                                <h3 className="text-lg font-bold text-primary">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {item.description}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="justify-self-end rounded-2xl bg-white px-5 py-4 shadow-sm shadow-gray-200/70 max-w-xs">
                                                <span className="text-xs font-bold tracking-wide text-second">
                                                    {item.schedule}
                                                </span>
                                            </div>
                                        )}

                                        <div className="z-10 flex justify-center">
                                            <span className="ring-8 ring-indigo-50/60 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                        </div>

                                        {isEven ? (
                                            <div className="rounded-2xl bg-white px-5 py-4 shadow-sm shadow-gray-200/70 max-w-xs">
                                                <span className="text-xs font-bold tracking-wide text-second">
                                                    {item.schedule}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-left">
                                                <h3 className="text-lg font-bold text-primary">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative block md:hidden">
                        <span className="absolute left-6 top-2 bottom-2 z-0 w-px bg-gray-300" />

                        <div className="space-y-8">
                            {agendaItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="relative flex gap-4 pl-0"
                                    >
                                        <span className="ring-8 ring-indigo-50/60 relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md">
                                            <Icon className="h-5 w-5" />
                                        </span>

                                        <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/70">
                                            <span className="inline-block text-[11px] font-bold tracking-wide text-second">
                                                {item.schedule}
                                            </span>
                                            <h3 className="mt-1.5 text-base font-bold text-primary">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 px-6 py-14 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    <div className="relative isolate overflow-hidden rounded-3xl">
                        <img
                            src="/dakwah.webp"
                            alt=""
                            className="absolute inset-0 -z-20 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 -z-10 bg-primary/80" />

                        <div className="flex flex-col items-center px-6 py-14 text-center md:px-12 md:py-16">
                            <h2 className="max-w-2xl text-2xl font-bold leading-snug text-white md:text-3xl">
                                Bersama Memakmurkan
                                <br />
                                Masjid Al Anhar
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-100/90">
                                Setiap rupiah yang Anda infakkan adalah
                                investasi akhirat yang akan terus mengalir
                                pahalanya. Mari berkontribusi dalam pembangunan
                                peradaban umat.
                            </p>
                            <div className="flex flex-col md:flex-row gap-3 mt-7 ">
                                <a href="/laporan-keuangan" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-primary shadow-md transition hover:brightness-105">
                                    Laporan Keuangan
                                    <CircleDollarSign className="h-4 w-4" />
                                </a>
                                <a href="/infaqdonasi" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-primary shadow-md transition hover:brightness-105">
                                    Donasi Sekarang
                                    <Wallet className="h-4 w-4" />
                                </a>

                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 px-6 py-14 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl text-center">
                    <h2 className="text-xl font-extrabold tracking-tight text-primary font-second md:text-4xl mb-20">
                        Lembaga Masjid Al-Anhar
                    </h2>

                    <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-y-10 sm:grid-cols-5">
                        {partnerLogos.map((item, index) => (
                            <div
                                key={index}
                                className="flex h-28 w-28 items-center justify-center md:h-40 md:w-40"
                            >
                                {item.logo ? (
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain grayscale-0"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 p-2 text-center">
                                        <span className="text-[10px] font-medium leading-tight text-gray-400">
                                            {item.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
