import React, { useEffect } from "react";

export default function SuratKeterangan({ penerima, setting }) {
    useEffect(() => {
        // Auto trigger print dialog saat halaman terbuka
        window.print();
    }, []);

    const today = new Date();
    const tglSurat = today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 2cm 2.5cm;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: "Times New Roman", Times, serif;
                    font-size: 12pt;
                    color: #000;
                    background: white;
                }
                .page {
                    width: 100%;
                    min-height: 100vh;
                    padding: 0;
                    background: white;
                }

                /* JUDUL SURAT */
                .judul-wrapper {
                    text-align: center;
                    margin-bottom: 18px;
                }
                .judul {
                    font-size: 14pt;
                    font-weight: bold;
                    text-decoration: underline;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .nomor-surat {
                    font-size: 10pt;
                    color: #444;
                    margin-top: 4px;
                }

                /* ISI SURAT */
                .pembuka {
                    text-align: justify;
                    line-height: 1.8;
                    margin-bottom: 16px;
                    font-size: 12pt;
                }

                /* DATA PENERIMA */
                .data-box {
                    border: 1.5px solid #000;
                    border-radius: 4px;
                    padding: 14px 18px;
                    margin: 18px 0;
                    background: #fafafa;
                }
                .data-row {
                    display: flex;
                    gap: 0;
                    padding: 5px 0;
                    border-bottom: 1px dotted #ccc;
                    font-size: 11.5pt;
                    align-items: flex-start;
                }
                .data-row:last-child { border-bottom: none; }
                .data-label {
                    width: 180px;
                    flex-shrink: 0;
                    font-weight: normal;
                    color: #222;
                }
                .data-sep { width: 16px; flex-shrink: 0; }
                .data-val { font-weight: bold; flex: 1; }

                /* QR SECTION */
                .qr-section {
                    display: flex;
                    align-items: flex-start;
                    gap: 20px;
                    margin: 16px 0;
                    padding: 14px 18px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: #f9f9f9;
                }
                .qr-img {
                    width: 100px;
                    height: 100px;
                    border: 1.5px solid #999;
                    border-radius: 4px;
                    padding: 3px;
                    background: white;
                    flex-shrink: 0;
                }
                .qr-img img { width: 100%; height: 100%; }
                .qr-info { flex: 1; }
                .qr-kode-label {
                    font-size: 9pt;
                    color: #666;
                    margin-bottom: 4px;
                }
                .qr-kode {
                    font-family: "Courier New", Courier, monospace;
                    font-size: 11pt;
                    font-weight: bold;
                    background: #eee;
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 3px;
                    letter-spacing: 0.06em;
                    border: 1px solid #ccc;
                    margin-bottom: 8px;
                    word-break: break-all;
                }
                .qr-hint {
                    font-size: 9pt;
                    color: #555;
                    line-height: 1.5;
                }

                /* KETERANGAN */
                .keterangan-title {
                    font-size: 11.5pt;
                    font-weight: bold;
                    margin-bottom: 8px;
                    text-decoration: underline;
                }
                .keterangan-list {
                    padding-left: 20px;
                    line-height: 2;
                    font-size: 11.5pt;
                }
                .keterangan-list li { margin-bottom: 2px; }

                /* JATAH BADGE */
                .jatah-row {
                    display: flex;
                    gap: 12px;
                    margin: 14px 0;
                }
                .jatah-card {
                    border: 1.5px solid #000;
                    border-radius: 4px;
                    padding: 8px 18px;
                    text-align: center;
                    min-width: 110px;
                }
                .jatah-card-label { font-size: 9pt; color: #555; }
                .jatah-card-val { font-size: 16pt; font-weight: bold; }
                .jatah-card-unit { font-size: 9pt; color: #666; }

                /* PENUTUP + TTD */
                .penutup {
                    text-align: justify;
                    line-height: 1.8;
                    margin: 18px 0;
                    font-size: 12pt;
                }
                .ttd-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-top: 30px;
                }
                .ttd-block { text-align: center; }
                .ttd-block .ttd-label { font-size: 11pt; margin-bottom: 60px; }
                .ttd-block .ttd-nama {
                    font-size: 11.5pt;
                    font-weight: bold;
                    border-top: 1.5px solid #000;
                    padding-top: 6px;
                    min-width: 160px;
                }
                .ttd-block .ttd-jabatan { font-size: 9.5pt; color: #555; }

                /* Garis pemisah section */
                .section-divider {
                    border: none;
                    border-top: 1px solid #ccc;
                    margin: 16px 0;
                }

                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                }

                /* Tombol print (tidak ikut tercetak) */
                .print-bar {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    display: flex;
                    gap: 10px;
                    z-index: 999;
                }
                .btn-print {
                    background: #b45309;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-close {
                    background: #fff;
                    color: #374151;
                    border: 1.5px solid #d1d5db;
                    border-radius: 10px;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>

            {/* Floating action bar */}
            <div className="print-bar no-print">
                <button className="btn-close" onClick={() => window.close()}>
                    ✕ Tutup
                </button>
                <button className="btn-print" onClick={() => window.print()}>
                    🖨 Cetak Surat
                </button>
            </div>

            <div className="page">

                {/* ── JUDUL ── */}
                <div className="judul-wrapper">
                    <div className="judul">Surat Keterangan Penerima Qurban</div>
                    <div className="nomor-surat">
                        No : SKQ/1447H/{String(penerima.id).padStart(4, "0")}/RW{String(penerima.rw).padStart(2, "0")}
                    </div>
                </div>

                {/* ── PEMBUKA ── */}
                <p className="pembuka">
Panitia Pelaksana Qurban Masjid Al-Anhar 1447 H dengan ini menyatakan bahwa nama yang tercantum di bawah ini adalah penerima daging qurban. Surat ini digunakan sebagai pengganti kupon untuk pengambilan daging qurban.
                </p>

                {/* ── DATA PENERIMA ── */}
                <div className="data-box">
                    {[
                        { label: "Nama Lengkap",   val: penerima.nama },
                        { label: "RT / RW",         val: `RT ${String(penerima.rt).padStart(2,"0")} / RW ${String(penerima.rw).padStart(2,"0")}` },
                        { label: "Jumlah Jiwa",     val: `${penerima.jiwa} jiwa` },
                        { label: "Agama",           val: penerima.agama === "muslim" ? "Islam" : "Non Muslim" },
                        { label: "Status",          val: penerima.status === "claimed" ? "✔ Sudah Mengambil" : penerima.status === "shohibul" ? "Shohibul Qurban" : "Belum Mengambil" },
                    ].map((d) => (
                        <div className="data-row" key={d.label}>
                            <span className="data-label">{d.label}</span>
                            <span className="data-sep">:</span>
                            <span className="data-val">{d.val}</span>
                        </div>
                    ))}
                </div>

                <hr className="section-divider" />

                {/* ── QR CODE ── */}
                <div className="qr-section">
                    <div className="qr-img">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(penerima.kode_unik)}`}
                            alt="QR Code"
                        />
                    </div>
                    <div className="qr-info">
                        <div className="qr-kode-label">Kode Verifikasi</div>
                        <div className="qr-kode">{penerima.kode_unik}</div>
                        <div className="qr-hint">
                            Tunjukkan kode QR ini kepada petugas panitia saat pengambilan daging qurban.
                            Kode ini bersifat unik dan hanya berlaku untuk satu kali pengambilan.
                        </div>
                    </div>
                </div>

                <hr className="section-divider" />

                {/* ── KETERANGAN POINT-POINT ── */}
                <div className="keterangan-title">Ketentuan Pengambilan :</div>
                <ol className="keterangan-list">
                    <li>
                        Pengambilan daging qurban dilaksanakan pada <strong>{setting?.tanggal_pengambilan || '-'}</strong> pukul <strong>{setting?.waktu_pengambilan || '-'}</strong> di <strong>{setting?.tempat_pengambilan || '-'}</strong>.
                    </li>
                    <li>
                        QR Code pada surat ini akan <strong>dipindai oleh petugas</strong> sebagai bukti pengambilan yang sah.
                    </li>
                    <li>
                        Apabila penerima berhalangan hadir, pengambilan dapat <strong>diwakilkan</strong> oleh anggota keluarga satu KK dengan membawa surat ini.
                    </li>
                    <li>
                        Surat keterangan ini hanya berlaku untuk <strong>satu kali pengambilan</strong> dan tidak dapat digandakan.
                    </li>
                    <li>
                        Jatah daging qurban telah disesuaikan berdasarkan jumlah jiwa dalam satu keluarga sesuai ketentuan panitia.
                    </li>
                </ol>

                {/* ── PENUTUP ── */}
                <p className="penutup" style={{ marginTop: 18 }}>
                    Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan
                    sebagaimana mestinya. Semoga ibadah qurban ini membawa keberkahan bagi kita semua.
                </p>

            </div>
        </>
    );
}