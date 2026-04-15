import React, { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// ─── Konstanta ukuran ─────────────────────────────────────────────────────────
const CARD_W = 100;   // mm
const CARD_H = 60;    // mm
const PAGE_W = 329;   // mm  A3+
const PAGE_H = 483;   // mm  A3+
const MARGIN = 10;    // mm  margin kiri/atas
const GAP_X  = 4;    // mm  jarak antar kupon horizontal
const GAP_Y  = 4;    // mm  jarak antar kupon vertikal

// Berapa kupon per baris & kolom
const COLS = Math.floor((PAGE_W - MARGIN * 2 + GAP_X) / (CARD_W + GAP_X)); // = 3
const ROWS = Math.floor((PAGE_H - MARGIN * 2 + GAP_Y) / (CARD_H + GAP_Y)); // = 7
const PER_PAGE = COLS * ROWS; // = 21

// ─── Peta warna per RW ───────────────────────────────────────────────────────
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

// ─── Helper: generate QR sebagai dataURL ─────────────────────────────────────
async function genQR(text, color) {
    const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
    return await QRCode.toDataURL(text, {
        width: 200,
        margin: 1,
        color: { dark: hex(color.accent), light: "#FFFFFF" },
    });
}

// ─── Gambar satu kupon ke canvas jsPDF ───────────────────────────────────────
async function drawKupon(doc, row, x, y, setting) {
    const c = getRwColor(row.rw);

    // --- Background card ---
    doc.setFillColor(...c.light);
    doc.setDrawColor(...c.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, CARD_W, CARD_H, 3, 3, "FD");

    // --- Header strip ---
    doc.setFillColor(...c.header);
    doc.roundedRect(x, y, CARD_W, 18, 3, 3, "F");
    // tutup sudut bawah header agar lurus
    doc.rect(x, y + 15, CARD_W, 3, "F");

    // Teks header
    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("KUPON PENGAMBILAN DAGING QURBAN", x + CARD_W / 2, y + 5.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    
    // Dynamic Jadwal
    const tgl = setting?.tanggal_pengambilan || "Rabu, 27 Mei 2026";
    const wkt = setting?.waktu_pengambilan || "15.00 - 16.30 WIB";
    doc.text(`${tgl}   |   ${wkt}`, x + CARD_W / 2, y + 10.5, { align: "center" });

    doc.setFontSize(6);
    // Dynamic Tempat
    const tpt = setting?.tempat_pengambilan || "Dalem Mangunjayan";
    doc.text(`Tempat : ${tpt}`, x + CARD_W / 2, y + 15, { align: "center" });

    // --- QR Code ---
    const qrImg = await genQR(row.kode_unik, c);
    const qrSize = 26;
    const qrX = x + 5;
    const qrY = y + 21;
    doc.addImage(qrImg, "PNG", qrX, qrY, qrSize, qrSize);

    // Garis pembatas tipis di kanan QR
    doc.setDrawColor(...c.border);
    doc.setLineWidth(0.2);
    doc.line(x + 36, y + 21, x + 36, y + 53);

    // --- Konten kanan ---
    const cx = x + 40; // content x start

    // Nama
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...c.header);

    // Truncate nama jika terlalu panjang
    const maxNameW = CARD_W - 40 - 4;
    let nama = row.nama;
    while (doc.getTextWidth(nama) > maxNameW && nama.length > 1) {
        nama = nama.slice(0, -1);
    }
    if (nama !== row.nama) nama += "…";

    doc.text(nama, cx, y + 28);

    // RT/RW
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`RT ${String(row.rt).padStart(2, "0")} / RW ${String(row.rw).padStart(2, "0")}`, cx, y + 35);

    // Kode unik — kotak kecil dengan background
    doc.setFillColor(...c.accent);
    doc.roundedRect(cx, y + 38, maxNameW, 6, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(row.kode_unik, cx + maxNameW / 2, y + 42.3, { align: "center" });

    // Label jiwa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`Jumlah Jiwa : ${row.jiwa}`, cx, y + 50);

    // --- Ornamen sudut kanan bawah (segitiga dekoratif) ---
    doc.setFillColor(...c.border);
    // Segitiga kecil di pojok kanan bawah
    doc.triangle(
        x + CARD_W - 10, y + CARD_H,
        x + CARD_W,      y + CARD_H - 10,
        x + CARD_W,      y + CARD_H,
        "F"
    );

    // Nomor urut kecil di pojok kiri bawah
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(...c.border);
}

// ─── Main: generate semua halaman ────────────────────────────────────────────
async function generatePDF(penerimas, onProgress, setting) {
    const doc = new jsPDF({ unit: "mm", format: [PAGE_W, PAGE_H], orientation: "portrait" });

    let col = 0;
    let row_idx = 0;
    let pageNum = 0;

    for (let i = 0; i < penerimas.length; i++) {
        if (i > 0 && i % PER_PAGE === 0) {
            doc.addPage([PAGE_W, PAGE_H]);
            col = 0;
            row_idx = 0;
            pageNum++;
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

// ─── Komponen ─────────────────────────────────────────────────────────────────
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
            {/* Filter RW */}
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

            {/* Tombol Download */}
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
                        {/* Spinner */}
                        <svg
                            style={{ animation: "spin 1s linear infinite", width: 15, height: 15 }}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        >
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m14.95 6.36-.7-.7M6.4 6.4l-.7-.7m12.02 0-.7.7M6.4 17.6l-.7.7" />
                        </svg>
                        Generating… {progress}%
                    </>
                ) : (
                    <>
                        {/* Download icon */}
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