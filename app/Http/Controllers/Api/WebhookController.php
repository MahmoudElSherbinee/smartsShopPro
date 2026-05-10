<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusUpdateMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                $orderId = $paymentIntent->metadata->order_id ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);
                    if ($order) {
                        $oldStatus = $order->status->value;
                        $order->update([
                            'payment_status' => 'paid',
                            'status' => 'processing',
                        ]);
                        Mail::to($order->user->email)->send(new OrderStatusUpdateMail($order, $oldStatus, "processing"));
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                $orderId = $paymentIntent->metadata->order_id ?? null;

                if ($orderId) {
                    Order::where('id', $orderId)->update([
                        'payment_status' => 'failed',
                        'status' => 'cancelled',
                    ]);
                }
                break;
        }

        return response()->json(['status' => 'success']);
    }
}
