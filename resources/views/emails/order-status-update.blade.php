<!DOCTYPE html>
<html>

<head>
    <title>Order Status Update - #{{ $order->order_number }}</title>
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
            background: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
            background: #f9fafb;
        }

        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 9999px;
            font-weight: bold;
        }

        .status-pending {
            background: #FEF3C7;
            color: #92400E;
        }

        .status-processing {
            background: #DBEAFE;
            color: #1E40AF;
        }

        .status-shipped {
            background: #E0E7FF;
            color: #3730A3;
        }

        .status-delivered {
            background: #D1FAE5;
            color: #065F46;
        }

        .status-cancelled {
            background: #FEE2E2;
            color: #991B1B;
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
            <h1>Order Status Update 🔔</h1>
            <p>Order #{{ $order->order_number }}</p>
        </div>
        <div class="content">
            <h2>Hello {{ $order->user->name }},</h2>
            <p>Your order status has been updated!</p>

            <div style="text-align: center; margin: 30px 0;">
                <div class="status-badge status-{{ $oldStatus }}">
                    ❌ {{ ucfirst($oldStatus) }}
                </div>
                <div style="font-size: 30px; margin: 10px;">→</div>
                <div class="status-badge status-{{ $newStatus }}">
                    ✅ {{ ucfirst($newStatus) }}
                </div>
            </div>

            <p>What does this mean?</p>
            <ul>
                @if ($newStatus === 'processing')
                    <li>✅ Your order has been confirmed and is being prepared for shipping.</li>
                @elseif($newStatus === 'shipped')
                    <li>🚚 Your order is on the way! You'll receive tracking info soon.</li>
                @elseif($newStatus === 'delivered')
                    <li>📦 Your order has been delivered. Enjoy your purchase!</li>
                @elseif($newStatus === 'cancelled')
                    <li>❌ Your order has been cancelled. Any charges will be refunded.</li>
                @endif
            </ul>

            <p style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/orders/' . $order->id) }}" class="button">View Order Details</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} SmartShop. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
