import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden"> 
            <DashboardSidebar /> 
            <div className="flex-1 overflow-y-auto"> 
                <main className="">
                    {children}
                </main>
            </div>
        </div>
    );
}
