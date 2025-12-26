import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Save, Calculator, Check, X } from "lucide-react";
import AppLayout from "../Layout/AppLayout";

export default function FormulaJatah({ jiwaStats, formulaJatah }) {
    const [formData, setFormData] = useState({
        jumlah_total_bungkus: formulaJatah.jumlah_total_bungkus || 0,
        sim_jatah_1: formulaJatah.sim_jatah_1 || 1,
        sim_jatah_2: formulaJatah.sim_jatah_2 || 2,
        sim_jatah_3: formulaJatah.sim_jatah_3 || 3,
        sim_jatah_4: formulaJatah.sim_jatah_4 || 4,
        sim_jatah_5_plus: formulaJatah.sim_jatah_5_plus || 5,
    });

    const [showSuccess, setShowSuccess] = useState(false);

    // Data jiwa dari database
    const jiwaData = {
        jiwa_1: jiwaStats?.jiwa_1 || 0,
        jiwa_2: jiwaStats?.jiwa_2 || 0,
        jiwa_3: jiwaStats?.jiwa_3 || 0,
        jiwa_4: jiwaStats?.jiwa_4 || 0,
        jiwa_5_plus: jiwaStats?.jiwa_5_plus || 0,
    };

    // Hitung total jiwa
    const totalJiwa = Object.values(jiwaData).reduce((a, b) => a + b, 0);

    // Hitung total sim jatah
    const totalSimJatah = {
        jiwa_1: jiwaData.jiwa_1 * formData.sim_jatah_1,
        jiwa_2: jiwaData.jiwa_2 * formData.sim_jatah_2,
        jiwa_3: jiwaData.jiwa_3 * formData.sim_jatah_3,
        jiwa_4: jiwaData.jiwa_4 * formData.sim_jatah_4,
        jiwa_5_plus: jiwaData.jiwa_5_plus * formData.sim_jatah_5_plus,
    };

    const totalKeseluruhan = Object.values(totalSimJatah).reduce(
        (a, b) => a + b,
        0
    );
    const sisaPembagian = formData.jumlah_total_bungkus - totalKeseluruhan;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            jiwa_1_count: jiwaData.jiwa_1,
            jiwa_2_count: jiwaData.jiwa_2,
            jiwa_3_count: jiwaData.jiwa_3,
            jiwa_4_count: jiwaData.jiwa_4,
            jiwa_5_plus_count: jiwaData.jiwa_5_plus,
        };

        router.post("/formula-jatah/store", dataToSubmit, {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                }, 2000);
            },
            onError: (errors) => {
                console.error("Error:", errors);
                alert("Terjadi kesalahan saat menyimpan data");
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className=" mx-auto">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-green-600 text-white p-6">
                            <h1 className="text-2xl font-semibold mb-1">
                                Formula Jatah Pembagian
                            </h1>
                            <p className="text-green-100 text-sm">
                                Simulasi pembagian zakat berdasarkan jumlah jiwa
                            </p>
                        </div>

                        <div className="p-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                                        JUMLAH TOTAL BUNGKUS
                                    </h3>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {formData.jumlah_total_bungkus}
                                    </p>
                                </div>

                                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                                        JATAH JAMAAH MASJID
                                    </h3>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {formData.jumlah_total_bungkus -
                                            sisaPembagian}
                                    </p>
                                </div>

                                <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-sm font-medium text-orange-800 mb-2">
                                        SISA PEMBAGIAN
                                    </h3>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {sisaPembagian}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Input Total Bungkus */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="jumlah_total_bungkus"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Jumlah Total Bungkus{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="jumlah_total_bungkus"
                                        name="jumlah_total_bungkus"
                                        type="number"
                                        placeholder="Masukkan jumlah total bungkus"
                                        min="0"
                                        value={formData.jumlah_total_bungkus}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Tabel Simulasi */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-300 bg-green-600 text-white p-3 text-center font-semibold">
                                                    JIWA
                                                </th>
                                                <th className="border border-gray-300 bg-green-600 text-white p-3 text-center font-semibold">
                                                    TOTAL JIWA
                                                </th>
                                                <th className="border border-gray-300 bg-green-600 text-white p-3 text-center font-semibold">
                                                    SIM. JATAH
                                                </th>
                                                <th className="border border-gray-300 bg-green-600 text-white p-3 text-center font-semibold">
                                                    TOTAL SIM. JATAH
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Jiwa 1 */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 text-center font-bold">
                                                    1
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {jiwaData.jiwa_1}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    <input
                                                        type="number"
                                                        name="sim_jatah_1"
                                                        value={
                                                            formData.sim_jatah_1
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        min="0"
                                                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {totalSimJatah.jiwa_1}
                                                </td>
                                            </tr>

                                            {/* Jiwa 2 */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 text-center font-bold">
                                                    2
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {jiwaData.jiwa_2}
                                                </td>
                                                <td className="border border-gray-300  p-2">
                                                    <input
                                                        type="number"
                                                        name="sim_jatah_2"
                                                        value={
                                                            formData.sim_jatah_2
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        min="0"
                                                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {totalSimJatah.jiwa_2}
                                                </td>
                                            </tr>

                                            {/* Jiwa 3 */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 text-center font-bold">
                                                    3
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {jiwaData.jiwa_3}
                                                </td>
                                                <td className="border border-gray-300  p-2">
                                                    <input
                                                        type="number"
                                                        name="sim_jatah_3"
                                                        value={
                                                            formData.sim_jatah_3
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        min="0"
                                                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {totalSimJatah.jiwa_3}
                                                </td>
                                            </tr>

                                            {/* Jiwa 4 */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 text-center font-bold">
                                                    4
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {jiwaData.jiwa_4}
                                                </td>
                                                <td className="border border-gray-300  p-2">
                                                    <input
                                                        type="number"
                                                        name="sim_jatah_4"
                                                        value={
                                                            formData.sim_jatah_4
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        min="0"
                                                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {totalSimJatah.jiwa_4}
                                                </td>
                                            </tr>

                                            {/* Jiwa >=5 */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 text-center font-bold">
                                                    ≥5
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center">
                                                    {jiwaData.jiwa_5_plus}
                                                </td>
                                                <td className="border border-gray-300  p-2">
                                                    <input
                                                        type="number"
                                                        name="sim_jatah_5_plus"
                                                        value={
                                                            formData.sim_jatah_5_plus
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        min="0"
                                                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-semibold">
                                                    {totalSimJatah.jiwa_5_plus}
                                                </td>
                                            </tr>

                                            {/* Total Row */}
                                            <tr className="bg-gray-100">
                                                <td
                                                    colSpan="3"
                                                    className="border border-gray-300 p-3 text-center font-bold text-lg"
                                                >
                                                    TOTAL
                                                </td>
                                                <td className="border border-gray-300 p-3 text-center font-bold text-lg">
                                                    {totalKeseluruhan}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    Simpan Formula Jatah
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modal Success */}
                {showSuccess && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="bg-green-100 rounded-full p-4">
                                    <Check
                                        size={48}
                                        className="text-green-600"
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Berhasil!
                            </h3>
                            <p className="text-gray-600">
                                Formula jatah berhasil disimpan
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
