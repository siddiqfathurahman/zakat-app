import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Menu } from 'lucide-react';
import { menuItems } from '../components/menuItems';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    // Cari menu yang cocok dengan path saat ini untuk dijadikan judul header mobile
    const currentPage = menuItems.find(
        (item) => url === item.href || url.startsWith(item.href + "/")
    );
    const pageTitle = currentPage?.name ?? "Dashboard";

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <DashboardSidebar
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
                    {/* Judul halaman aktif, menggantikan logo di mobile */}
                    <h1 className="text-base font-bold text-gray-900">
                        {pageTitle}
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}