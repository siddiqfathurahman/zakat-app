import React from 'react';
import { Link } from '@inertiajs/react';

export default function InputQurban() { 
    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-orange-800 mb-2">Input untuk Qurban</h1>
                <p className="text-gray-600">Halaman ini nantinya digunakan untuk form input data qurban.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 max-w-lg w-full mb-6">
                <div className="flex flex-col gap-4 text-center">
                    <p className="text-gray-500 italic">-- Form Input Qurban (Coming Soon) --</p>
                </div>
            </div>

            <Link
                href="/qurban/input/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
                Masuk ke Dashboard Qurban
            </Link>
        </div>
    );
}
