import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "../Layout/AppLayout";
import { Delete, Edit, Plus, Trash, Trash2 } from "lucide-react";

export default function LaporanBelanja({
    totalUangMasuk,
    totalDibelanjakan,
    uangBelumBelanjakan,
    rekomendasiSak,
    settingBeras,
    historyPembelian,
}) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        panitia: "",
        tanggal: new Date().toISOString().split("T")[0],
        jumlah_sak: "",
        harga_per_sak: settingBeras?.harga_sak || "",
    });

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post("/laporan-belanja", formData, {
            onSuccess: () => {
                setShowModal(false);
                setFormData({
                    panitia: "",
                    tanggal: new Date().toISOString().split("T")[0],
                    jumlah_sak: "",
                    harga_per_sak: settingBeras?.harga_sak || "",
                });
            },
        });
    };

    const handleEdit = (item) => {
        setEditData(item);
        setFormData({
            panitia: item.panitia,
            tanggal: item.tanggal,
            jumlah_sak: item.jumlah_sak,
            harga_per_sak: item.harga_per_sak,
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.post(`/laporan-belanja/${editData.id}/update`, formData, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditData(null);
                setFormData({
                    panitia: "",
                    tanggal: new Date().toISOString().split("T")[0],
                    jumlah_sak: "",
                    harga_per_sak: settingBeras?.harga_sak || "",
                });
            },
        });
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const openDeleteModal = (id) => {
        setDeleteTargetId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteTargetId) return;
        router.post(`/laporan-belanja/${deleteTargetId}/destroy`, {}, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeleteTargetId(null);
            }
        });
    };

    const calculateTotal = () => {
        const sak = parseFloat(formData.jumlah_sak) || 0;
        const harga = parseFloat(formData.harga_per_sak) || 0;
        return sak * harga;
    };

    return (
        <>
            <AppLayout>
                <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Laporan Belanja Beras
                            </h1>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Uang Masuk
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {formatRupiah(totalUangMasuk)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sudah Dibelanjakan */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Sudah Dibelanjakan
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {formatRupiah(totalDibelanjakan)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Belum Dibelanjakan */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Belum Dibelanjakan
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {formatRupiah(uangBelumBelanjakan)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Rekomendasi */}
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Rekomendasi
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            {rekomendasiSak} Sak
                                        </p>
                                        <p className="text-sm font-medium text-gray-600">
                                            Sisa {formatRupiah((uangBelumBelanjakan || 0)-(settingBeras?.harga_sak || 0) * (rekomendasiSak || 0))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-4 items-center">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-150"
                            >
                                <Plus size={16} className="mr-2" />
                                Tambah Pembelian
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-green-600 text-white">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                No
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Panitia
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Jumlah Sak
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Harga/Sak
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                {" "}
                                                Penjual
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Sisa Uang
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {historyPembelian.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="9"
                                                    className="px-6 py-8 text-center text-gray-500"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        Belum ada data pembelian
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            historyPembelian.map(
                                                (item, index) => (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.panitia}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(
                                                                item.tanggal
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.jumlah_sak}{" "}
                                                            sak
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatRupiah(
                                                                item.harga_per_sak
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                            {formatRupiah(
                                                                item.total_belanja
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {item.nama_penjual}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                            {formatRupiah(
                                                                item.sisa_uang
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-900 transition duration-150"
                                                                    title="Edit"
                                                                >
                                                                    <Edit
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                                        <button
                                                                            onClick={() => openDeleteModal(item.id)}
                                                                            className="text-red-600 hover:text-red-900 transition duration-150"
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Tambah */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Tambah Pembelian Beras
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Panitia
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.panitia}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    panitia: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.tanggal}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    tanggal: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jumlah Sak (25kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.jumlah_sak}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    jumlah_sak: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Harga per Sak
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.harga_per_sak}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    harga_per_sak:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            required
                                            readOnly
                                        />
                                    </div>
                                    {formData.jumlah_sak &&
                                        formData.harga_per_sak && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Total Belanja
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatRupiah(
                                                        calculateTotal()
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Edit */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Edit Pembelian Beras
                                </h3>
                            </div>
                            <form onSubmit={handleUpdate} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Panitia
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.panitia}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    panitia: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.tanggal}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    tanggal: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jumlah Sak (25kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.jumlah_sak}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    jumlah_sak: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Harga per Sak
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.harga_per_sak}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    harga_per_sak:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    {formData.jumlah_sak &&
                                        formData.harga_per_sak && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Total Belanja
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatRupiah(
                                                        calculateTotal()
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditData(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* Modal Delete Confirmation */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">Konfirmasi Hapus</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">Apakah Anda yakin ingin menghapus data pembelian ini?</p>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => { setShowDeleteModal(false); setDeleteTargetId(null); }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
