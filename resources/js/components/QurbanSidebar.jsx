import React from "react";
import { Link } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  Sliders,
  Building2,
} from "lucide-react";  

export default function QurbanSidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            href: "/qurban/input/dashboard",
            icon: LayoutDashboard, 
        },
        {
            name: "Shohibul",
            href: "/qurban/input/shohibul",
            icon: Users, 
        },
        {
            name: "Panitia",
            href: "/qurban/input/panitia",
            icon: Users, 
        },
        {
            name: "Penerima",
            href: "/qurban/input/penerima",
            icon: UserCheck, 
        },
        {
            name: "Formula Jatah",
            href: "/qurban/input/formula",
            icon: Sliders,
        },
        {
            name: "Jatah Lembaga",
            href: "/qurban/input/jatah-lembaga",
            icon: Building2, 
        },
        {
            name: "Settings",
            href: "/qurban/input/setting",
            icon: Settings,
        },
    ];

    const isActive = (href) => {
        return window.location.pathname === href;
    };

    return (
        <aside className="w-64 bg-orange-700 text-white flex flex-col h-full">
            <div className="p-6 border-b border-orange-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <img src="/logo-qurban.png" alt="Logo Qurban" className="h-auto w-8" />
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl">E-Qurban</h1>
                    </div>
                    
                </div>
                <p className="text-xs pt-2 text-orange-100">Panitia Qurban Masjid Al-Anhar</p>
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
                                            ? "bg-white text-orange-700 font-medium"
                                            : "text-orange-50 hover:bg-orange-500"
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
                    href="/qurban/input"
                    className="w-full flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-lg bg-white text-orange-800 hover:bg-orange-100 transition-colors"
                >
                    Kembali ke Input
                </a>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                    Logout
                </Link>
            </div>
        </aside>
    );
}
