import React from 'react';
import QurbanSidebar from '../components/QurbanSidebar';

export default function QurbanLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden"> 
            <QurbanSidebar /> 
            <div className="flex-1 overflow-y-auto"> 
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
