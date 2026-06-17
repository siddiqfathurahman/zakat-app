import React from 'react';
import Sidebar from '../components/Sidebar';

export default function ZakatLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden"> 
            <Sidebar />
            <div className="flex-1 overflow-y-auto"> 
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}