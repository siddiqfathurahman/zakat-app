import React, { useState, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "../../Layout/DashboardLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    AlertTriangle,
    Search,
    Users,
    ChevronDown,
} from "lucide-react";

const ROLE_OPTIONS = [
    { value: "", label: "Semua Role" },
    { value: "super admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "zakat", label: "Panitia Zakat" },
    { value: "qurban", label: "Panitia Qurban" },
];

const ROLE_COLORS = {
    "super admin": "bg-red-50 text-red-600",
    admin: "bg-emerald-50 text-primary",
    zakat: "bg-blue-50 text-blue-600",
    qurban: "bg-amber-50 text-amber-600",
};

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateStr));
}

export default function UserManagement({ users, totalUsers }) {
    const { errors: flashErrors } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            username: "",
            password: "",
            role: "admin",
        });


    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchSearch =
                !search ||
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (u.username || "").toLowerCase().includes(search.toLowerCase());
            const matchRole = !roleFilter || u.role === roleFilter;
            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter]);

    const openCreateModal = () => {
        setEditingUser(null);
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            username: user.username || "",
            password: "",
            role: user.role,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            post(`/admin/user/${editingUser.id}/update`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post("/admin/user", { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
            post(`/admin/user/${id}/delete`);
        }
    };

    const roleCounts = useMemo(() => {
        return users.reduce((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
        }, {});
    }, [users]);

    const statCards = [
        {
            label: "Total User",
            value: totalUsers,
            color: "bg-primary/10 text-primary",
            role: null,
        },
        {
            label: "Super Admin",
            value: roleCounts["super admin"] || 0,
            color: "bg-red-50 text-red-600",
            role: "super admin",
        },
        {
            label: "Admin",
            value: roleCounts["admin"] || 0,
            color: "bg-emerald-50 text-primary",
            role: "admin",
        },
        {
            label: "Panitia Zakat",
            value: roleCounts["zakat"] || 0,
            color: "bg-blue-50 text-blue-600",
            role: "zakat",
        },
        {
            label: "Panitia Qurban",
            value: roleCounts["qurban"] || 0,
            color: "bg-amber-50 text-amber-600",
            role: "qurban",
        },
    ];

    return (
        <DashboardLayout>
            <div className="w-full">
                <div className="flex items-center justify-between bg-white border border-gray-200 p-3 md:p-4 hidden sm:block">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className=" text-xs text-gray-400 mt-0.5 ">
                            Kelola data user, role, dan hak akses aplikasi.
                        </p>
                    </div>
                </div>

                <div className="space-y-5 px-4 py-6 md:space-y-6 md:px-8">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {statCards.map((card, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white p-3 shadow-sm shadow-gray-200/60 sm:p-4"
                            >
                                <span
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold sm:h-9 sm:w-9 ${card.color}`}
                                >
                                    <Users className="h-4 w-4" />
                                </span>
                                <p className="mt-2 text-xl font-extrabold text-gray-900 sm:mt-3 sm:text-2xl">
                                    {card.value}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5 truncate sm:text-xs">
                                    {card.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            onClick={openCreateModal}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah User
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, email, atau username..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1 sm:flex-none">
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-primary sm:w-48"
                                >
                                    {ROLE_OPTIONS.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                            {(search || roleFilter) && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setRoleFilter("");
                                    }}
                                    className="flex-shrink-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {flashErrors && flashErrors.delete && (
                        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <span>{flashErrors.delete}</span>
                        </div>
                    )}

                    {/* ── List ── */}
                    <div className="rounded-2xl bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-3.5">
                            <p className="text-xs font-semibold text-gray-700 sm:text-sm">
                                Menampilkan{" "}
                                <span className="font-bold text-primary">
                                    {filteredUsers.length}
                                </span>{" "}
                                dari{" "}
                                <span className="font-bold">{totalUsers}</span>{" "}
                                user
                            </p>
                        </div>

                        {filteredUsers.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-400">
                                {search || roleFilter
                                    ? "Tidak ada user yang cocok dengan filter."
                                    : "Belum ada data user."}
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-gray-50 md:hidden">
                                    {filteredUsers.map((user) => (
                                        <div key={user.id} className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </p>
                                                    {user.username && (
                                                        <p className="font-mono text-[11px] text-gray-400 truncate">
                                                            @{user.username}
                                                        </p>
                                                    )}
                                                </div>
                                                <span
                                                    className={`flex-shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </div>

                                            <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
                                                <span>
                                                    Login:{" "}
                                                    {formatDate(
                                                        user.last_login_at,
                                                    )}
                                                </span>
                                                <span>
                                                    Dibuat:{" "}
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(user)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-primary transition"
                                                    title="Edit User"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                                                    title="Hapus User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    NAMA
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    EMAIL
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    USERNAME
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    ROLE
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    LAST LOGIN
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary">
                                                    DIBUAT
                                                </th>
                                                <th className="px-5 pb-3 pt-3 text-[11px] font-bold tracking-wide text-primary text-right">
                                                    AKSI
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50/60"
                                                >
                                                    <td className="px-5 py-3.5 font-semibold text-gray-800">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-gray-600">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                                                        {user.username || "-"}
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                                                        {formatDate(
                                                            user.last_login_at,
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                                                        {formatDate(
                                                            user.created_at,
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        user,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-primary transition"
                                                                title="Edit User"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
                                                                    )
                                                                }
                                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                                                                title="Hapus User"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
                    <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                {editingUser ? "Edit User" : "Tambah User"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="flex-shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 space-y-4"
                        >
                            {[
                                {
                                    label: "Nama Lengkap",
                                    field: "name",
                                    type: "text",
                                    placeholder: "Masukkan nama",
                                },
                                {
                                    label: "Email",
                                    field: "email",
                                    type: "email",
                                    placeholder: "Masukkan email",
                                },
                                {
                                    label: "Username",
                                    field: "username",
                                    type: "text",
                                    placeholder: "Masukkan username",
                                },
                            ].map(({ label, field, type, placeholder }) => (
                                <div key={field}>
                                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={data[field]}
                                        onChange={(e) =>
                                            setData(field, e.target.value)
                                        }
                                        placeholder={placeholder}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                                        required
                                    />
                                    {errors[field] && (
                                        <span className="text-xs text-red-500 mt-1 block">
                                            {errors[field]}
                                        </span>
                                    )}
                                </div>
                            ))}

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Kata Sandi{" "}
                                    {editingUser && (
                                        <span className="text-gray-400 font-normal">
                                            (kosongkan jika tidak diubah)
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                                    required={!editingUser}
                                />
                                {errors.password && (
                                    <span className="text-xs text-red-500 mt-1 block">
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Peran (Role)
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary pr-10"
                                    >
                                        <option value="super admin">
                                            Super Admin
                                        </option>
                                        <option value="admin">Admin</option>
                                        <option value="zakat">
                                            Panitia Zakat
                                        </option>
                                        <option value="qurban">
                                            Panitia Qurban
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.role && (
                                    <span className="text-xs text-red-500 mt-1 block">
                                        {errors.role}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 mt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}