import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import QurbanLayout from '../../Layout/QurbanLayout';

export default function FormulaQurban({ jiwaStats, formulaQurban }) {
    const { flash } = usePage().props;

    const [form, setForm] = useState({
        total_bungkus_sapi:      formulaQurban?.total_bungkus_sapi      || 0,
        total_bungkus_kambing:   formulaQurban?.total_bungkus_kambing   || 0,
        sim_sapi_1:              formulaQurban?.sim_sapi_1              || 0,
        sim_kambing_1:           formulaQurban?.sim_kambing_1           || 0,
        sim_sapi_2:              formulaQurban?.sim_sapi_2              || 0,
        sim_kambing_2:           formulaQurban?.sim_kambing_2           || 0,
        sim_sapi_3:              formulaQurban?.sim_sapi_3              || 0,
        sim_kambing_3:           formulaQurban?.sim_kambing_3           || 0,
        sim_sapi_4:              formulaQurban?.sim_sapi_4              || 0,
        sim_kambing_4:           formulaQurban?.sim_kambing_4           || 0,
        sim_sapi_5_plus:         formulaQurban?.sim_sapi_5_plus         || 0,
        sim_kambing_5_plus:      formulaQurban?.sim_kambing_5_plus      || 0,
        sim_sapi_nonmuslim:      formulaQurban?.sim_sapi_nonmuslim      || 0,
        sim_kambing_nonmuslim:   formulaQurban?.sim_kambing_nonmuslim   || 0,
    });

    const [totals, setTotals] = useState({
        sapi:    { t1:0, t2:0, t3:0, t4:0, t5:0, tnon:0, keseluruhan:0, sisa:0 },
        kambing: { t1:0, t2:0, t3:0, t4:0, t5:0, tnon:0, keseluruhan:0, sisa:0 },
    });

    useEffect(() => {
        const c1   = parseInt(jiwaStats?.count_1)        || 0;
        const c2   = parseInt(jiwaStats?.count_2)        || 0;
        const c3   = parseInt(jiwaStats?.count_3)        || 0;
        const c4   = parseInt(jiwaStats?.count_4)        || 0;
        const c5   = parseInt(jiwaStats?.count_5_plus)   || 0;
        const cnon = parseInt(jiwaStats?.count_nonmuslim)|| 0;

        const ts1=form.sim_sapi_1*c1, ts2=form.sim_sapi_2*c2, ts3=form.sim_sapi_3*c3,
              ts4=form.sim_sapi_4*c4, ts5=form.sim_sapi_5_plus*c5, tsnon=form.sim_sapi_nonmuslim*cnon;
        const totalS = ts1+ts2+ts3+ts4+ts5+tsnon;

        const tk1=form.sim_kambing_1*c1, tk2=form.sim_kambing_2*c2, tk3=form.sim_kambing_3*c3,
              tk4=form.sim_kambing_4*c4, tk5=form.sim_kambing_5_plus*c5, tknon=form.sim_kambing_nonmuslim*cnon;
        const totalK = tk1+tk2+tk3+tk4+tk5+tknon;

        setTotals({
            sapi:    { t1:ts1,t2:ts2,t3:ts3,t4:ts4,t5:ts5,tnon:tsnon, keseluruhan:totalS, sisa:form.total_bungkus_sapi-totalS },
            kambing: { t1:tk1,t2:tk2,t3:tk3,t4:tk4,t5:tk5,tnon:tknon, keseluruhan:totalK, sisa:form.total_bungkus_kambing-totalK },
        });
    }, [form, jiwaStats]);

    const handleForm = e => setForm({ ...form, [e.target.name]: parseInt(e.target.value) || 0 });

    const submit = e => {
        e.preventDefault();
        const payload = {
            ...form,
            count_1:         jiwaStats?.count_1         || 0,
            count_2:         jiwaStats?.count_2         || 0,
            count_3:         jiwaStats?.count_3         || 0,
            count_4:         jiwaStats?.count_4         || 0,
            count_5_plus:    jiwaStats?.count_5_plus    || 0,
            count_nonmuslim: jiwaStats?.count_nonmuslim || 0,
        };
        if (totals.sapi.sisa < 0 || totals.kambing.sisa < 0) {
            alert('Tidak boleh negatif');
            return;
        }
        router.post('/qurban/input/formula/store', payload);
    };

    const populations = [
        { label:'1',   sub:'', count:jiwaStats?.count_1||0,        nameS:'sim_sapi_1',           nameK:'sim_kambing_1',           vS:form.sim_sapi_1,          vK:form.sim_kambing_1,          tS:totals.sapi.t1,   tK:totals.kambing.t1   },
        { label:'2',   sub:'', count:jiwaStats?.count_2||0,        nameS:'sim_sapi_2',           nameK:'sim_kambing_2',           vS:form.sim_sapi_2,          vK:form.sim_kambing_2,          tS:totals.sapi.t2,   tK:totals.kambing.t2   },
        { label:'3',   sub:'', count:jiwaStats?.count_3||0,        nameS:'sim_sapi_3',           nameK:'sim_kambing_3',           vS:form.sim_sapi_3,          vK:form.sim_kambing_3,          tS:totals.sapi.t3,   tK:totals.kambing.t3   },
        { label:'4',   sub:'', count:jiwaStats?.count_4||0,        nameS:'sim_sapi_4',           nameK:'sim_kambing_4',           vS:form.sim_sapi_4,          vK:form.sim_kambing_4,          tS:totals.sapi.t4,   tK:totals.kambing.t4   },
        { label:'≥5',  sub:'', count:jiwaStats?.count_5_plus||0,   nameS:'sim_sapi_5_plus',      nameK:'sim_kambing_5_plus',      vS:form.sim_sapi_5_plus,     vK:form.sim_kambing_5_plus,     tS:totals.sapi.t5,   tK:totals.kambing.t5   },
        { label:'Non Muslim',sub:'',      count:jiwaStats?.count_nonmuslim||0, nameS:'sim_sapi_nonmuslim',   nameK:'sim_kambing_nonmuslim',   vS:form.sim_sapi_nonmuslim,  vK:form.sim_kambing_nonmuslim,  tS:totals.sapi.tnon, tK:totals.kambing.tnon },
    ];

    const StatBox = ({ label, val, accent }) => (
        <div className={`rounded-xl border-2 ${accent} bg-orange-50 p-5 flex flex-col items-center justify-center text-center`}>
            <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
            <p className="text-4xl font-black font-semibold text-gray-900">{val}</p>
        </div>
    );

    const inputCls = "w-20 border border-gray-300 rounded-lg text-center px-2 py-1.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 bg-white mx-auto block";

    return (
        <QurbanLayout>
            {/* Page Header */}
            <div className="bg-orange-700 rounded-2xl px-6 py-5 mb-6 text-white">
                <h1 className="text-xl font-bold">Formula Jatah Qurban</h1>
                <p className="text-orange-100 text-sm mt-1">Simulasi & atur jatah daging sapi dan kambing berdasarkan jumlah jiwa penerima sebelum diimplementasikan.</p>
            </div>

            {flash?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    ✅ {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">

                {/* ── Stat Boxes ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatBox label="Jumlah Total Bungkus Sapi"    val={form.total_bungkus_sapi}    accent="border-orange-300 p-6" />
                    <StatBox label="Jumlah Total Bungkus Kambing" val={form.total_bungkus_kambing} accent="border-green-300"  />
                    <StatBox label="Sisa Sapi / Kambing"
                        val={`${totals.sapi.sisa < 0 ? '⚠ ' : ''}${totals.sapi.sisa} / ${totals.kambing.sisa < 0 ? '⚠ ' : ''}${totals.kambing.sisa}`}
                        accent={totals.sapi.sisa < 0 || totals.kambing.sisa < 0 ? 'border-red-400' : 'border-blue-300'}
                    />
                </div>

                {/* ── Input Total Bungkus ── */}
               <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-orange-500 rounded-full inline-block"></span>
                        Input Total Bungkus Tersedia
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-2 block">
                                Total Bungkus Sapi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                name="total_bungkus_sapi"
                                value={form.total_bungkus_sapi}
                                onChange={handleForm}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-2 block">
                                Total Bungkus Kambing <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                name="total_bungkus_kambing"
                                value={form.total_bungkus_kambing}
                                onChange={handleForm}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Formula Table ── */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden pb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-orange-700 text-white">
                                    <th rowSpan="2" className="px-5 py-3 text-center text-lg font-semibold uppercase tracking-wide border-r border-orange-500/40">
                                        JIWA
                                    </th>
                                    <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide border-r border-orange-500/40">
                                        Jumlah<br/>Data
                                    </th>
                                    <th colSpan="2" className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-orange-500/40 border-r border-orange-500/40">
                                        Sim. Jatah / KK
                                    </th>
                                    <th colSpan="2" className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide border-b border-orange-500/40">
                                        Total Sim. Jatah
                                    </th>
                                </tr>
                                <tr className="bg-orange-700 text-white">
                                    <th className="px-4 py-2 text-center text-xs font-medium border-r border-orange-500/40">
                                         Sapi
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium border-r border-orange-500/40">
                                         Kambing
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium border-r border-orange-500/40">
                                         Sapi
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium">
                                         Kambing
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=" divide-gray-100">
                                {populations.map((pop, idx) => (
                                    <tr key={idx} className={`hover:bg-orange-50/40 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                                        <td className="px-5 py-3.5 border-r border-gray-100 text-center">
                                            <span className="font-semibold text-gray-800">{pop.label}</span>
                                            {pop.sub && <span className="ml-1.5 text-xs text-gray-400">({pop.sub})</span>}
                                        </td>
                                        <td className="px-4 py-3.5 text-center font-bold text-gray-700 bg-gray-50 border-r border-gray-100">
                                            {pop.count}
                                        </td>
                                        <td className="px-4 py-3 text-center border-r border-gray-100">
                                            <input type="number" min="0" name={pop.nameS} value={pop.vS} onChange={handleForm} className={inputCls} />
                                        </td>
                                        <td className="px-4 py-3 text-center border-r border-gray-100">
                                            <input type="number" min="0" name={pop.nameK} value={pop.vK} onChange={handleForm} className={inputCls} />
                                        </td>
                                        <td className="px-4 py-3.5 text-center border-r border-gray-100">
                                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-lg font-bold text-sm min-w-[2.5rem]">{pop.tS}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold text-sm min-w-[2.5rem]">{pop.tK}</span>
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td colSpan="6" className="h-4"></td>
                                </tr>

                                {/* Total Sapi Row */}
                                <tr className="border-white">
                                    <td colSpan="4" className="px-5 py-3.5 text-right font-bold text-gray-700 text-sm uppercase tracking-wide border-r border-orange-100">
                                        Total Keseluruhan Sapi 
                                    </td>
                                    <td className="px-4 py-3.5 text-center border-r border-orange-100">
                                        <span className="inline-block px-3 py-1.5 bg-orange-700 text-white rounded-lg font-bold text-sm">{totals.sapi.keseluruhan}</span>
                                    </td>
                                    <td className={`px-4 py-3.5 text-center`}>
                                        <span className={`inline-block px-3 py-1.5 rounded-lg font-bold text-sm ${totals.sapi.sisa < 0 ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-800'}`}>
                                            Sisa: {totals.sapi.sisa}
                                        </span>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="6" className="h-4"></td>
                                </tr>

                                {/* Total Kambing Row */}
                                <tr className="p-4 border-white">
                                    <td colSpan="4" className="px-5 py-3.5 text-right font-bold text-gray-700 text-sm uppercase tracking-wide border-r border-green-100">
                                        Total Keseluruhan Kambing 
                                    </td>
                                    <td className="px-4 py-3.5 text-center border-r border-green-100">
                                        <span className="inline-block px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold text-sm">{totals.kambing.keseluruhan}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={`inline-block px-3 py-1.5 rounded-lg font-bold text-sm ${totals.kambing.sisa < 0 ? 'bg-red-500 text-white' : 'bg-teal-100 text-teal-800'}`}>
                                            Sisa: {totals.kambing.sisa}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Warning jika sisa negatif ── */}
                {(totals.sapi.sisa < 0 || totals.kambing.sisa < 0) && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <span>
                            <strong>Perhatian!</strong> Total simulasi melebihi stok yang tersedia.
                            {totals.sapi.sisa < 0    && <span> Sapi kurang <strong>{Math.abs(totals.sapi.sisa)}</strong> bungkus.</span>}
                            {totals.kambing.sisa < 0 && <span> Kambing kurang <strong>{Math.abs(totals.kambing.sisa)}</strong> bungkus.</span>}
                            {' '}Sesuaikan simulasi jatah atau tambah stok sebelum menyimpan.
                        </span>
                    </div>
                )}

                {/* ── Submit ── */}
                <div className="flex justify-end pt-2 pb-4">
                    <button type="submit"
                        className="flex items-center gap-2 bg-orange-700 hover:bg-orange-700 active:scale-[0.98] text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Terapkan Formula Jatah Qurban
                    </button>
                </div>
            </form>
        </QurbanLayout>
    );
}