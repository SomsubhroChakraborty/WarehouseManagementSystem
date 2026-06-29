<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Marchent Invoice #{{ $quotation->id ?? '' }}</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            font-family: Arial, sans-serif;
            font-size: 11.5px;
            line-height: 1.3;
            padding: 8px;
            background: #f4f4f4;
        }
        .invoice {
            max-width: 1100px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #ccc;
        }
        .header {
            display: flex;
            justify-content: space-between;
            padding: 14px 24px 10px;
            background: #404142;
            color: #fff;
        }
        .brand h1 { font-size: 22px; font-weight: bold; }
        .meta { text-align: right; font-size: 12px; }
        .badge {
            display: inline-block;
            padding: 3px 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 999px;
            font-size: 10.5px;
            margin-bottom: 6px;
        }
        .content { padding: 14px 24px 12px; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 14px;
        }
        .card {
           background: #f9fafb;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 15px;
    min-height: 90px;
    font-size: 13px;
        }
        .card h3 {
            font-size: 10px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 6px;
        }
        .status{
            display:flex;
            flex-direction:row;
        }
        .table-wrap {
            border: 1px solid #ddd;
            overflow: hidden;
            margin-bottom: 12px;
            display:flex;
            justify-content:flex-end;
        }
        table { width:100%; border-collapse:collapse; }
        thead th {
            background: #424346;
            color: white;
            padding: 6px 10px; 
            font-size: 10.5px;
            text-transform: uppercase;
        }
        tbody td {
            padding: 6px 10px;
            border-bottom: 1px solid #eee;
        }
        .num { text-align:right; white-space:nowrap; }
        .center { text-align:center; }
        .totals-wrap { display:flex; justify-content:flex-end; }
        .totals {
            width: 320px;
            border: 1px solid #ddd;
            font-size: 12px;
            margin-left:auto;
        }
        .totals td { padding: 6px 12px; border-bottom:1px solid #eee; }
        .grand {
            background: #3d3d3e;
            color: white;
            font-weight: bold;
        }
        .footer {
            padding: 10px 24px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #ddd;
        }
        @media print {
            body { padding:0; margin:0; background:white; }
            .invoice { border:none; box-shadow:none; }
            @page { size: A4 portrait; margin: 8mm; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div class="brand">
                <h1>MARCHENT INVOICE</h1>
                @isset($company)<p>{{ $company->name ?? '' }}</p>@endisset
            </div>
            <div class="meta">
            <div class="badge">{{ $quotation->payment_status ?? 'Pending' }}</div></div>
                <p><strong>Invoice #:</strong>
           INV-{{ str_pad($quotation->id, 5, '0', STR_PAD_LEFT) }} | 
                   {{ \Carbon\Carbon::parse($quotation->date)->format('d M Y') }}</p>
            </div>
        </div>

        <div class="content">
            <div class="info-grid">
                <div class="card">
                    <h3>Billed To</h3>
                    <p><strong>{{ $quotation->customer->name }}</strong></p>
                    @isset($quotation->customer->email)<p>{{ $quotation->customer->email }}</p>@endisset
                    @isset($quotation->customer->phone)<p>{{ $quotation->customer->phone }}</p>@endisset
                    @isset($quotation->customer->address)<p style="font-size:11px">{{ $quotation->customer->address }}</p>@endisset
                </div>
                <div class="card">
                    <h3>Summary</h3>
                    <p>Items: {{ $quotation->items->count() }} | Tax: {{ number_format($quotation->tax ?? 0, 2) }} | Disc: {{ number_format($quotation->discount ?? 0, 2) }}</p>
                </div>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Variant</th>
                            <th class="center" style="width:55px">Qty</th>
                            <th class="num">Price</th>
                            <th class="num">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($quotation->items as $item)
                        <tr>
                            <td>{{ $item->varient->product->name }}</td>
                            <td>{{ $item->varient->name }}</td>
                            <td class="center">{{ $item->quantity }}</td>
                            <td class="num">{{ number_format($item->price, 2) }}</td>
                            <td class="num">{{ number_format($item->quantity * $item->price, 2) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @php
                $subtotal = $quotation->items->sum(fn($item) => $item->quantity * $item->price);
                $tax = $quotation->tax ?? 0;
                $discount = $quotation->discount ?? 0;
                $grandTotal = $subtotal + $tax - $discount;
            @endphp

            <div class="totals-wrap ">
                <div class="totals">
                    <table>
                        <tr><td>Subtotal</td><td class="num">{{ number_format($subtotal, 2) }}</td></tr>
                        <tr><td>Tax</td><td class="num">{{ number_format($tax, 2) }}</td></tr>
                        <tr><td>Discount</td><td class="num">-{{ number_format($discount, 2) }}</td></tr>
                        <tr class="grand"><td>Grand Total</td><td class="num">{{ number_format($grandTotal, 2) }}</td></tr>
                    </table>
                </div>
            </div>
        </div>

        <div class="footer">
            Thank you for your business.
        </div>
    </div>
</body>
</html>