import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import QurbanSidebar from '../components/QurbanSidebar';
import { Menu } from 'lucide-react';

const menuItems = [
    { name: "Dashboard", href: "/qurban/input/dashboard" },
    { name: "Real Time", href: "/qurban/input/realtime" },
    { name: "Shohibul", href: "/qurban/input/shohibul" },
    { name: "Panitia", href: "/qurban/input/panitia" },
    { name: "Penerima", href: "/qurban/input/penerima" },
    { name: "Formula Jatah", href: "/qurban/input/formula" },
    { name: "Jatah Lembaga", href: "/qurban/input/jatah-lembaga" },
    { name: "Settings", href: "/qurban/input/setting" },
];

export default function QurbanLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const currentPage = menuItems.find(
        (item) => url === item.href || url.startsWith(item.href + "/")
    );
    const pageTitle = currentPage?.name ?? "E-Qurban";

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <QurbanSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 shadow-sm md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Buka menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">
                        {pageTitle}
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto p-4">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}