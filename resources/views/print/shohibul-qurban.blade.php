<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daftar Shohibul Qurban</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 5px 0;
        }
        .filter-info {
            font-size: 12px;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            color: #000;
            font-weight: bold;
            text-align: center;
            background-color: #f1f1f1;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 11px;
        }
        .summary {
            margin-top: 20px;
            font-size: 12px;
            line-height: 1.6;
            font-weight: bold;
        }
    </style>
</head>
<body onload="window.print()">
    <div class="header">
        <h2>DAFTAR SHOHIBUL QURBAN</h2>
        <p>Idul Adha {{ date('Y') }}</p>
    </div>

    @if(!empty($filterInfo) && count($filterInfo) > 0)
    @endif

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th>Nama Shohibul</th>
                <th>Panitia / PJ</th>
                <th width="12%">RT/RW</th>
                <th width="15%">Jenis Hewan</th>
                <th width="12%">No. Hewan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($shohibuls as $index => $row)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $row->nama }}</td>
                <td>{{ $row->panitia ?? '-' }}</td>
                <td class="text-center">{{ $row->rt }}/{{ $row->rw }}</td>
                <td class="text-center" style="text-transform: capitalize;">{{ $row->jenis_hewan }}</td>
                <td class="text-center">{{ $row->nomor_hewan }}</td>
            </tr>
            @endforeach

            @if(count($shohibuls) == 0)
            <tr>
                <td colspan="6" class="text-center" style="padding: 20px;">Belum ada data shohibul qurban</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="summary">
        <div>Total Data Shohibul: {{ $stats['total'] }} Peserta</div>
        <div>Total Sapi: {{ $stats['sapi'] }} Peserta</div>
        <div>Total Kambing: {{ $stats['kambing'] }} Peserta</div>
    </div>

    <div class="footer">
        Dicetak pada: {{ date('d/m/Y H:i:s') }}
        <div style="margin-top: 5px;">Zakat App System</div>
    </div>
</body>
</html>
