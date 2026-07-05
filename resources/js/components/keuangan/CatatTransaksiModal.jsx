import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, Paperclip, Plus } from "lucide-react";

const formatRupiahInput = (value) => {
    const angka = value.toString().replace(/[^0-9]/g, "");
    if (!angka) return "";
    return new Intl.NumberFormat("id-ID").format(angka);
};

export default function CatatTransaksiModal({
    open,
    onClose,
    kasList,
    kategoriList,
    editData = null,
    onKategoriBaru,
}) {
    const isEdit = !!editData;
    const fileInputRef = useRef(null);
    const [showKategoriBaru, setShowKategoriBaru] = useState(false);
    const [namaKategoriBaru, setNamaKategoriBaru] = useState("");

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        jenis: editData?.jenis || "income",
        jumlah: editData?.jumlah || "",
        kas_id: editData?.kas_id || "",
        kategori_id: editData?.kategori_id || "",
        tanggal: editData?.tanggal || new Date().toISOString().slice(0, 10),
        keterangan: editData?.keterangan || "",
        lampiran: null,
        _method: isEdit ? "post" : "post",
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            setData({
                jenis: editData?.jenis || "income",
                jumlah: editData?.jumlah || "",
                kas_id: editData?.kas_id || "",
                kategori_id: editData?.kategori_id || "",
                tanggal: editData?.tanggal || new Date().toISOString().slice(0, 10),
                keterangan: editData?.keterangan || "",
                lampiran: null,
            });
            setShowKategoriBaru(false);
            setNamaKategoriBaru("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editData]);

    if (!open) return null;

    const kategoriTersaring = kategoriList.filter((k) => k.tipe === data.jenis);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? route("admin.keuangan.transaksi.update", editData.id)
            : route("admin.keuangan.transaksi.store");

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleTambahKategori = () => {
        if (!namaKategoriBaru.trim()) return;
        onKategoriBaru(namaKategoriBaru.trim(), data.jenis, (kategoriId) => {
            setData("kategori_id", kategoriId);
            setShowKategoriBaru(false);
            setNamaKategoriBaru("");
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl">
                <div className="mb-1 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {isEdit ? "Edit Transaksi" : "Catat Transaksi"}
                        </h2>
                        <p className="text-sm text-slate-500">Pemasukan atau pengeluaran kas.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Toggle jenis */}
                    <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setData("jenis", "income");
                                setData("kategori_id", "");
                            }}
                            className={`rounded-full py-2 text-sm font-medium transition ${
                                data.jenis === "income"
                                    ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                                    : "text-slate-500"
                            }`}
                        >
                            Pemasukan
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setData("jenis", "expense");
                                setData("kategori_id", "");
                            }}
                            className={`rounded-full py-2 text-sm font-medium transition ${
                                data.jenis === "expense"
                                    ? "bg-white text-rose-700 shadow-sm ring-1 ring-rose-200"
                                    : "text-slate-500"
                            }`}
                        >
                            Pengeluaran
                        </button>
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Jumlah</label>
                        <div className="flex items-center rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-emerald-400">
                            <span className="mr-1 text-slate-400">Rp</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                value={formatRupiahInput(data.jumlah)}
                                onChange={(e) =>
                                    setData("jumlah", e.target.value.replace(/[^0-9]/g, ""))
                                }
                                className="w-full border-0 p-0 text-base focus:outline-none focus:ring-0"
                            />
                        </div>
                        {errors.jumlah && <p className="mt-1 text-xs text-rose-600">{errors.jumlah}</p>}
                    </div>

                    {/* Kas */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Kas</label>
                        <select
                            value={data.kas_id}
                            onChange={(e) => setData("kas_id", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-0"
                        >
                            <option value="">Pilih kas</option>
                            {kasList.map((kas) => (
                                <option key={kas.id} value={kas.id}>
                                    {kas.nama}
                                </option>
                            ))}
                        </select>
                        {errors.kas_id && <p className="mt-1 text-xs text-rose-600">{errors.kas_id}</p>}
                    </div>

                    {/* Kategori */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700">Kategori</label>
                            <button
                                type="button"
                                onClick={() => setShowKategoriBaru((v) => !v)}
                                className="flex items-center gap-1 text-sm font-medium text-emerald-700"
                            >
                                <Plus size={14} /> Kategori baru
                            </button>
                        </div>

                        {showKategoriBaru && (
                            <div className="mb-2 flex gap-2">
                                <input
                                    type="text"
                                    value={namaKategoriBaru}
                                    onChange={(e) => setNamaKategoriBaru(e.target.value)}
                                    placeholder="Nama kategori baru"
                                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleTambahKategori}
                                    className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white"
                                >
                                    Tambah
                                </button>
                            </div>
                        )}

                        <select
                            value={data.kategori_id}
                            onChange={(e) => setData("kategori_id", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-0"
                        >
                            <option value="">Tanpa kategori</option>
                            {kategoriTersaring.map((kat) => (
                                <option key={kat.id} value={kat.id}>
                                    {kat.nama}
                                </option>
                            ))}
                        </select>
                        {errors.kategori_id && (
                            <p className="mt-1 text-xs text-rose-600">{errors.kategori_id}</p>
                        )}
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal</label>
                        <input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData("tanggal", e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-0"
                        />
                        {errors.tanggal && <p className="mt-1 text-xs text-rose-600">{errors.tanggal}</p>}
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Keterangan</label>
                        <textarea
                            rows={2}
                            value={data.keterangan}
                            onChange={(e) => setData("keterangan", e.target.value)}
                            placeholder="Misal: Infaq Jumat"
                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-400 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Bukti */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Bukti (kwitansi/nota) — opsional
                        </label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-emerald-400 hover:text-emerald-700"
                        >
                            <Paperclip size={16} />
                            {data.lampiran ? data.lampiran.name : "Pilih foto / PDF"}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                            onChange={(e) => setData("lampiran", e.target.files[0])}
                        />
                        {errors.lampiran && (
                            <p className="mt-1 text-xs text-rose-600">{errors.lampiran}</p>
                        )}
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
                            className="flex-1 rounded-2xl bg-emerald-700 py-3 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
