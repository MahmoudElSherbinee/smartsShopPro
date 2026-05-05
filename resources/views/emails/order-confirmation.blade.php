<!DOCTYPE html>
<html>

<head>
    <title>Order Confirmation #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: #10B981;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
            background: #f9fafb;
        }

        .order-details {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }

        .item {
            border-bottom: 1px solid #e5e7eb;
            padding: 10px 0;
        }

        .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 15px;
        }

        .button {
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6B7280;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed! ✅</h1>
            <p>Order #{{ $order->order_number }}</p>
        </div>
        <div class="content">
            <h2>Hello {{ $order->user->name }},</h2>
            <p>Thank you for your order! We've received your order and will process it shortly.</p>

            <div class="order-details">
                <h3>Order Summary</h3>
                @foreach ($order->order_items as $item)
                    <div class="item">
                        <strong>{{ $item->product_name }}</strong><br>
                        Quantity: {{ $item->quantity }} × ${{ number_format($item->price, 2) }}
                        <span style="float: right;">${{ number_format($item->quantity * $item->price, 2) }}</span>
                    </div>
                @endforeach
                <div class="total">
                    Total: ${{ number_format($order->total, 2) }}
                </div>
            </div>

            <div class="order-details">
                <h3>Shipping Information</h3>
                <p>
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_city }}<br>
                    Phone: {{ $order->shipping_phone }}
                </p>
            </div>

            <p style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/orders/' . $order->id) }}" class="button">Track Your Order</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} SmartShop. All rights reserved.</p>
            <p>Questions? Contact us at support@smartshop.com</p>
        </div>
    </div>
</body>

</html>
