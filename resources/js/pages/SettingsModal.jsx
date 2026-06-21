import { ClosedCaption } from "lucide-react";

function SettingsModal({
  modalOpen,
  toggleModal,
  arabicSize,
  setArabicSize,
  latinSize,
  setLatinSize,
  showLatin,
  setShowLatin,
  showTranslation,
  setShowTranslation,
}) {
  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4"
      onClick={toggleModal}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            Pengaturan Tampilan
          </h2>
          <button
            onClick={toggleModal}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100"
            aria-label="Tutup"
          >
            <ClosedCaption className="text-xl" />
          </button>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Ukuran Teks Arab
            </label>
            <span className="text-xs font-bold text-primary">
              {arabicSize}px
            </span>
          </div>
          <input
            type="range"
            min={18}
            max={40}
            value={arabicSize}
            onChange={(e) => setArabicSize(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              Ukuran Teks Latin
            </label>
            <span className="text-xs font-bold text-primary">
              {latinSize}px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={24}
            value={latinSize}
            onChange={(e) => setLatinSize(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Tampilkan Teks Latin
          </span>
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
              showLatin ? "bg-primary" : "bg-gray-200"
            }`}
            aria-pressed={showLatin}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                showLatin ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Tampilkan Terjemahan
          </span>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
              showTranslation ? "bg-primary" : "bg-gray-200"
            }`}
            aria-pressed={showTranslation}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                showTranslation ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
