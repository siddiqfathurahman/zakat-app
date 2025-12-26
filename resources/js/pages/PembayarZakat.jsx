import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Trash2, Search, Edit2, X, Edit } from "lucide-react";
import AppLayout from "../Layout/AppLayout";

export default function PembayarZakat({ pembayarZakat, rtList, rwList, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedRT, setSelectedRT] = useState(filters.rt || "");
    const [selectedRW, setSelectedRW] = useState(filters.rw || "");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteItemName, setDeleteItemName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        namaPembayar: "",
        namaPanitia: "",
        rt: "",
        rw: "",
        jumlahJiwa: "",
        melalui: "uang",
        totalBayar: 0,
        nilaiPerJiwa: 0,
        sodaqoh: "",
    });
    const itemsPerPage = 10;

    const handleFilter = () => {
        setCurrentPage(1);
        router.get('/pembayar', {
            search: searchTerm,
            rt: selectedRT,
            rw: selectedRW,
        }, {
            preserveState: true,
        });
    };

    const openDeleteModal = (id, name) => {
        setDeleteId(id);
        setDeleteItemName(name);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteItemName("");
    };

    const openEditModal = (item) => {
        setEditingId(item.id);
        setFormData({
            namaPembayar: item.nama,
            namaPanitia: item.panitia,
            rt: item.rt,
            rw: item.rw,
            jumlahJiwa: item.jumlah_jiwa.toString(),
            melalui: item.melalui,
            totalBayar: item.total,
            nilaiPerJiwa: item.nilai_per_jiwa,
            sodaqoh: item.sodaqoh || "",
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingId(null);
        setFormData({
            namaPembayar: "",
            namaPanitia: "",
            rt: "",
            rw: "",
            jumlahJiwa: "",
            melalui: "uang",
            totalBayar: 0,
            nilaiPerJiwa: 0,
            sodaqoh: "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post(`/pembayar/${editingId}/update`, formData, {
            onSuccess: () => {
                setIsLoading(false);
                closeEditModal();
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const confirmDelete = () => {
        if (!deleteId) return;

        router.post(
            `/pembayar/${deleteId}`,
            {},
            {
                onSuccess: () => {
                    closeDeleteModal();
                },
            }
        );
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const totalPages = Math.ceil(pembayarZakat.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = pembayarZakat.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        currentPage === i
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Data Pembayar Zakat</h1>
                </div>

                <div className="mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cari Nama
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Cari nama pembayar atau panitia..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleFilter}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Search size={20} />
                                        Cari
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter RT
                                </label>
                                <select
                                    value={selectedRT}
                                    onChange={(e) => {
                                        setSelectedRT(e.target.value);
                                        setCurrentPage(1);
                                        router.get('/pembayar', {
                                            search: searchTerm,
                                            rt: e.target.value,
                                            rw: selectedRW,
                                        }, {
                                            preserveState: true,
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua RT</option>
                                    {rtList.map((rt) => (
                                        <option key={rt} value={rt}>RT {rt}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter RW
                                </label>
                                <select
                                    value={selectedRW}
                                    onChange={(e) => {
                                        setSelectedRW(e.target.value);
                                        setCurrentPage(1);
                                        router.get('/pembayar', {
                                            search: searchTerm,
                                            rt: selectedRT,
                                            rw: e.target.value,
                                        }, {
                                            preserveState: true,
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua RW</option>
                                    {rwList.map((rw) => (
                                        <option key={rw} value={rw}>RW {rw}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <p className="text-sm text-gray-600">
                            Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, pembayarZakat.length)}</span> dari <span className="font-semibold">{pembayarZakat.length}</span> data
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-600 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Nama Pembayar</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Panitia</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold">RT/RW</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold">Jiwa</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Melalui</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Total Zakat</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Sodaqoh</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentData.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                                                Tidak ada data pembayar zakat
                                            </td>
                                        </tr>
                                    ) : (
                                        currentData.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{startIndex + index + 1}</td>
                                                <td className="px-4 py-3 text-sm font-medium">{item.nama}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{item.panitia}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.rt}/{item.rw}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.jumlah_jiwa}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        item.melalui === 'uang' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {item.melalui === 'uang' ? '💵 Uang' : '🌾 Beras'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold">
                                                    {item.melalui === 'uang' ? formatRupiah(item.total) : `${item.total} kg`}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {item.sodaqoh && item.melalui === 'uang' ? formatRupiah(item.sodaqoh) : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(item.id, item.nama)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-200 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Prev
                                </button>
                                
                                {renderPagination()}
                                
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Delete */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Konfirmasi Hapus Data
                                </h3>
                                <button
                                    onClick={closeDeleteModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Apakah Anda yakin ingin menghapus data pembayar zakat atas nama:
                                </p>
                                <p className="font-semibold text-gray-900 mt-2">
                                    {deleteItemName}
                                </p>
                                <p className="text-sm text-red-600 mt-2">
                                    Data yang dihapus tidak dapat dikembalikan.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                                >
                                    Ya, Hapus Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Edit Pembayar Zakat
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Pembayar
                                </label>
                                <input
                                    type="text"
                                    name="namaPembayar"
                                    value={formData.namaPembayar}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Panitia
                                </label>
                                <input
                                    type="text"
                                    name="namaPanitia"
                                    value={formData.namaPanitia}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        RT
                                    </label>
                                    <input
                                        type="text"
                                        name="rt"
                                        value={formData.rt}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        RW
                                    </label>
                                    <input
                                        type="text"
                                        name="rw"
                                        value={formData.rw}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Jumlah Jiwa
                                    </label>
                                    <input
                                        type="number"
                                        name="jumlahJiwa"
                                        value={formData.jumlahJiwa}
                                        onChange={handleEditChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Melalui
                                    </label>
                                    <select
                                        name="melalui"
                                        value={formData.melalui}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="uang">Uang</option>
                                        <option value="beras">Beras</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nilai Per Jiwa
                                    </label>
                                    <input
                                        type="number"
                                        name="nilaiPerJiwa"
                                        value={formData.nilaiPerJiwa}
                                        onChange={handleEditChange}
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Bayar
                                    </label>
                                    <input
                                        type="number"
                                        name="totalBayar"
                                        value={formData.totalBayar}
                                        onChange={handleEditChange}
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        readOnly
                                    />
                                </div>
                            </div>

                            {formData.melalui === "uang" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sodaqoh (Opsional)
                                    </label>
                                    <input
                                        type="number"
                                        name="sodaqoh"
                                        value={formData.sodaqoh}
                                        onChange={handleEditChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={isLoading}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}