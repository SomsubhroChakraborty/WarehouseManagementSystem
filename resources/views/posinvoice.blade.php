<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>POS Invoice #{{ $sale->invoice_no ?? $sale->id }}</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            padding: 10px;
            background: #f4f4f4;
        }
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid #ccc;
        }
        .header {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: #0F172B;
            color: #fff;
        }
        .brand h1 { font-size: 24px; font-weight: bold; }
        .meta { text-align: right; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(255,255,255,0.25);
            border-radius: 999px;
            font-size: 11px;
        }
        .content { padding: 20px; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .card {
            background: #f9fafb;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 14px;
        }
        .card h3 {
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 8px;
        }
        table { width:100%; border-collapse:collapse; margin-bottom: 20px; }
        thead th {
            background: #1E2937;
            color: white;
            padding: 8px 10px;
            text-align: left;
            font-size: 11px;
        }
        tbody td {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
        }
        .num { text-align:right; }
        .center { text-align:center; }
        .totals {
            width: 340px;
            margin-left: auto;
            border: 1px solid #ddd;
        }
        .totals td { padding: 8px 12px; border-bottom:1px solid #eee; }
        .grand {
            background: #0F172B;
            color: white;
            font-weight: bold;
        }
        .footer {
            padding: 15px 20px;
            text-align: center;
            font-size: 11px;
            color: #666;
            border-top: 1px solid #ddd;
        }

        @media print {
            body { padding:0; margin:0; background:white; }
            .invoice { border:none; box-shadow:none; }
            .no-print { display: none; }
            @page { size: A4 portrait; margin: 8mm; }
        }
    </style>
</head>
<body onload="window.print();">
    <div class="invoice">
        <div class="header">
            <div class="brand">
                <h1>POS INVOICE</h1>
                @isset($company)
                    <p>{{ $company->name ?? 'Your Company Name' }}</p>
                @endisset
            </div>
            <div class="meta">
                <div class="badge">{{ $sale->payment_status ?? 'Paid' }}</div>
                <p><strong>Invoice #:</strong> {{ $sale->invoice_no ?? 'INV-' . str_pad($sale->id, 5, '0', STR_PAD_LEFT) }}</p>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($sale->created_at)->format('d M Y h:i A') }}</p>
            </div>
        </div>

        <div class="content">
            <div class="info-grid">
                <div class="card">
                    <h3>Billed To</h3>
                    <p><strong>{{ $sale->customer->name ?? 'Walk-in Customer' }}</strong></p>
                    @isset($sale->customer->phone)<p>Phone: {{ $sale->customer->phone }}</p>@endisset
                    @isset($sale->customer->address)<p>{{ $sale->customer->address }}</p>@endisset
                </div>
                <div class="card">
                    <h3>Summary</h3>
                    <p>Items: {{ $sale->items->count() }}</p>
                    <p>Payment: {{ ucfirst($sale->payment_method) }}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Variant</th>
                        <th class="center" style="width:60px">Qty</th>
                        <th class="num">Price</th>
                        <th class="num">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($sale->items as $item)
                    <tr>
                        <td>{{ $item->product->name ?? $item->varient?->product?->name ?? 'N/A' }}</td>
                        <td>{{ $item->varient->name ?? '—' }}</td>
                        <td class="center">{{ $item->quantity }}</td>
                        <td class="num">{{ number_format($item->price, 2) }}</td>
                        <td class="num">{{ number_format($item->total ?? $item->quantity * $item->price, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            @php
                $subtotal = $sale->items->sum(fn($item) => $item->total ?? $item->quantity * $item->price);
            @endphp

            <div class="totals">
                <table>
                    <tr><td>Subtotal</td><td class="num">₹{{ number_format($subtotal, 2) }}</td></tr>
                    @if($sale->tax > 0)
                    <tr><td>Tax</td><td class="num">₹{{ number_format($sale->tax, 2) }}</td></tr>
                    @endif
                    @if($sale->discount > 0)
                    <tr><td>Discount</td><td class="num">-₹{{ number_format($sale->discount, 2) }}</td></tr>
                    @endif
                    <tr class="grand">
                        <td><strong>Grand Total</strong></td>
                        <td class="num"><strong>₹{{ number_format($sale->grand_total, 2) }}</strong></td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="footer">
            Thank you for your purchase! Please visit again.
        </div>
    </div>

    <!-- Optional: Print button for desktop (in case auto-print fails) -->
    <div class="no-print" style="text-align:center; margin-top:20px;">
        <button onclick="window.print()" style="padding:10px 20px; font-size:16px;">
            🖨 Print Again
        </button>
    </div>
</body>
</html>