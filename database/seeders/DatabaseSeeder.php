<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = Category::factory(5)->create();

        $products = Product::factory(30)->create();

        $customers = User::factory(10)->create([
            'type' => UserType::CUSTOMER
        ]);

        User::factory(3)->create([
            'type' => UserType::VENDOR
        ]);

        User::factory()->create([
            'name' => 'Mahmoud El Sherbine',
            'email' => 'admin@smartshop.com',
            'type' => UserType::ADMIN
        ]);

        foreach ($customers as $customer) {
            $orders = Order::factory(rand(1, 5))->create([
                'user_id' => $customer->id,
            ]);
            foreach ($orders as $order) {
                $orderProducts = $products->random(rand(1, 4));
                $total = 0;

                foreach ($orderProducts as $product) {
                    $quantity = rand(1, 3);
                    $subtotal = $product->price * $quantity;
                    $total += $subtotal;

                    $order->order_items()->create([
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity' => $quantity,
                        'price' => $product->price,
                    ]);
                }

                $order->update(['total' => $total]);
            }
        }
        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('👑 Admin: admin@smartshop.com / password');
        $this->command->info('🛒 ' . Product::count() . ' products created');
        $this->command->info('📦 ' . Order::count() . ' orders created');
    }
}
