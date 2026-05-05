<!DOCTYPE html>
<html>

<head>
    <title>Welcome to SmartShop</title>
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
            <h1>Welcome to SmartShop! 🎉</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <p>Thank you for joining SmartShop. We're excited to have you on board!</p>
            <p>With your account, you can:</p>
            <ul>
                <li>🛍️ Browse thousands of products</li>
                <li>❤️ Save items to your wishlist</li>
                <li>⭐ Write reviews for products you love</li>
                <li>📦 Track your orders in real-time</li>
            </ul>
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/products') }}" class="button">Start Shopping Now</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} SmartShop. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
        </div>
    </div>
</body>

</html>
