import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    HandCoins,
    HandHeart,
    ClipboardList,
    Scale,
    Settings,
    ReceiptPoundSterlingIcon,
    Menu,
    X,
} from "lucide-react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            name: "Dashboard",
            href: "/zakat/input/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Pembayar Zakat",
            href: "/zakat/input/pembayar",
            icon: HandCoins,
        },
        {
            name: "Penerima Zakat",
            href: "/zakat/input/penerima-zakat",
            icon: HandHeart,
        },
        {
            name: "Formula Jatah",
            href: "/zakat/input/formula-jatah",
            icon: Scale,
        },
        {
            name: "Laporan Belanja",
            href: "/zakat/input/laporan-belanja",
            icon: ReceiptPoundSterlingIcon,
        },
        {
            name: "Pemohon Luar",
            href: "/zakat/input/pemohon",
            icon: ClipboardList,
        },
        {
            name: "Settings",
            href: "/zakat/input/setting-beras",
            icon: Settings,
        },
    ];

    const isActive = (href) => {
        return window.location.pathname === href;
    };

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-green-600 text-white flex items-center justify-between px-4 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg font-bold">
                            Z
                        </span>
                    </div>
                    <h1 className="font-bold text-base">Zakat-App</h1>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-lg hover:bg-green-500 transition-colors"
                    aria-label="Buka menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                />
            )}

            <aside
                className={`
                    w-64 bg-green-600 text-white flex flex-col h-full
                    fixed md:static top-0 left-0 z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                <div className="p-6 border-b border-green-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-xl font-bold">
                                Z
                            </span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Zakat-App</h1>
                            <p className="text-xs text-green-100">
                                Panitia Zakat
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1 rounded-lg hover:bg-green-500 transition-colors"
                        aria-label="Tutup menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-6 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            active
                                                ? "bg-white text-green-600 font-medium"
                                                : "text-green-50 hover:bg-green-500"
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 flex flex-col gap-2">
                    <a
                        href="/zakat/input"
                        className="
                w-full 
                flex 
                justify-center 
                items-center 
                px-4 
                py-2 
                text-sm 
                font-semibold 
                rounded-lg 
                bg-white 
                text-green-800 
                hover:bg-green-100 
                transition-colors
              "
                    >
                        Halaman Utama
                    </a>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="
                w-full 
                flex 
                justify-center 
                items-center 
                px-4 
                py-2 
                text-sm 
                font-semibold 
                rounded-lg 
                bg-red-500 
                text-white 
                hover:bg-red-600 
                transition-colors
              "
                    >
                        Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}
