<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daftar Penerima Zakat</title>
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
            font-size: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            color: #000;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 11px;
        }
        .summary {
            margin-top: 15px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>DAFTAR PENERIMA ZAKAT FITRAH</h2>
        <p>Tahun {{ date('Y') }}</p>
    </div>

    @if(!empty($filterInfo) && count($filterInfo) > 0)
    <div class="filter-info">
        <strong></strong> {{ implode(' | ', $filterInfo) }}
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th>Nama Penerima</th>
                <th class="text-center" width="8%">RT</th>
                <th class="text-center" width="8%">RW</th>
                <th class="text-center" width="12%">Jiwa</th>
                <th class="text-center" width="12%">Jatah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($penerimas as $index => $penerima)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $penerima->nama }}</td>
                <td class="text-center">{{ $penerima->rt }}</td>
                <td class="text-center">{{ $penerima->rw }}</td>
                <td class="text-center">{{ $penerima->jiwa }}</td>
                <td class="text-center">{{ $penerima->jatah ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        Total Penerima: {{ $totalPenerima }} Orang
    </div>
    <div class="summary">
        Total Jatah: {{ $totalJatah }} Bungkus
    </div>

    <div class="footer">
        Dicetak pada: {{ date('d/m/Y H:i:s') }}
    </div>
</body>
</html>