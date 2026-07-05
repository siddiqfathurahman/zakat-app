import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <AlertTriangle size={20} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                <div className="mt-5 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
                    >
                        {loading ? "Menghapus..." : "Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}
