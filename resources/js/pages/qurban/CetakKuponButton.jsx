import React, { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const CARD_W = 100;
const CARD_H = 60;
const PAGE_W = 329;
const PAGE_H = 483;
const MARGIN = 10;
const GAP_X  = 1;
const GAP_Y  = 1;

const COLS = Math.floor((PAGE_W - MARGIN * 2 + GAP_X) / (CARD_W + GAP_X));
const ROWS = Math.floor((PAGE_H - MARGIN * 2 + GAP_Y) / (CARD_H + GAP_Y));
const PER_PAGE = COLS * ROWS;

const RW_COLORS = {
    "11": { header: [180, 30, 30],  light: [254, 226, 226], border: [220, 50,  50],  accent: [200, 40,  40]  },
    "12": { header: [30,  80,  180], light: [219, 234, 254], border: [59,  130, 246], accent: [37,  99,  235] },
    "13": { header: [20,  120, 60],  light: [220, 252, 231], border: [34,  197, 94],  accent: [22,  163, 74]  },
    default: { header: [60, 60, 60], light: [243, 244, 246], border: [156, 163, 175], accent: [107, 114, 128] },
};

function getRwColor(rw) {
    const key = String(rw).replace(/^0+/, "");
    return RW_COLORS[key] || RW_COLORS["default"];
}

async function genQR(text) {
    // QR selalu hitam
    return await QRCode.toDataURL(text, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#FFFFFF" },
    });
}

async function drawKupon(doc, row, x, y, setting) {
    const c = getRwColor(row.rw);

    // --- Background card ---
    doc.setFillColor(...c.light);
    doc.setDrawColor(...c.border);
    doc.setLineWidth(0.4);
    doc.rect(x, y, CARD_W, CARD_H, "FD");

    // --- Header ---
    doc.setFillColor(...c.header);
    doc.rect(x, y, CARD_W, 18, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("KUPON PENGAMBILAN DAGING QURBAN", x + CARD_W / 2, y + 5.5, { align: "center" });

    doc.setFontSize(8);
    const tgl = setting?.tanggal_pengambilan || "Rabu, 27 Mei 2026";
    const wkt = setting?.waktu_pengambilan || "15.00 - 16.30 WIB";
    doc.text(`${tgl}   |   ${wkt}`, x + CARD_W / 2, y + 11, { align: "center" });

    const tpt = setting?.tempat_pengambilan || "Dalem Mangunjayan";
    doc.text(`Tempat: ${tpt}`, x + CARD_W / 2, y + 15.5, { align: "center" });

    // --- QR Code ---
    const qrImg = await genQR(row.kode_unik);
    const qrSize = 30;
    const qrX = x + 3;
    const qrY = y + 24;
    doc.addImage(qrImg, "PNG", qrX, qrY, qrSize, qrSize);

    // --- Divider ---
    doc.setDrawColor(...c.border);
    doc.setLineWidth(0.2);
    doc.line(x + 36, y + 21, x + 36, y + 57);

    // --- Konten kanan ---
    const cx = x + 40;
    const maxNameW = CARD_W - 40 - 4;

    // Nama
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...c.header);

    let nama = row.nama;
    while (doc.getTextWidth(nama) > maxNameW && nama.length > 1) {
        nama = nama.slice(0, -1);
    }
    if (nama !== row.nama) nama += "…";
    doc.text(nama, cx, y + 27);

    // RT/RW
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`RT ${String(row.rt).padStart(2, "0")} / RW ${String(row.rw).padStart(2, "0")}`, cx, y + 34);

    // Kode unik
    doc.setFillColor(...c.accent);
    doc.roundedRect(cx, y + 37, maxNameW, 6, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(row.kode_unik, cx + maxNameW / 2, y + 41.3, { align: "center" });

    // --- Ketentuan (FIX SPACING) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);

    const ketentuan = [
        "- Dihimbau untuk datang tepat waktu",
        "- Kupon berlaku untuk pengambilan daging qurban",
        "- Simpan dengan baik jangan sampai kupon rusak ",
        "  Hilang bukan tanggung jawab panitia",
    ];

    const lastY = y + 41.3; // posisi terakhir (kode unik)
    let startY = lastY + 6; // jarak antar section

    ketentuan.forEach((item, index) => {
        doc.text(item, cx, startY + (index * 3.2));
    });

    // --- Ornamen ---
    doc.setFillColor(...c.border);
    doc.triangle(
        x + CARD_W - 10, y + CARD_H,
        x + CARD_W,      y + CARD_H - 10,
        x + CARD_W,      y + CARD_H,
        "F"
    );
}

async function generatePDF(penerimas, onProgress, setting) {
    const doc = new jsPDF({ unit: "mm", format: [PAGE_W, PAGE_H], orientation: "portrait" });

    for (let i = 0; i < penerimas.length; i++) {
        if (i > 0 && i % PER_PAGE === 0) {
            doc.addPage([PAGE_W, PAGE_H]);
        }

        const posCol = i % PER_PAGE % COLS;
        const posRow = Math.floor((i % PER_PAGE) / COLS);

        const x = MARGIN + posCol * (CARD_W + GAP_X);
        const y = MARGIN + posRow * (CARD_H + GAP_Y);

        await drawKupon(doc, penerimas[i], x, y, setting);

        if (onProgress) onProgress(Math.round(((i + 1) / penerimas.length) * 100));
    }

    return doc;
}

export default function CetakKuponButton({ penerimas = [], setting = null }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress]         = useState(0);
    const [filterRw, setFilterRw]         = useState("all");

    const rwOptions = [
        { value: "all", label: "Semua RW", color: "#6B7280" },
        { value: "11",  label: "RW 11",    color: "#DC2626" },
        { value: "12",  label: "RW 12",    color: "#2563EB" },
        { value: "13",  label: "RW 13",    color: "#16A34A" },
    ];

    const filtered = filterRw === "all"
        ? penerimas
        : penerimas.filter(r => String(r.rw).replace(/^0+/, "") === filterRw);

    const handleDownload = async () => {
        if (filtered.length === 0) return;
        setIsGenerating(true);
        setProgress(0);
        try {
            const doc = await generatePDF(filtered, setProgress, setting);
            const suffix = filterRw === "all" ? "semua" : `rw${filterRw}`;
            doc.save(`kupon-qurban-${suffix}.pdf`);
        } catch (err) {
            console.error("Gagal generate PDF:", err);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <select
                value={filterRw}                    
                onChange={(e) => setFilterRw(e.target.value)}
                disabled={isGenerating}
                style={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    color: "#374151",
                    background: "white",
                    cursor: "pointer",
                    outline: "none",
                }}
            >
                {rwOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            <button
                onClick={handleDownload}
                disabled={isGenerating || filtered.length === 0}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: isGenerating ? "#9CA3AF" : "#1F2937",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "9px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: isGenerating ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    minWidth: "180px",
                    justifyContent: "center",
                }}
            >
                {isGenerating ? (
                    <>
                        <svg style={{ animation: "spin 1s linear infinite", width: 15, height: 15 }}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m14.95 6.36-.7-.7M6.4 6.4l-.7-.7m12.02 0-.7.7M6.4 17.6l-.7.7" />
                        </svg>
                        Generating… {progress}%
                    </>
                ) : (
                    <>
                        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                        <span style={{
                            background: "rgba(255,255,255,0.2)",
                            borderRadius: "5px",
                            padding: "1px 7px",
                            fontSize: "11px",
                            fontWeight: 500,
                        }}>
                            {filtered.length}
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}   