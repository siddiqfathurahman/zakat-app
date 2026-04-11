import React from 'react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function Dashboard() {
    return (
        <QurbanLayout>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Qurban</h1>
                <p className="text-gray-600">Ini page dashboard. (Belum terhubung database)</p>
            </div>
        </QurbanLayout>
    );
}
