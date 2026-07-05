import { X, User, Phone } from "lucide-react";

const PemohonListModal = ({ open, onClose, pemohon = [] }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center">
      <div className="max-h-[80vh] w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-xl md:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold font-second text-primary">
              Daftar Lembaga & Pemohon Luar
            </h3>
            <p className="text-xs text-gray-400">
              {pemohon.length} pemohon tercatat
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-3">
          {pemohon.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              Belum ada data pemohon.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pemohon.map((item, i) => (
                <li key={item.id ?? i} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-primary">
                    <User className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {item.nama}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PemohonListModal;