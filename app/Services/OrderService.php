<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmationMail;
use App\Mail\OrderStatusUpdateMail;
use Illuminate\Support\Facades\Mail;

class OrderService
{
    public function createOrder($user, $cart, $shippingData, $paymentMethod = 'cod')
    {
        DB::beginTransaction();
        try {
            $total = $this->calculateTotal($cart);
            $orderNumber = $this->createOrderNumber();

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'status' => OrderStatus::PENDING,
                'total' => $total,
                'shipping_address' =>  $shippingData['address'],
                'shipping_city' => $shippingData['city'],
                'shipping_phone' => $shippingData['phone'],
                'notes' => $shippingData['notes'] ?? null,
                'payment_method' => $paymentMethod,
                'payment_status' => 'pending',
            ]);

            foreach ($cart as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}.
                                             Available: {$product->stock},
                                             Requested: {$item['quantity']}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
                $product->decrement('stock', $item['quantity']);
            }

            if ($paymentMethod === 'cod') {
                $order->update([
                    'status' => 'processing',
                    'payment_status' => 'pending'
                ]);
            } else {
                $order->update([
                    'status' => 'pending',
                    'payment_status' => 'pending'
                ]);
            }

            DB::commit();

            Mail::to($user->email)->send(new OrderConfirmationMail($order));
            return $order->load(['order_items', 'user']);
        } catch (\Exception $e) {

            DB::rollBack();
            Log::error('Order creation failed:', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'cart' => $cart
            ]);
            throw $e;
        }
    }
    private function calculateTotal($cart)
    {
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }

    private function createOrderNumber()
    {
        return 'ORD-' . strtoupper(uniqid());
    }


    public function cancelOrder($order)
    {
        DB::beginTransaction();

        try {
            foreach ($order->order_items as $item) {
                $item->product->increment('stock', $item->quantity);
            }
            $order->update(['status' => OrderStatus::CANCELLED]);

            DB::commit();
            Log::info('Order cancelled successfully:', ['order_id' => $order->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order cancellation failed:', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function updateStatus(Order $order, $newStatus)
    {
        DB::beginTransaction();

        try {
            $newStatusEnum = OrderStatus::from($newStatus);
            $oldStatus = $order->status->value;
            if ($newStatusEnum === OrderStatus::CANCELLED && $order->status !== OrderStatus::CANCELLED) {
                foreach ($order->order_items as $item) {
                    $item->product->increment('stock', $item->quantity);
                }
            }
            $order->update(['status' => $newStatusEnum]);

            DB::commit();
            Mail::to($order->user->email)->send(new OrderStatusUpdateMail($order, $oldStatus, $newStatus));
            Log::info('Order status updated:', [
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order status update failed:', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
