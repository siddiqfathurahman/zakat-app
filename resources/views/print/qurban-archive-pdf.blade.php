<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Lengkap & Arsip Data Qurban - {{ $tahun }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #333;
            line-height: 1.3;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #c2410c;
            padding-bottom: 12px;
            margin-bottom: 15px;
        }
        .header h1 {
            font-size: 16px;
            margin: 0;
            color: #c2410c;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 12px;
            margin: 4px 0 0 0;
            color: #374151;
            font-weight: normal;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 9px;
            color: #6b7280;
        }
        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #c2410c;
            border-left: 3px solid #ea580c;
            padding-left: 6px;
            margin-top: 20px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .grid-summary {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .grid-summary td {
            padding: 6px;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .grid-summary td.label {
            font-weight: bold;
            color: #4b5563;
            width: 40%;
        }
        .grid-summary td.value {
            color: #111827;
            font-size: 11px;
            font-weight: bold;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
            margin-bottom: 15px;
        }
        table.data-table th {
            background-color: #c2410c;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 5px 6px;
            font-size: 9px;
            border: 1px solid #9a3412;
            text-transform: uppercase;
        }
        table.data-table td {
            padding: 5px 6px;
            border: 1px solid #e5e7eb;
            font-size: 9px;
        }
        table.data-table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .page-break {
            page-break-after: always;
        }
        .footer {
            margin-top: 25px;
            font-size: 8px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 8px;
        }
        .badge {
            display: inline-block;
            padding: 2px 4px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 3px;
            text-transform: uppercase;
        }
        .badge-sapi {
            background-color: #dcfce7;
            color: #15803d;
        }
        .badge-kambing {
            background-color: #fef3c7;
            color: #d97706;
        }
        .badge-domba {
            background-color: #e0f2fe;
            color: #0369a1;
        }
    </style>
</head>
<body>

    <!-- HALAMAN 1: COVER & SUMMARY -->
    <div class="header">
        <h1>Laporan Lengkap & Arsip Data Qurban</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }}</h2>
        <p>Masjid Al Anhar - Dihasilkan secara otomatis oleh Sistem Manajemen Qurban</p>
    </div>

    <div class="section-title">Ringkasan Pelaksanaan Qurban</div>
    <table class="grid-summary">
        <tr>
            <td class="label">Total Kantong Daging Qurban</td>
            <td class="value">{{ number_format($summary['total_bungkus'], 0, ',', '.') }} Kantong</td>
        </tr>
        <tr>
            <td class="label">Total Kantong Sapi</td>
            <td class="value">{{ number_format($summary['bungkus_sapi'], 0, ',', '.') }} Kantong</td>
        </tr>
        <tr>
            <td class="label">Total Kantong Kambing</td>
            <td class="value">{{ number_format($summary['bungkus_kambing'], 0, ',', '.') }} Kantong</td>
        </tr>
        <tr>
            <td class="label">Jumlah Sapi Shohibul</td>
            <td class="value">{{ $summary['jumlah_sapi'] }} Ekor</td>
        </tr>
        <tr>
            <td class="label">Jumlah Kambing Shohibul</td>
            <td class="value">{{ $summary['jumlah_kambing'] }} Ekor</td>
        </tr>
        <tr>
            <td class="label">Total Bobot Bersih Daging</td>
            <td class="value">{{ number_format($summary['total_bobot_bersih'], 2, ',', '.') }} Kg</td>
        </tr>
        <tr>
            <td class="label">Total Shohibul Terantar</td>
            <td class="value">{{ $summary['total_terkirim'] }} / {{ $summary['total_shohibul'] }} Shohibul</td>
        </tr>
        <tr>
            <td class="label">Hasil Penjualan Kulit</td>
            <td class="value">Rp {{ number_format($summary['jual_kulit'], 0, ',', '.') }}</td>
        </tr>
        @if($summary['note_kulit'])
        <tr>
            <td class="label">Catatan Penjualan Kulit</td>
            <td class="value" style="font-weight: normal;">{{ $summary['note_kulit'] }}</td>
        </tr>
        @endif
    </table>

    <div class="section-title" style="margin-top: 15px;">Konfigurasi Jadwal & Lokasi Pengambilan</div>
    <table class="grid-summary">
        <tr>
            <td class="label">Tanggal Pengambilan</td>
            <td class="value" style="font-weight: normal;">{{ $setting->tanggal_pengambilan ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Waktu / Jam Pengambilan</td>
            <td class="value" style="font-weight: normal;">{{ $setting->waktu_pengambilan ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Tempat Pengambilan</td>
            <td class="value" style="font-weight: normal;">{{ $setting->tempat_pengambilan ?? '-' }}</td>
        </tr>
    </table>

    <div class="footer">
        Halaman 1 | Laporan Arsip Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- HALAMAN 2: DAFTAR SHOHIBUL QURBAN -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Daftar Shohibul Qurban</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="30%">Nama Shohibul</th>
                <th class="text-center" width="8%">RT</th>
                <th class="text-center" width="8%">RW</th>
                <th class="text-center" width="12%">No. Hewan</th>
                <th class="text-center" width="12%">Jenis Hewan</th>
                <th class="text-center" width="12%">Status Kirim</th>
                <th width="13%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($shohibul as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->rt }}</td>
                    <td class="text-center">{{ $item->rw }}</td>
                    <td class="text-center">{{ $item->nomor_hewan }}</td>
                    <td class="text-center">
                        <span class="badge badge-{{ $item->jenis_hewan }}">
                            {{ $item->jenis_hewan }}
                        </span>
                    </td>
                    <td class="text-center">
                        {{ $item->status_kirim ? 'Terkirim' : 'Belum' }}
                        @if($item->status_kirim && $item->waktu_kirim)
                            <br><span style="font-size: 8px; color: #6b7280;">{{ \Carbon\Carbon::parse($item->waktu_kirim)->format('H:i') }} WIB</span>
                        @endif
                    </td>
                    <td>{{ $item->note ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data shohibul qurban.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Arsip Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- HALAMAN 3: MONITORING REALTIME PEMOTONGAN -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Monitoring Realtime Pemotongan & Penimbangan</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="15%">Jenis Hewan</th>
                <th class="text-center" width="10%">No. Hewan</th>
                <th class="text-center" width="20%">Status Sembelih</th>
                <th class="text-center" width="20%">Status Potong</th>
                <th class="text-center" width="15%">Berat Bersih (Kg)</th>
                <th width="15%">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($realtime as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ ucfirst($item->jenis_hewan) }}</strong></td>
                    <td class="text-center">{{ $item->nomor_hewan }}</td>
                    <td class="text-center">
                        {{ $item->status_sembelih ? 'Selesai' : 'Belum' }}
                        @if($item->status_sembelih && $item->waktu_sembelih)
                            <br><span style="font-size: 8px; color: #6b7280;">{{ \Carbon\Carbon::parse($item->waktu_sembelih)->format('H:i') }} WIB</span>
                        @endif
                    </td>
                    <td class="text-center">
                        {{ $item->status_potong ? 'Selesai' : 'Belum' }}
                        @if($item->status_potong && $item->waktu_potong)
                            <br><span style="font-size: 8px; color: #6b7280;">{{ \Carbon\Carbon::parse($item->waktu_potong)->format('H:i') }} WIB</span>
                        @endif
                    </td>
                    <td class="text-center font-bold">
                        {{ $item->berat_kg ? number_format($item->berat_kg, 2, ',', '.') : '-' }}
                    </td>
                    <td>{{ $item->catatan ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada data realtime monitoring.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Arsip Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- HALAMAN 4: DAFTAR PENERIMA QURBAN -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Daftar Penerima Qurban (Mustahik)</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="35%">Nama Penerima</th>
                <th class="text-center" width="8%">RT</th>
                <th class="text-center" width="8%">RW</th>
                <th class="text-center" width="10%">Agama</th>
                <th class="text-center" width="8%">Jiwa</th>
                <th class="text-center" width="10%">Jatah Sapi</th>
                <th class="text-center" width="10%">Jatah Kambing</th>
                <th class="text-center" width="10%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($penerima as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td class="text-center">{{ $item->rt }}</td>
                    <td class="text-center">{{ $item->rw }}</td>
                    <td class="text-center">{{ ucfirst($item->agama) }}</td>
                    <td class="text-center">{{ $item->jiwa }}</td>
                    <td class="text-center">{{ $item->jatah_sapi ?? 0 }} bks</td>
                    <td class="text-center">{{ $item->jatah_kambing ?? 0 }} bks</td>
                    <td class="text-center">
                        <span style="font-weight: bold; color: {{ $item->status == 'claimed' ? '#16a34a' : ($item->status == 'shohibul' ? '#2563eb' : '#dc2626') }};">
                            {{ ucfirst($item->status) }}
                        </span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center">Tidak ada data penerima qurban.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Arsip Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

    <!-- HALAMAN 5: LEMBAGA & PANITIA -->
    <div class="page-break"></div>

    <div class="header">
        <h1>Jatah Lembaga & Daftar Panitia Qurban</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }} | Masjid Al Anhar</h2>
    </div>

    <div class="section-title">Daftar Jatah Lembaga / Pemohon Luar</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="10%">No</th>
                <th width="50%">Nama Lembaga / Instansi</th>
                <th class="text-center" width="20%">Jatah Sapi (Bungkus)</th>
                <th class="text-center" width="20%">Jatah Kambing (Bungkus)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($lembaga as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama_lembaga }}</strong></td>
                    <td class="text-center">{{ $item->jumlah_sapi }} Bungkus</td>
                    <td class="text-center">{{ $item->jumlah_kambing }} Bungkus</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data jatah lembaga.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title" style="margin-top: 20px;">Daftar Panitia Qurban</div>
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" width="10%">No</th>
                <th width="40%">Nama Panitia</th>
                <th width="30%">Jabatan / Tugas</th>
                <th class="text-center" width="10%">RT / RW</th>
                <th class="text-center" width="10%">Status Jatah</th>
            </tr>
        </thead>
        <tbody>
            @forelse($panitia as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->nama }}</strong></td>
                    <td>{{ $item->jabatan }}</td>
                    <td class="text-center">{{ $item->rt }} / {{ $item->rw }}</td>
                    <td class="text-center">
                        <span style="font-weight: bold; color: {{ $item->sudah_diambil ? '#16a34a' : '#dc2626' }};">
                            {{ $item->sudah_diambil ? 'Diambil' : 'Belum' }}
                        </span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data panitia qurban.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Arsip Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

</body>
</html>
