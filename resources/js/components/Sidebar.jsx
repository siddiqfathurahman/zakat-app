import React from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    HandCoins,
    HandHeart,
    ClipboardList,
    Scale,
    Settings,
    ReceiptPoundSterlingIcon,
} from "lucide-react";

export default function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Pembayar Zakat",
            href: "/pembayar",
            icon: HandCoins,
        },
        {
            name: "Penerima Zakat",
            href: "/penerima-zakat",
            icon: HandHeart,
        },
        {
          name: "Formula Jatah",
          href: "/formula-jatah",
          icon: Scale,
        },
        {
          name: "Laporan Belanja",
          href: "/laporan-belanja",
          icon: ReceiptPoundSterlingIcon,
        },
        {
            name: "Pemohon Luar",
            href: "/pemohon",
            icon: ClipboardList,
        },
        {
            name: "Settings",
            href: "/setting-beras",
            icon: Settings,
        },
    ];

    const isActive = (href) => {
        return window.location.pathname === href;
    };

    return (
        <aside className="w-64 bg-green-600 text-white flex flex-col h-full">
            <div className="p-6 border-b border-green-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xl font-bold">
                            Z
                        </span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Zakat-App</h1>
                        <p className="text-xs text-green-100">Panitia Zakat</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
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

            <div className="p-4">
                <a
                    href="/"
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
            </div>
        </aside>
    );
}
