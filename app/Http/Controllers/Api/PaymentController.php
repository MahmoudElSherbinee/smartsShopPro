<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


use function Pest\Laravel\json;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);
        $order = Order::findOrFail($request->order_id);
        if ($order->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        if ($order->payment_status === 'paid') {
            return response()->json(['error' => 'Order already paid'], 422);
        }

        try {
            $paymentIntent = $this->stripeService->createPaymentIntent($order);
            Log::info('Creating payment intent for order', ['order_id' => $order->id, 'amount' => $order->total]);

            $order->update([
                'transaction_id' => $paymentIntent->id,
                'payment_method' => 'stripe',
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
