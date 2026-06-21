import React, { useState } from "react";
import AppLayout from "../Layout/AppLayout";
import { QrCode, Landmark, Copy, Check, ArrowRight } from "lucide-react";
 
const qrisImage = "/qralanhar.jpeg";
 
const bankAccount = {
  bankName: "Transfer Bank (BSI)",
  bankNote: "Manual verifikasi oleh admin",
  bankLabel: "BANK SYARIAH INDONESIA",
  accountNumber: "7123456789",
  accountName: "Masjid Al Anhar",
};
 
const InfaqDonasi = () => {
  const [copied, setCopied] = useState(false);
 
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin nomor rekening", err);
    }
  };
 
  return (
    <AppLayout>
      <div className="w-full">
        <section className="min-h-screen bg-gray-50 px-4 py-10 md:px-6">
          <div className="mx-auto max-w-lg">
            <div className="text-center">
              <h1 className="mt-3 text-4xl font-bold font-second text-primary">
                Infaq Operasional
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Mari bersama memakmurkan rumah Allah dengan kontribusi
                terbaik Anda. Setiap rupiah adalah keberkahan.
              </p>
            </div>
 
            <h2 className="mb-3 mt-8 text-sm font-second font-bold text-primary">
              Metode Pembayaran
            </h2>
 
            <div className="rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/70">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                  <QrCode className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    QRIS – Scan &amp; Pay
                  </p>
                  <p className="text-xs text-gray-400">
                    Mendukung GoPay, OVO, Dana, LinkAja, &amp; Mobile Banking
                  </p>
                </div>
              </div>
 
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
                <img
                  src={qrisImage}
                  alt="QRIS Masjid Al Anhar"
                  className="w-full object-contain"
                />
              </div>
 
              <p className="mt-4 text-center text-xs text-gray-400">
                Scan kode QR di atas melalui aplikasi pembayaran Anda
              </p>
            </div>
 
            <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/70">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                  <Landmark className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {bankAccount.bankName}
                  </p>
                  <p className="text-xs text-gray-400">{bankAccount.bankNote}</p>
                </div>
              </div>
 
              <div className="mt-4 rounded-xl bg-emerald-50/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wide text-gray-500">
                    {bankAccount.bankLabel}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
                    <Landmark className="h-3.5 w-3.5" />
                  </span>
                </div>
 
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400">Nomor Rekening</p>
                    <p className="text-lg font-bold tracking-wide text-primary">
                      {bankAccount.accountNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-semibold text-second transition hover:opacity-80"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Salin
                      </>
                    )}
                  </button>
                </div>
 
                <div className="mt-3">
                  <p className="text-[11px] text-gray-400">Atas Nama</p>
                  <p className="text-sm font-bold text-gray-900">
                    {bankAccount.accountName}
                  </p>
                </div>
              </div>
            </div>
 
            <a
            href="https://wa.me/628112690998"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
            >
            Konfirmasi Pembayaran
            <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
 
export default InfaqDonasi;