<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class DatabaseSeeder extends Seeder
{
    protected $faker;

    public function __construct() {
         $this->faker = FakerFactory::create();
    }
    public function run(): void
    {
        // 1. إنشاء الفئات
        $categories = Category::factory(5)->create();

        // 2. إنشاء المنتجات
        $products = Product::factory(30)->create();

        // 3. إنشاء المستخدمين
        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@smartshop.com',
            'type' => UserType::ADMIN,
        ]);

        User::factory()->create([
            'name' => 'Vendor User',
            'email' => 'vendor@smartshop.com',
            'type' => UserType::VENDOR,
        ]);

        User::factory()->create([
            'name' => 'Customer User',
            'email' => 'customer@smartshop.com',
            'type' => UserType::CUSTOMER,
        ]);

        // Vendors
        $vendors = User::factory(3)->create([
            'type' => UserType::VENDOR,
        ]);

        // Customers
        $customers = User::factory(15)->create([
            'type' => UserType::CUSTOMER,
        ]);

        // 4. إنشاء الطلبات
        foreach ($customers as $customer) {
            $orders = Order::factory(rand(1, 3))->create([
                'user_id' => $customer->id,
            ]);

            foreach ($orders as $order) {
                $orderProducts = $products->random(rand(1, 4));
                $total = 0;

                foreach ($orderProducts as $product) {
                    $quantity = rand(1, 3);
                    $subtotal = $product->price * $quantity;
                    $total += $subtotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity' => $quantity,
                        'price' => $product->price,
                    ]);
                }

                $order->update(['total' => $total]);
            }
        }

        // 5. إنشاء التقييمات (Reviews)
        $this->createReviews($products, $customers);

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('👑 Admin: admin@smartshop.com / password');
        $this->command->info('📦 Products: ' . Product::count());
        $this->command->info('👥 Customers: ' . $customers->count());
        $this->command->info('📝 Reviews: ' . Review::count());
        $this->command->info('⭐ Average rating: ' . round(Review::avg('rating'), 1) . '/5');
    }

    /**
     * Create reviews for products
     */
    private function createReviews($products, $customers): void
    {
        // لكل منتج، نضيف 0-8 تقييمات
        foreach ($products as $product) {
            // عدد عشوائي من التقييمات (0-8)
            $numberOfReviews = rand(0, 8);

            // اختيار مستخدمين عشوائيين للتقييم
            $randomCustomers = $customers->random(min($numberOfReviews, $customers->count()));

            foreach ($randomCustomers as $index => $customer) {
                // تحديد التقييم (مع ميل للتقييمات العالية للمنتجات الجيدة)
                $rating = $this->getRandomRating();

                Review::create([
                    'product_id' => $product->id,
                    'user_id' => $customer->id,
                    'rating' => $rating,
                    'comment' => $this->getCommentByRating($rating),
                    'is_approved' => true,
                    'created_at' => now()->subDays(rand(1, 180)),
                ]);
            }
        }
    }

    /**
     * Get random rating (with bias towards higher ratings)
     */
    private function getRandomRating(): int
    {
        // 1 star: 5%, 2 stars: 10%, 3 stars: 20%, 4 stars: 30%, 5 stars: 35%
        $rand = rand(1, 100);

        if ($rand <= 5) return 1;
        if ($rand <= 15) return 2;
        if ($rand <= 35) return 3;
        if ($rand <= 65) return 4;
        return 5;
    }

    /**
     * Get comment based on rating
     */
    private function getCommentByRating(int $rating): string
    {
        $comments = [
            1 => [
                'Very disappointed with this product.',
                'Poor quality, not worth the money.',
                'Terrible experience, would not recommend.',
                'Product arrived damaged and customer service was unhelpful.',
                'Waste of money, do not buy.',
            ],
            2 => [
                'Below average, expected better.',
                'Not great, has some issues.',
                'Could be better for the price.',
                'Disappointed with the quality.',
                'Not what I expected from the description.',
            ],
            3 => [
                'Average product, nothing special.',
                'Okay for the price, but nothing amazing.',
                'Decent product, does the job.',
                'Neither good nor bad, just okay.',
                'Acceptable quality, but room for improvement.',
            ],
            4 => [
                'Good product, happy with purchase.',
                'Very satisfied, would recommend.',
                'Great value for money.',
                'Works well, good quality.',
                'Impressed with the performance.',
            ],
            5 => [
                'Excellent product! Highly recommended!',
                'Perfect! Exceeded my expectations.',
                'Amazing quality, best purchase ever!',
                'Love it! Will definitely buy again.',
                'Outstanding product, 10/10!',
                'Could not be happier with this purchase!',
            ],
        ];

        return $this->faker->randomElement($comments[$rating]);
    }
}
