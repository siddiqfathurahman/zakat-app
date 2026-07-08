<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Ringkasan Zakat Fitrah - {{ $tahun }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #16a34a;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #15803d;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 14px;
            margin: 5px 0 0 0;
            color: #374151;
            font-weight: normal;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 10px;
            color: #6b7280;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #15803d;
            border-left: 3px solid #16a34a;
            padding-left: 8px;
            margin-top: 25px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .grid-summary {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .grid-summary td {
            padding: 8px;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .grid-summary td.label {
            font-weight: bold;
            color: #4b5563;
            width: 35%;
        }
        .grid-summary td.value {
            color: #111827;
            font-size: 12px;
            font-weight: bold;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        table.data-table th {
            background-color: #16a34a;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 6px 8px;
            font-size: 10px;
            border: 1px solid #15803d;
            text-transform: uppercase;
        }
        table.data-table td {
            padding: 6px 8px;
            border: 1px solid #e5e7eb;
            font-size: 10px;
        }
        table.data-table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer {
            margin-top: 30px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Laporan Ringkasan Zakat Fitrah</h1>
        <h2>Tahun Ramadhan: {{ $tahun }}</h2>
        <p>Masjid Al Anhar - Dihasilkan secara otomatis oleh Sistem Manajemen Zakat</p>
    </div>

    <div class="section-title">Ringkasan Pengelolaan Zakat</div>
    <table class="grid-summary">
        <tr>
            <td class="label">Total Pembayaran Zakat (Uang)</td>
            <td class="value">Rp {{ number_format($summary['total_uang'], 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Total Pembayaran Zakat (Beras)</td>
            <td class="value">{{ number_format($summary['total_beras'], 1, ',', '.') }} kg</td>
        </tr>
        <tr>
            <td class="label">Total Penerimaan Sodaqoh</td>
            <td class="value">Rp {{ number_format($summary['total_sodaqoh'], 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Jumlah Pembayar (Muzakki)</td>
            <td class="value">{{ $summary['jumlah_pembayar'] }} Orang</td>
        </tr>
        <tr>
            <td class="label">Jumlah Penerima (Mustahik)</td>
            <td class="value">{{ $summary['jumlah_penerima'] }} Kepala Keluarga</td>
        </tr>
        <tr>
            <td class="label">Total Bungkus/Paket Terdistribusi</td>
            <td class="value">{{ $summary['total_bungkus'] }} Paket</td>
        </tr>
        <tr>
            <td class="label">Sisa Pembagian Zakat</td>
            <td class="value">{{ $summary['sisa_pembagian'] }} Paket</td>
        </tr>
        <tr>
            <td class="label">Total Pemohon Luar</td>
            <td class="value">{{ $summary['jumlah_pemohon'] }} Instansi / Pemohon</td>
        </tr>
        <tr>
            <td class="label">Total Belanja Beras</td>
            <td class="value">Rp {{ number_format($summary['total_belanja'], 0, ',', '.') }}</td>
        </tr>
    </table>

    <div class="section-title">Daftar Pemohon Zakat Luar</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="8%">No</th>
                <th width="70%">Nama Instansi / Lembaga</th>
                <th class="text-center" width="22%">Jatah</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pemohon as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->jatah ?? '-' }} Paket</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center">Tidak ada data pemohon luar.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Ringkasan Zakat Fitrah {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

</body>
</html>