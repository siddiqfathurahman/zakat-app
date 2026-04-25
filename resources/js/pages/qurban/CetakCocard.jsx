import React, { useState } from "react";
import jsPDF from "jspdf";

// ─── Dimensi & Layout ────────────────────────────────────────────────────────
const CARD_W  = 90;   // lebar kartu (mm)
const CARD_H  = 55;   // tinggi kartu (mm)
const PAGE_W  = 329;  // lebar kertas A3+ (mm)
const PAGE_H  = 483;  // tinggi kertas A3+ (mm)
const MARGIN  = 10;   // margin tepi (mm)
const GAP_X   = 1;    // jarak horizontal antar kartu (mm)
const GAP_Y   = 1;    // jarak vertikal antar kartu (mm)

const COLS     = Math.floor((PAGE_W - MARGIN * 2 + GAP_X) / (CARD_W + GAP_X)); // 3
const ROWS     = Math.floor((PAGE_H - MARGIN * 2 + GAP_Y) / (CARD_H + GAP_Y)); // 8
const PER_PAGE = COLS * ROWS; // 24 kartu per halaman

// ─── Warna per RW ────────────────────────────────────────────────────────────
const RW_COLORS = {
    "11": { navy: [30,  42,  74],  accent: [194, 65, 12]  }, // Merah
    "12": { navy: [30,  42,  74],  accent: [194, 65, 12]  }, // Biru
    "13": { navy: [30,  42,  74],  accent: [194, 65, 12]  }, // Hijau
    default: { navy: [30,  42,  74],  accent: [194, 65, 12]  } , // Coklat (fallback)
};

function getRwColor(rw) {
    const key = String(rw).replace(/^0+/, "");
    return RW_COLORS[key] ?? RW_COLORS["default"];
}

// Potong teks agar tidak melebihi lebar maxW (mm)
function fitText(doc, text, maxW) {
    let t = String(text);
    while (doc.getTextWidth(t) > maxW && t.length > 1) t = t.slice(0, -1);
    if (t !== String(text)) t += "…";
    return t;
}

// ─── Gambar satu kartu cocard ─────────────────────────────────────────────────
function drawCocard(doc, row, x, y) {
    const c = getRwColor(row.rw);
    const r = 0; // sudut rounded (mm)

    // Background navy
    doc.setFillColor(...c.navy);
    doc.roundedRect(x, y, CARD_W, CARD_H, r, r, "F");

    // Stripe kiri dekoratif
    doc.setFillColor(...c.accent);
    doc.setGState(doc.GState({ opacity: 0.45 }));
    doc.rect(x, y, 4, CARD_H, "F");
    doc.setGState(doc.GState({ opacity: 1 }));

    // ── Header ───────────────────────────────────────────────────────────────
    const HEADER_H = 16;
    doc.setFillColor(...c.accent);
    doc.roundedRect(x, y, CARD_W, HEADER_H, r, r, "F");
    // tutup sudut bawah header agar rata
    doc.rect(x, y + HEADER_H - r, CARD_W, r, "F");

    // Judul header — tengah
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
        "PANITIA QURBAN MASJID AL ANHAR",
        x + CARD_W / 2,
        y + 7,
        { align: "center" }
    );

    // Sub judul tahun
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("1447H / 2026", x + CARD_W / 2, y + 13, { align: "center" });

    // ── Kotak Nama (PUTIH) ────────────────────────────────────────────────────
    const BOX_PADDING = 7;
    const FOOTER_H    = 9;
    const boxX = x + BOX_PADDING;
    const boxY = y + HEADER_H + 3;
    const boxW = CARD_W - BOX_PADDING * 2;
    const boxH = CARD_H - HEADER_H - 3 - FOOTER_H - 2;
    const boxCX = boxX + boxW / 2;

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "F");

    // Nama — HITAM BOLD
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(10, 10, 10);
    const namaFit = fitText(doc, row.nama, boxW - 4);
    doc.text(namaFit, boxCX, boxY + 8, { align: "center" });

    // RT / RW — HITAM BOLD
    doc.setFontSize(12);
    doc.setTextColor(10, 10, 10);
    doc.text(
        `RT ${String(row.rt).padStart(2, "0")} / RW ${String(row.rw).padStart(2, "0")}`,
        boxCX,
        boxY + 15,
        { align: "center" }
    );

    // Jabatan / Bidang — abu kecil
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(10, 10, 10);
    const jabFit = fitText(doc, row.jabatan, boxW - 4);
    doc.text(jabFit, boxCX, boxY + 21, { align: "center" });

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = y + CARD_H - FOOTER_H;
    doc.setFillColor(0, 0, 0);
    doc.setGState(doc.GState({ opacity: 0.4 }));
    doc.rect(x, footerY, CARD_W, FOOTER_H, "F");
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(
        "Cocard ini wajib dibawa sebagai bukti pengambilan jatah panitia di sekretariat",
        x + CARD_W / 2,
        footerY + 5.5,
        { align: "center" }
    );

}

