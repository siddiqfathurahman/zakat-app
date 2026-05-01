<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daftar Penerima Qurban</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 16px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .header p {
            font-size: 12px;
        }
        .filter-info {
            font-size: 11px;
            margin-bottom: 14px;
            color: #444;
        }
        .filter-info span {
            font-weight: bold;
            color: #000;
        }

        /* ── group header (RT/RW) ── */
        .group-header {
            background-color: #e5e5e5;
            font-weight: bold;
            font-size: 12px;
            padding: 5px 8px;
            margin-top: 16px;
            margin-bottom: 0;
            border: 1px solid #999;
            border-bottom: none;
        }

        /* ── label pembeda section non-muslim ── */
        .section-label {
            font-size: 12px;
            font-weight: bold;
            margin-top: 24px;
            margin-bottom: 6px;
            padding: 4px 8px;
            background-color: #d0d0d0;
            border: 1px solid #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px 7px;
            text-align: left;
        }
        th {
            font-weight: bold;
            text-align: center;
            background-color: #f1f1f1;
        }
        td.center { text-align: center; }

        tr:nth-child(even) td {
            background-color: #f9f9f9;
        }

        .summary {
            margin-top: 18px;
            font-size: 12px;
            font-weight: bold;
            line-height: 1.7;
        }

        .footer {
            margin-top: 20px;
            font-size: 10px;
            color: #555;
            text-align: right;
        }

        /* ── tombol cetak (hanya muncul di layar, tidak di print) ── */
        .print-bar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
        }
        .btn-print {
            background-color: #1a1a1a;
            color: #fff;
            border: none;
            padding: 8px 20px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            letter-spacing: 0.3px;
        }
        .btn-print:hover { background-color: #333; }

        @media print {
            body { margin: 10px; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

    {{-- Tombol cetak (hilang saat print) --}}
    <div class="print-bar no-print">
        <span style="font-size:12px; color:#666;">Klik tombol untuk mencetak halaman ini</span>
        <button class="btn-print" onclick="window.print()">🖨️ Cetak</button>
    </div>

    <div class="header">
        <h1>Daftar Penerima Qurban</h1>
        <p>Idul Adha {{ date('Y') }}</p>
    </div>



    @php
        $muslims = $penerimas->where('agama', 'muslim')->values();
        $nonmuslims = $penerimas->where('agama', 'nonmuslim')->values();

        // Group muslim by RT
        $muslimGroups = $muslims->groupBy('rt')->sortKeys();
    @endphp

    @if($muslims->count() > 0)

        @foreach($muslimGroups as $rt => $rows)
            @php
                $rw = $rows->first()->rw;
            @endphp

            <div class="group-header">RT {{ $rt }} / RW {{ $rw }}</div>

            <table>
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th>Nama</th>
                        <th width="8%">Jiwa</th>
                        <th width="18%">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($rows as $i => $row)
                    <tr>
                        <td class="center">{{ $i + 1 }}</td>
                        <td>{{ $row->nama }}</td>
                        <td class="center">{{ $row->jiwa }}</td>
                        <td class="center" style="text-transform: capitalize;">Muslim</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @endforeach

    @endif

    @if($nonmuslims->count() > 0)

        @php
            $nonmuslimGroups = $nonmuslims->groupBy('rt')->sortKeys();
        @endphp

        @foreach($nonmuslimGroups as $rt => $rows)
            @php
                $rw = $rows->first()->rw;
            @endphp

            <div class="group-header">NON MUSLIM</div>

            <table>
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th>Nama</th>
                        <th width="8%">Jiwa</th>
                        <th width="18%">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($rows as $i => $row)
                    <tr>
                        <td class="center">{{ $i + 1 }}</td>
                        <td>{{ $row->nama }}</td>
                        <td class="center">{{ $row->jiwa }}</td>
                        <td class="center">Non Muslim</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @endforeach

    @endif

</body>
</html>
