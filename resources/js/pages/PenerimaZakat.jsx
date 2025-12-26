import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Users,
    Settings,
    Check,
    Edit,
    Trash2,
    Search,
    Printer,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import AppLayout from "../Layout/AppLayout";

export default function PenerimaZakat({
    penerimas = {
        data: [],
        from: 1,
        to: 0,
        total: 0,
        last_page: 1,
        current_page: 1,
        prev_page_url: null,
        next_page_url: null,
    },
    configs = {},
    flash,
    filters,
    rtList = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConfirmSaveModalOpen, setIsConfirmSaveModalOpen] = useState(false);
    const [isConfirmApplyModalOpen, setIsConfirmApplyModalOpen] =
        useState(false);
    const [deletingPenerima, setDeletingPenerima] = useState(null);
    const [editingPenerima, setEditingPenerima] = useState(null);
    const [formData, setFormData] = useState({
        nama: "",
        rt: "",
        rw: "",
        jiwa: "",
    });
    const [matches, setMatches] = useState([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [isAIResultModalOpen, setIsAIResultModalOpen] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [selectedRT, setSelectedRT] = useState(filters?.rt || "");

    // State untuk konfigurasi jatah
    const [jatahConfig, setJatahConfig] = useState({
        1: configs[1] || "",
        2: configs[2] || "",
        3: configs[3] || "",
        4: configs[4] || "",
        5: configs[5] || "",
    });

    const rtRwData = [
        { rt: "48", rw: "11" },
        { rt: "49", rw: "11" },
        { rt: "50", rw: "11" },
        { rt: "51", rw: "12" },
        { rt: "52", rw: "12" },
        { rt: "53", rw: "12" },
        { rt: "56", rw: "13" },
        { rt: "57", rw: "13" },
    ];

    const handleRtChange = (e) => {
        const selectedRt = e.target.value;
        const rtData = rtRwData.find((item) => item.rt === selectedRt);

        setFormData((prev) => ({
            ...prev,
            rt: selectedRt,
            rw: rtData ? rtData.rw : "",
        }));
    };

    const handleOpenModal = (penerima = null) => {
        if (penerima) {
            setEditingPenerima(penerima);
            setFormData({
                nama: penerima.nama,
                rt: penerima.rt,
                rw: penerima.rw,
                jiwa: penerima.jiwa,
            });
        } else {
            setEditingPenerima(null);
            setFormData({ nama: "", rt: "", rw: "", jiwa: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPenerima(null);
        setFormData({ nama: "", rt: "", rw: "", jiwa: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingPenerima) {
            router.post(
                `/penerima-zakat/${editingPenerima.id}/update`,
                formData,
                {
                    onSuccess: () => {
                        handleCloseModal();
                    },
                    onError: (errors) => {
                        console.error("Error updating:", errors);
                    },
                }
            );
        } else {
            router.post("/penerima-zakat", formData, {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (errors) => {
                    console.error("Error creating:", errors);
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingPenerima) {
            router.post(
                `/penerima-zakat/${deletingPenerima.id}/destroy`,
                {},
                {
                    onSuccess: () => {
                        setIsDeleteModalOpen(false);
                        setDeletingPenerima(null);
                    },
                    onError: (errors) => {
                        console.error("Error deleting:", errors);
                    },
                }
            );
        }
    };

    const openDeleteModal = (penerima) => {
        setDeletingPenerima(penerima);
        setIsDeleteModalOpen(true);
    };

    const handleJatahConfigChange = (jiwa, value) => {
        setJatahConfig((prev) => ({
            ...prev,
            [jiwa]: value,
        }));
    };

    const handleSaveJatahConfig = () => {
        router.post(
            "/jatah-config",
            {
                jatah: jatahConfig,
            },
            {
                onSuccess: () => {
                    setIsConfirmSaveModalOpen(false);
                },
            }
        );
    };

    const handleApplyJatah = () => {
        router.post(
            "/jatah-config/apply",
            {},
            {
                onSuccess: () => {
                    setIsConfirmApplyModalOpen(false);
                },
            }
        );
    };

    // Handle filter dan search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/penerima-zakat",
            {
                search: searchQuery,
                rt: selectedRT,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleResetFilter = () => {
        setSearchQuery("");
        setSelectedRT("");
        router.get("/penerima-zakat");
    };

    const handlePrint = () => {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (selectedRT) queryParams.append("rt", selectedRT);
        queryParams.append("print", "1");

        window.open(
            `/penerima-zakat/print?${queryParams.toString()}`,
            "_blank"
        );
    };

    // Pagination
    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                {
                    search: searchQuery,
                    rt: selectedRT,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const handleCompareAI = async () => {
    setIsLoadingAI(true);
    setMatches([]);
    
    try {
        const response = await fetch('/zakat/compare-ai', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setMatches(data);
        setIsAIResultModalOpen(true);
        
    } catch (error) {
        console.error('Error:', error);
        alert("Gagal mendeteksi data: " + error.message);
    } finally {
        setIsLoadingAI(false);
    }
};

    return (
        <AppLayout>
            <div className="space-y-6 min-h-screen bg-gray-50 p-4 md:p-8">
                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Penerima Zakat
                    </h1>
                </div>

                {/* Konfigurasi Jatah Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Settings className="text-green-600" size={24} />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Konfigurasi Jatah per Jiwa
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsConfirmSaveModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                💾 Simpan Konfigurasi
                            </button>
                            <button
                                onClick={() => setIsConfirmApplyModalOpen(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            >
                                <Check size={18} />
                                Terapkan ke Semua Penerima
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-center">
                                        Jumlah Jiwa
                                    </th>
                                    <th className="px-4 py-3 text-center">1</th>
                                    <th className="px-4 py-3 text-center">2</th>
                                    <th className="px-4 py-3 text-center">3</th>
                                    <th className="px-4 py-3 text-center">4</th>
                                    <th className="px-4 py-3 text-center">
                                        5+
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                                        Jatah / bungkus
                                    </td>
                                    {[1, 2, 3, 4, 5].map((jiwa) => (
                                        <td key={jiwa} className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={jatahConfig[jiwa]}
                                                onChange={(e) =>
                                                    handleJatahConfigChange(
                                                        jiwa,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Catatan:</strong> Konfigurasi "5+" akan
                            diterapkan untuk semua penerima dengan jumlah jiwa 5
                            atau lebih. Klik "Simpan Konfigurasi" untuk
                            menyimpan perubahan, lalu klik "Terapkan ke Semua
                            Penerima" untuk mengupdate jatah penerima.
                        </p>
                    </div>
                </div>

                {/* Data Penerima Zakat Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="text-green-600" size={24} />
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Data Penerima Zakat
                                </h2>
                            </div>
                            <div className="flex gap-2"></div>
                        </div>

                        {/* Filter Section */}
                        <form
                            onSubmit={handleSearch}
                            className="flex gap-3 items-end"
                        >
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cari Nama
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari nama penerima..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter RT
                                </label>
                                <select
                                    value={selectedRT}
                                    onChange={(e) =>
                                        setSelectedRT(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Semua RT</option>
                                    {rtList.map((rt) => (
                                        <option key={rt} value={rt}>
                                            RT {String(rt).padStart()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Cari
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            >
                                <Printer size={18} />
                                Cetak Data
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            >
                                <span>+</span> Tambah Penerima
                            </button>
                            <button
                                onClick={handleCompareAI}
                                className="bg-amber-600 text-white px-4 py-2 rounded-lg"
                            >
                                {isLoadingAI
                                    ? "Memproses"
                                    : "Compare Penerima"}
                            </button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-green-600">
                                <tr>
                                    <th className="px-4 py-3 text-left text-white">
                                        No
                                    </th>
                                    <th className="px-4 py-3 text-left text-white">
                                        Nama Penerima
                                    </th>
                                    <th className="px-4 py-3 text-center text-white">
                                        RT
                                    </th>
                                    <th className="px-4 py-3 text-center text-white">
                                        RW
                                    </th>
                                    <th className="px-4 py-3 text-center text-white">
                                        Jumlah Jiwa
                                    </th>
                                    <th className="px-4 py-3 text-center text-white">
                                        Jatah
                                    </th>
                                    <th className="px-4 py-3 text-center text-white">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {penerimas.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            {searchQuery || selectedRT
                                                ? "Tidak ada data yang sesuai dengan filter"
                                                : "Belum ada data penerima zakat"}
                                        </td>
                                    </tr>
                                ) : (
                                    penerimas.data.map((penerima, index) => (
                                        <tr
                                            key={penerima.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                {penerimas.from + index}
                                            </td>
                                            <td className="px-4 py-3">
                                                {penerima.nama}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {String(penerima.rt)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {String(penerima.rw)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {penerima.jiwa}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {penerima.jatah ? (
                                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {penerima.jatah}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                penerima
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                penerima
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 p-1"
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
                    {penerimas.last_page > 1 && (
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Menampilkan {penerimas.from} -{" "}
                                    {penerimas.to} dari {penerimas.total} data
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                penerimas.prev_page_url
                                            )
                                        }
                                        disabled={!penerimas.prev_page_url}
                                        className={`p-2 rounded ${
                                            penerimas.prev_page_url
                                                ? "bg-white border hover:bg-gray-50"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {Array.from(
                                        { length: penerimas.last_page },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(
                                                    `/penerima-zakat?page=${page}`
                                                )
                                            }
                                            className={`px-3 py-2 rounded min-w-[40px] ${
                                                page === penerimas.current_page
                                                    ? "bg-green-600 text-white"
                                                    : "bg-white border hover:bg-gray-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                penerimas.next_page_url
                                            )
                                        }
                                        disabled={!penerimas.next_page_url}
                                        className={`p-2 rounded ${
                                            penerimas.next_page_url
                                                ? "bg-white border hover:bg-gray-50"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Hasil AI Detection */}
            {isAIResultModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsAIResultModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Compare data dengan pembayar zakat
                            </h2>
                        </div>

                        {matches.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Tidak Ada Data yang Sama
                                </h3>
                                <p className="text-gray-600">
                                    Tidak ditemukan penerima yang juga terdaftar
                                    sebagai pembayar zakat
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-yellow-800">
                                        <strong>⚠️ Perhatian:</strong> Ditemukan{" "}
                                        {matches.length} penerima yang juga
                                        terdeteksi sebagai pembayar zakat
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-yellow-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left">
                                                    No
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Penerima
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Pembayar
                                                </th>
                                                <th className="px-10 py-3 text-left">
                                                    RT/RW
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Alasan AI
                                                </th>
                                                <th className="px-4 py-3 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matches.map((item, index) => (
                                                <tr
                                                    key={item.penerima_id}
                                                    className=" hover:bg-yellow-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">
                                                        {item.penerima.nama}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.pembayar.nama}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        RT {item.penerima.rt} /
                                                        RW {item.penerima.rw}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {item.alasan}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setIsAIResultModalOpen(
                                                                    false
                                                                );
                                                                openDeleteModal(
                                                                    item.penerima
                                                                );
                                                            }}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsAIResultModalOpen(false)}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit Penerima */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {editingPenerima
                                ? "Edit Penerima Zakat"
                                : "Tambah Penerima Zakat"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Nama Penerima *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nama: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    placeholder="Masukkan nama penerima"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        RT *
                                    </label>
                                    <select
                                        id="rt"
                                        name="rt"
                                        value={formData.rt}
                                        onChange={handleRtChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih RT</option>
                                        {rtRwData.map((item) => (
                                            <option
                                                key={item.rt}
                                                value={item.rt}
                                            >
                                                {item.rt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        RW *
                                    </label>
                                    <input
                                        id="rw"
                                        name="rw"
                                        type="text"
                                        value={formData.rw}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    Jumlah Jiwa *
                                </label>
                                <input
                                    type="number"
                                    value={formData.jiwa}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            jiwa: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    placeholder="Masukkan jumlah jiwa"
                                    min="1"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    {editingPenerima ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete Confirmation */}
            {isDeleteModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Konfirmasi Hapus
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus penerima{" "}
                            <strong>{deletingPenerima?.nama}</strong>?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletingPenerima(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirm Save Config */}
            {isConfirmSaveModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsConfirmSaveModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Konfirmasi Simpan
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menyimpan konfigurasi jatah
                            ini?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setIsConfirmSaveModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveJatahConfig}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirm Apply */}
            {isConfirmApplyModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsConfirmApplyModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Konfirmasi Terapkan
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menerapkan konfigurasi jatah
                            ke semua penerima? Ini akan mengupdate jatah untuk
                            semua penerima yang sudah terdaftar.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() =>
                                    setIsConfirmApplyModalOpen(false)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleApplyJatah}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