// ─── Generate PDF ─────────────────────────────────────────────────────────────
async function generatePDF(data, onProgress) {
    const doc = new jsPDF({
        unit:        "mm",
        format:      [PAGE_W, PAGE_H],
        orientation: "portrait",
    });

    for (let i = 0; i < data.length; i++) {
        if (i > 0 && i % PER_PAGE === 0) doc.addPage([PAGE_W, PAGE_H]);

        const slot = i % PER_PAGE;
        const col  = slot % COLS;
        const row  = Math.floor(slot / COLS);
        const x    = MARGIN + col * (CARD_W + GAP_X);
        const y    = MARGIN + row * (CARD_H + GAP_Y);

        drawCocard(doc, data[i], x, y);

        if (onProgress) onProgress(Math.round(((i + 1) / data.length) * 100));
    }

    return doc;
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function CetakCocard({ panitiaqurbans = [] }) {
    const [generating, setGenerating] = useState(false);
    const [progress,   setProgress]   = useState(0);
    const [filterRw,   setFilterRw]   = useState("all");

    const rwOptions = [
        { value: "all", label: "Semua RW" },
        { value: "11",  label: "RW 11"    },
        { value: "12",  label: "RW 12"    },
        { value: "13",  label: "RW 13"    },
    ];

    const filtered =
        filterRw === "all"
            ? panitiaqurbans
            : panitiaqurbans.filter(
                  (r) => String(r.rw).replace(/^0+/, "") === filterRw
              );

    const handleDownload = async () => {
        if (!filtered.length) return;
        setGenerating(true);
        setProgress(0);
        try {
            const doc    = await generatePDF(filtered, setProgress);
            const suffix = filterRw === "all" ? "semua" : `rw${filterRw}`;
            doc.save(`cocard-panitia-${suffix}.pdf`);
        } catch (err) {
            console.error("Gagal generate PDF:", err);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setGenerating(false);
            setProgress(0);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}> 

            {/* Tombol Download */}
            <button
                onClick={handleDownload}
                disabled={generating || filtered.length === 0}
                style={{
                    display:         "flex",
                    alignItems:      "center",
                    gap:             "8px",
                    background:      generating ? "#9CA3AF" : "#1F2937",
                    color:           "white",
                    border:          "none",
                    borderRadius:    "8px",
                    padding:         "9px 18px",
                    fontSize:        "13px",
                    fontWeight:      600,
                    cursor:          generating ? "not-allowed" : "pointer",
                    transition:      "background 0.2s",
                    minWidth:        "200px",
                    justifyContent:  "center",
                }}
            >
                {generating ? (
                    <>
                        <svg
                            style={{ animation: "spin 1s linear infinite", width: 15, height: 15 }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m14.95 6.36-.7-.7M6.4 6.4l-.7-.7m12.02 0-.7.7M6.4 17.6l-.7.7"
                            />
                        </svg>
                        Generating… {progress}%
                    </>
                ) : (
                    <>
                        <svg
                            width={15}
                            height={15}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Cetak Cocard
                        <span
                            style={{
                                background:   "rgba(255,255,255,0.2)",
                                borderRadius: "5px",
                                padding:      "1px 7px",
                                fontSize:     "11px",
                                fontWeight:   500,
                            }}
                        >
                            {filtered.length}
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}   