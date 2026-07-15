<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Ringkasan Hasil Pengelolaan Qurban - {{ $tahun }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #c2410c;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            color: #c2410c;
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
            color: #c2410c;
            border-left: 3px solid #ea580c;
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
            background-color: #c2410c;
            color: white;
            font-weight: bold;
            text-align: left;
            padding: 6px 8px;
            font-size: 10px;
            border: 1px solid #9a3412;
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
        .progress-bar-container {
            width: 100%;
            background-color: #e5e7eb;
            border-radius: 4px;
            height: 10px;
            overflow: hidden;
            margin-top: 2px;
        }
        .progress-bar {
            height: 100%;
            border-radius: 4px;
        }
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
        <h1>Laporan Ringkasan Hasil Pengelolaan Qurban</h1>
        <h2>Tahun Pelaksanaan: {{ $tahun }}</h2>
        <p>Masjid Al Anhar - Dihasilkan secara otomatis oleh Sistem Manajemen Qurban</p>
    </div>

    <div class="section-title">1. Total Kantong Daging Qurban</div>
    <table class="grid-summary">
        <tr>
            <td class="label">Total Kantong Terdistribusi</td>
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
    </table>

    <div class="section-title">2. Laporan Pemotongan & Penimbangan</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="30%">Jenis Hewan</th>
                <th class="text-center" width="20%">Status Pemotongan</th>
                <th class="text-center" width="25%">Status Penimbangan</th>
                <th class="text-center" width="25%">Waktu Selesai Sembelih</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pemotongan as $idx => $p)
                <tr>
                    <td><strong>{{ $p['hewan'] }}</strong></td>
                    <td class="text-center">{{ $p['selesai'] }} / {{ $p['total'] }} Ekor</td>
                    <td class="text-center">{{ $penimbangan[$idx]['selesai'] }} / {{ $penimbangan[$idx]['total'] }} Ekor</td>
                    <td class="text-center">{{ $p['waktu'] ? $p['waktu'] . ' WIB' : '-' }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="4" style="background-color: #fffbeb;">
                    <strong>Total Bobot Bersih Daging:</strong> {{ number_format($summary['total_bobot_bersih'], 1, ',', '.') }} Kg
                </td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">3. Pengiriman Shohibul</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="30%">Wilayah</th>
                <th class="text-center" width="30%">Status Pengiriman (Terkirim / Total)</th>
                <th class="text-center" width="40%">Progres</th>
            </tr>
        </thead>
        <tbody>
            @forelse($shohibulRT as $r)
                @php
                    $pct = $r['total'] > 0 ? round(($r['terkirim'] / $r['total']) * 100) : 0;
                @endphp
                <tr>
                    <td>{{ $r['rt'] }}</td>
                    <td class="text-center">{{ $r['terkirim'] }} / {{ $r['total'] }} Shohibul</td>
                    <td>
                        <div style="font-weight: bold; margin-bottom: 2px;">{{ $pct }}%</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: {{ $pct }}%; background-color: #0d4f3c;"></div>
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center">Tidak ada data pengiriman shohibul.</td>
                </tr>
            @endforelse
            <tr style="background-color: #f0fdf4;">
                <td colspan="3">
                    <strong>Total Shohibul Terantar:</strong> {{ $summary['total_terkirim'] }} / {{ $summary['total_shohibul'] }} Orang
                </td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">4. Laporan Distribusi Penerima Wilayah (RT)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th width="30%">Wilayah</th>
                <th class="text-center" width="30%">Jatah Didistribusikan</th>
                <th class="text-center" width="40%">Persentase & Progres Distribusi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($distribusiRT as $d)
                <tr>
                    <td>{{ $d['rt'] }}</td>
                    <td class="text-center">Sapi: {{ $d['sapi'] }} | Kambing: {{ $d['kambing'] }}</td>
                    <td>
                        <div style="font-weight: bold; margin-bottom: 2px;">{{ $d['pct'] }}%</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: {{ $d['pct'] }}%; background-color: #b8924a;"></div>
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" class="text-center">Tidak ada data distribusi wilayah.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">5. Hasil Penjualan Kulit</div>
    <table class="grid-summary">
        <tr>
            <td class="label">Total Hasil Penjualan Kulit</td>
            <td class="value">Rp {{ number_format($summary['jual_kulit'], 0, ',', '.') }}</td>
        </tr>
        @if($summary['note_kulit'])
        <tr>
            <td class="label">Keterangan / Catatan</td>
            <td class="value" style="font-size: 11px; font-weight: normal;">{{ $summary['note_kulit'] }}</td>
        </tr>
        @endif
    </table>

    <div class="footer">
        Laporan Ringkasan Hasil Pengelolaan Qurban {{ $tahun }} | Tanggal Cetak: {{ date('d/m/Y H:i:s') }}
    </div>

</body>
</html>
