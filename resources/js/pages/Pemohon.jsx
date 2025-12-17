import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../Layout/AppLayout';
import { Edit, Trash2 } from 'lucide-react';

export default function Pemohon({ pemohons = [], flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingPemohon, setEditingPemohon] = useState(null);
    const [deletingPemohon, setDeletingPemohon] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        permintaan: '',
        no_hp: '',
        jatah: ''
    });

    const handleOpenModal = (pemohon = null) => {
        if (pemohon) {
            setEditingPemohon(pemohon);
            setFormData({
                nama: pemohon.nama,
                permintaan: pemohon.permintaan || '',
                no_hp: pemohon.no_hp,
                jatah: pemohon.jatah || ''
            });
        } else {
            setEditingPemohon(null);
            setFormData({ nama: '', permintaan: '', no_hp: '', jatah: '', });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPemohon(null);
        setFormData({ nama: '', permintaan: '', no_hp: '',jatah: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            nama: formData.nama,
            permintaan: formData.permintaan,
            no_hp: formData.no_hp,
            jatah: formData.jatah
        };

        if (editingPemohon) {
            router.post(`/pemohon/${editingPemohon.id}/update`, submitData, {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (errors) => {
                    console.error('Error updating:', errors);
                }
            });
        } else {
            router.post('/pemohon', submitData, {
                onSuccess: () => {
                    handleCloseModal();
                },
                onError: (errors) => {
                    console.error('Error creating:', errors);
                }
            });
        }
    };

    const handleDelete = () => {
        if (deletingPemohon) {
            router.post(`/pemohon/${deletingPemohon.id}/destroy`, {}, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setDeletingPemohon(null);
                },
                onError: (errors) => {
                    console.error('Error deleting:', errors);
                }
            });
        }
    };

    const openDeleteModal = (pemohon) => {
        setDeletingPemohon(pemohon);
        setIsDeleteModalOpen(true);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="flex justify-between items-center mb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Data Pemohon Zakat Luar</h1>
                </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <span>+</span> Tambah Data
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">No</th>
                                <th className="px-4 py-3 text-left">Nama Pemohon</th>
                                <th className="px-4 py-3 text-left">Jumlah Permintaan</th>
                                <th className="px-4 py-3 text-left">Nomor Telepon</th>
                                <th className="px-4 py-3 text-left">Jatah</th>
                                <th className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pemohons.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        Belum ada data pemohon
                                    </td>
                                </tr>
                            ) : (
                                pemohons.map((pemohon, index) => (
                                    <tr key={pemohon.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3">{pemohon.nama}</td>
                                        <td className="px-4 py-3">{pemohon.permintaan || '-'}</td>
                                        <td className="px-4 py-3">{pemohon.no_hp}</td>
                                        <td className="px-4 py-3">{pemohon.jatah}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(pemohon)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(pemohon)}
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
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCloseModal}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">
                            {editingPemohon ? 'Edit Data Pemohon' : 'Tambah Data Pemohon'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama Pemohon *</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    placeholder="Masukkan nama pemohon"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Jumlah Permintaan</label>
                                <input
                                    type="text"
                                    value={formData.permintaan}
                                    onChange={(e) => setFormData({ ...formData, permintaan: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Contoh: 100000 atau kosongkan"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nomor Telepon *</label>
                                <input
                                    type="text"
                                    value={formData.no_hp}
                                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    placeholder="Contoh: 08123456789"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Jatah</label>
                                <input
                                    type="text"
                                    value={formData.jatah}
                                    onChange={(e) => setFormData({ ...formData, jatah: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Contoh: 20 Bungkus"
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
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data pemohon <strong>{deletingPemohon?.nama}</strong>?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletingPemohon(null);
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
        </AppLayout>
    );
}