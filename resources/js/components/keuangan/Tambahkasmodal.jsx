import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";

const formatRupiahInput = (value) => {
    const angka = value.toString().replace(/[^0-9]/g, "");
    if (!angka) return "";
    return new Intl.NumberFormat("id-ID").format(angka);
};

export default function TambahKasModal({ open, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: "",
        jenis: "cash",
        saldo: "",
        deskripsi: "",
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.keuangan.kas.quick"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
            <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
                <div className="mb-1 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Tambah Kas Baru</h2>
                        <p className="text-sm text-slate-500">Tempat penyimpanan uang baru.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nama Kas</label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                            placeholder="Misal: Kas Wakaf"
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-0"
                        />
                        {errors.nama && <p className="mt-1 text-xs text-rose-600">{errors.nama}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Jenis</label>
                        <select
                            value={data.jenis}
                            onChange={(e) => setData("jenis", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-0"
                        >
                            <option value="cash">Cash / Tunai</option>
                            <option value="bank">Bank</option>
                            <option value="ewallet">E-Wallet</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Saldo Awal</label>
                        <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-primary">
                            <span className="mr-1 text-slate-400">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={formatRupiahInput(data.saldo)}
                                onChange={(e) => setData("saldo", e.target.value.replace(/[^0-9]/g, ""))}
                                className="w-full border-0 p-0 text-base focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Deskripsi — opsional
                        </label>
                        <textarea
                            rows={2}
                            value={data.deskripsi}
                            onChange={(e) => setData("deskripsi", e.target.value)}
                            placeholder="Misal: Dana khusus renovasi"
                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-0"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-2xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}