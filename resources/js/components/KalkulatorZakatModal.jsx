import { useMemo, useState } from "react";
import { X, Calculator } from "lucide-react";

/**
 * KalkulatorZakatModal
 *
 * Kalkulator Zakat Fitrah: jumlah jiwa x 2.5kg x harga beras/kg.
 * Harga beras (HARGA_BERAS_PER_KG) masih dummy, silakan sambungkan
 * ke data harga real (API/setting admin) nanti.
 */

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(isNaN(value) ? 0 : value);

const HARGA_BERAS_PER_KG = 15000; // dummy
const BERAT_FITRAH_PER_JIWA = 2.5; // kg

function KalkulatorZakatModal({ open, onClose }) {
  const [jumlahJiwa, setJumlahJiwa] = useState(1);

  const fitrahKg = useMemo(
    () => jumlahJiwa * BERAT_FITRAH_PER_JIWA,
    [jumlahJiwa]
  );
  const fitrahRupiah = useMemo(
    () => fitrahKg * HARGA_BERAS_PER_KG,
    [fitrahKg]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-primary">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Kalkulator Zakat Fitrah
              </h2>
              <p className="text-xs text-gray-400">
                Hitung perkiraan zakat fitrah yang perlu dibayarkan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Jumlah Jiwa */}
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Jumlah Jiwa
        </label>
        <input
          type="number"
          min={1}
          value={jumlahJiwa}
          onChange={(e) => setJumlahJiwa(Math.max(1, Number(e.target.value)))}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1.5 text-[11px] text-gray-400">
          Standar {BERAT_FITRAH_PER_JIWA} kg beras per jiwa, harga beras{" "}
          {formatRupiah(HARGA_BERAS_PER_KG)}/kg
        </p>

        {/* Hasil */}
        <div className="mt-5 rounded-xl bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total Beras</span>
            <span className="font-bold text-gray-900">{fitrahKg} kg</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-emerald-100 pt-2">
            <span className="text-sm font-semibold text-gray-700">
              Total Bayar (uang)
            </span>
            <span className="text-lg font-extrabold text-primary">
              {formatRupiah(fitrahRupiah)}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-bold text-white transition hover:brightness-110"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}

export default KalkulatorZakatModal;