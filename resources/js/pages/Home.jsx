import React from 'react';
import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Coming soon Home page</h1>
            <div className="flex gap-4">
                <Link
                    href="/zakat"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Zakat
                </Link>
                <Link
                    href="/qurban"
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                    Qurban
                </Link>
            </div>
        </div>
    );
}
