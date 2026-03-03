<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = ['order_number', 'status', 'user_id', 'total', 'shipping_address', 'shipping_phone', 'shipping_city', 'notes'];

    public static array $status = [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
