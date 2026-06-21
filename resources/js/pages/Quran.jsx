import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import AppLayout from "../Layout/AppLayout";
import SettingsModal from "./SettingsModal";
import { ArrowLeft, ArrowUpRight, Backpack, BookOpen, Search, Settings } from "lucide-react";

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const convertToArabicNumerals = (number) =>
  number
    .toString()
    .split("")
    .map((digit) => ARABIC_DIGITS[digit])
    .join("");

const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [listExpanded, setListExpanded] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState(1);
  const [surah, setSurah] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [arabicSize, setArabicSize] = useState(28);
  const [latinSize, setLatinSize] = useState(15);
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const [ayatQuery, setAyatQuery] = useState("");
  const [highlightedAyat, setHighlightedAyat] = useState(null);

  const [mobileView, setMobileView] = useState("list");

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get("https://api.quran.gading.dev/surah");
        setSurahs(response.data.data);
        setLoadingList(false);
      } catch (error) {
        console.error("Error fetching surah list:", error);
        setLoadingList(false);
      }
    };
    getList();
  }, []);

  useEffect(() => {
    const getDetail = async () => {
      setLoadingDetail(true);
      try {
        const response = await axios.get(
          `https://api.quran.gading.dev/surah/${selectedNumber}`
        );
        setSurah(response.data.data);
        setLoadingDetail(false);
      } catch (error) {
        console.error("Error fetching surah detail:", error);
        setLoadingDetail(false);
      }
    };
    getDetail();
  }, [selectedNumber]);

  useEffect(() => {
    const ayatNumber = parseInt(ayatQuery, 10);
    if (isNaN(ayatNumber) || !surah || !surah.verses) {
      return;
    }

    const verseExists = surah.verses.some(
      (v) => v.number.inSurah === ayatNumber
    );
    if (!verseExists) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      setHighlightedAyat(ayatNumber);

      const timer = setTimeout(() => {
        setHighlightedAyat(null);
      }, 3000);

      const element = document.getElementById(`ayat-${ayatNumber}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return () => clearTimeout(timer);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [ayatQuery, surah]);

  const fuse = useMemo(
    () =>
      new Fuse(surahs, {
        keys: ["name.transliteration.id", "name.translation.id", "number"],
        threshold: 0.3,
      }),
    [surahs]
  );

  const filteredSurahs = useMemo(() => {
    if (searchText.trim() === "") return surahs;
    return fuse.search(searchText).map(({ item }) => item);
  }, [searchText, surahs, fuse]);

  const visibleSurahs =
    !listExpanded && searchText.trim() === ""
      ? filteredSurahs.slice(0, 4)
      : filteredSurahs;

  const remainingCount = surahs.length - 4;

  const handleSelectSurah = (number) => {
    setSelectedNumber(number);
    setAyatQuery("");
    setMobileView("detail");
  };

  const handleAyatSearch = (e) => {
    const query = e.target.value;
    setAyatQuery(query);
  };

  return (
    <AppLayout>
      <div className="w-full">
        <section className="content px-4 py-8 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <aside
              className={`w-full shrink-0 md:block md:w-72 md:border-r-2 md:border-dashed md:border-gray-200 md:pr-6 ${
                mobileView === "list" ? "block" : "hidden"
              }`}
            >
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Cari Surah..."
                  className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary"
                />
              </div>

              {loadingList ? (
                <div className="my-16 flex justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : visibleSurahs.length === 0 ? (
                <p className="mt-8 text-center text-sm text-gray-400">
                  Nama surah tidak ditemukan
                </p>
              ) : (
                <div className="space-y-2">
                  {visibleSurahs.map((s) => {
                    const isActive = s.number === selectedNumber;
                    return (
                      <button
                        key={s.number}
                        onClick={() => handleSelectSurah(s.number)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-emerald-50 text-primary"
                            }`}
                          >
                            {s.number}
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-tight">
                              {s.name.transliteration.id}
                            </p>
                            <p
                              className={`text-[11px] uppercase tracking-wide ${
                                isActive ? "text-gray-200" : "text-gray-400"
                              }`}
                            >
                              {s.name.translation.id}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-amiri text-lg ${
                            isActive ? "text-white" : "text-second"
                          }`}
                        >
                          {s.name.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {!listExpanded && searchText.trim() === "" && remainingCount > 0 && (
                <button
                  onClick={() => setListExpanded(true)}
                  className="mt-4 w-full text-center text-xs font-semibold text-gray-400 hover:text-primary"
                >
                  Lihat {remainingCount} Surah Lainnya
                </button>
              )}
            </aside>

            <div
              className={`min-w-0 flex-1 md:block ${
                mobileView === "detail" ? "block" : "hidden"
              }`}
            >
              {loadingDetail || !surah ? (
                <div className="my-16 flex justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setMobileView("list")}
                    className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 md:hidden"
                  >
                    <ArrowLeft className="text-lg" />
                    Daftar Surah
                  </button>

                  <div className="relative isolate mb-5 overflow-hidden rounded-2xl bg-primary px-6 py-8 text-center">
                    <BookOpen className="absolute right-5 top-5 h-9 w-9 text-white/20" />
                    <p className="text-sm font-semibold text-white">
                      {surah.name.transliteration.id}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                      {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                      • {surah.revelation.id}
                    </p>
                    <h2 className="font-amiri mt-4 text-3xl text-white md:text-4xl">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </h2>
                  </div>

                  <div className="mb-5 flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={ayatQuery}
                        onChange={handleAyatSearch}
                        placeholder="Ayat"
                        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-primary"
                        style={{ MozAppearance: "textfield" }}
                      />
                      <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                      aria-label="Pengaturan tampilan"
                    >
                      <Settings className="text-xl" />
                    </button>
                  </div>

                  <SettingsModal
                    modalOpen={modalOpen}
                    toggleModal={() => setModalOpen(false)}
                    arabicSize={arabicSize}
                    setArabicSize={setArabicSize}
                    latinSize={latinSize}
                    setLatinSize={setLatinSize}
                    showLatin={showLatin}
                    setShowLatin={setShowLatin}
                    showTranslation={showTranslation}
                    setShowTranslation={setShowTranslation}
                  />

                  <div className="space-y-4">
                    {surah.verses.map((verse) => (
                      <div
                        key={verse.number.inSurah}
                        id={`ayat-${verse.number.inSurah}`}
                        className={`rounded-2xl bg-white p-5 transition-all duration-300 shadow-sm shadow-gray-200/70 ${
                          highlightedAyat === verse.number.inSurah
                            ? "ayat-flash"
                            : "border-transparent"
                        }`}
                      >
                        <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-primary">
                          {verse.number.inSurah}
                        </span>

                        <p
                          className="font-amiri mb-3 text-right leading-[2.4]"
                          style={{ fontSize: `${arabicSize}px` }}
                        >
                          {verse.text.arab}{" "}
                          <span className="text-second">
                            ({convertToArabicNumerals(verse.number.inSurah)})
                          </span>
                        </p>

                        {showLatin && (
                          <p
                            className="text-left font-semibold italic text-primary"
                            style={{ fontSize: `${latinSize}px` }}
                          >
                            {verse.text.transliteration.en}
                          </p>
                        )}
                        {showTranslation && (
                          <p className="mt-2 text-left text-sm text-gray-500">
                            {verse.translation.id}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Quran;
