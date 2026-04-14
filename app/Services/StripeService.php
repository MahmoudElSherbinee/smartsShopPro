<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Payment Intent for an order
     */
    public function createPaymentIntent($order, $paymentMethodId = null)
    {
        try {
            $params = [
                'amount' => (int) round($order->total * 100),
                'currency' => 'usd',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'user_id' => $order->user_id,
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never',
                ],
            ];

            if ($paymentMethodId) {
                $params['payment_method'] = $paymentMethodId;
                $params['confirm'] = true;
            }

            return PaymentIntent::create($params);
        } catch (ApiErrorException $e) {
            throw new \Exception('Stripe Error: ' . $e->getMessage());
        }
    }

    /**
     * Confirm a Payment Intent
     */
    public function confirmPaymentIntent(string $paymentIntentId, string $paymentMethodId): PaymentIntent
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            return $paymentIntent->confirm(['payment_method' => $paymentMethodId]);
        } catch (ApiErrorException $e) {
            throw new \Exception('Stripe Error: ' . $e->getMessage());
        }
    }

    /**
     * Get a Payment Intent by ID
     */
    public function getPaymentIntent(string $paymentIntentId): ?PaymentIntent
    {
        try {
            return PaymentIntent::retrieve($paymentIntentId);
        } catch (ApiErrorException $e) {
            return null;
        }
    }
}
