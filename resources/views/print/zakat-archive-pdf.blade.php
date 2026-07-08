<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan & Arsip Data Zakat Fitrah - {{ $tahun }}</title>
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
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .page-break {
            page-break-after: always;
        }
        .footer {
            margin-top: 30px;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 10px;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .badge-uang {
            background-color: #fef3c7;
            color: #d97706;
        }
        .badge-beras {
            background-color: #dcfce7;
            color: #15803d;
        }
    </style>
</head>
<body>

    <!-- COVER / SUMMARY PAGE -->
    <div class="header">
        <h1>Laporan & Arsip Data Zakat Fitrah</h1>
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

    <div class="section-title" style="margin-top: 15px;">Konfigurasi Jatah Distribusi</div>
    <table class="data-table">
        <thead>
            <tr>
                <th>Jumlah Jiwa dalam Keluarga</th>
                <th class="text-center">Jatah Paket Zakat (Bungkus)</th>
            </tr>
        </thead>
        <tbody>
            @if(isset($formula) && $formula)
                <tr>
                    <td>1 Jiwa</td>
                    <td class="text-center">{{ $formula->sim_jatah_1 }} Bungkus</td>
                </tr>
                <tr>
                    <td>2 Jiwa</td>
                    <td class="text-center">{{ $formula->sim_jatah_2 }} Bungkus</td>
                </tr>
                <tr>
                    <td>3 Jiwa</td>
                    <td class="text-center">{{ $formula->sim_jatah_3 }} Bungkus</td>
                </tr>
                <tr>
                    <td>4 Jiwa</td>
                    <td class="text-center">{{ $formula->sim_jatah_4 }} Bungkus</td>
                </tr>
                <tr>
                    <td>5 Jiwa atau Lebih</td>
                    <td class="text-center">{{ $formula->sim_jatah_5_plus }} Bungkus</td>
                </tr>
            @else
                <tr>
                    <td colspan="2" class="text-center">Data konfigurasi formula tidak tersedia.</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        Halaman 1 | Arsip Zakat Fitrah {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- PAGE BREAK FOR DATA PEMBAYAR -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Daftar Pembayar Zakat (Muzakki)</h1>
        <h2>Tahun Ramadhan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="30%">Nama Muzakki</th>
                <th class="text-center" width="8%">RT</th>
                <th class="text-center" width="8%">RW</th>
                <th class="text-center" width="10%">Jml Jiwa</th>
                <th class="text-center" width="12%">Metode</th>
                <th class="text-right" width="15%">Total Zakat</th>
                <th class="text-right" width="12%">Sodaqoh</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pembayar as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->rt }}</td>
                    <td class="text-center">{{ $item->rw }}</td>
                    <td class="text-center">{{ $item->jumlah_jiwa }}</td>
                    <td class="text-center">
                        <span class="badge badge-{{ $item->melalui }}">
                            {{ $item->melalui }}
                        </span>
                    </td>
                    <td class="text-right">
                        @if($item->melalui == 'uang')
                            Rp {{ number_format($item->total, 0, ',', '.') }}
                        @else
                            {{ number_format($item->total, 1, ',', '.') }} kg
                        @endif
                    </td>
                    <td class="text-right">
                        Rp {{ number_format($item->sodaqoh ?? 0, 0, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data pembayar zakat.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Arsip Zakat Fitrah {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- PAGE BREAK FOR DATA PENERIMA -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Daftar Penerima Zakat (Mustahik)</h1>
        <h2>Tahun Ramadhan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="45%">Nama Mustahik</th>
                <th class="text-center" width="10%">RT</th>
                <th class="text-center" width="10%">RW</th>
                <th class="text-center" width="15%">Jumlah Jiwa</th>
                <th class="text-center" width="15%">Jatah Paket</th>
            </tr>
        </thead>
        <tbody>
            @forelse($penerima as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->rt }}</td>
                    <td class="text-center">{{ $item->rw }}</td>
                    <td class="text-center">{{ $item->jiwa }}</td>
                    <td class="text-center">{{ $item->jatah ?? '-' }} Bungkus</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center">Tidak ada data penerima zakat.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Arsip Zakat Fitrah {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- PAGE BREAK FOR PEMOHON LUAR & BELANJA -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Pemohon Zakat Luar & Laporan Belanja</h1>
        <h2>Tahun Ramadhan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <div class="section-title">Daftar Pemohon Zakat Luar</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="35%">Nama Pemohon / Instansi</th>
                <th class="text-center" width="20%">Permintaan</th>
                <th class="text-center" width="15%">Jatah</th>
                <th width="25%">No HP / Kontak</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pemohon as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->permintaan ?? '-' }}</td>
                    <td class="text-center">{{ $item->jatah ?? '-' }} Paket</td>
                    <td>{{ $item->no_hp ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data pemohon luar.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title" style="margin-top: 25px;">Laporan Belanja Beras</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="25%">Nama Panitia</th>
                <th class="text-center" width="15%">Tanggal</th>
                <th class="text-center" width="12%">Jml Sak</th>
                <th class="text-right" width="15%">Harga / Sak</th>
                <th class="text-right" width="15%">Total Belanja</th>
                <th width="13%">Nama Penjual</th>
            </tr>
        </thead>
        <tbody>
            @forelse($belanja as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->panitia }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') }}</td>
                    <td class="text-center">{{ $item->jumlah_sak }} Sak</td>
                    <td class="text-right">Rp {{ number_format($item->harga_per_sak, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->total_belanja, 0, ',', '.') }}</td>
                    <td>{{ $item->nama_penjual }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada data laporan belanja.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Arsip Zakat Fitrah {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

</body>
</html>
