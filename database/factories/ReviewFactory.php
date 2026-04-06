<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $comments = [
            'Excellent product! Highly recommended.',
            'Good quality, fast shipping.',
            'Average product, not what I expected.',
            'Great value for money.',
            'Poor quality, disappointed.',
            'Amazing! Will buy again.',
            'Works perfectly, exactly as described.',
            'Delivery was late but product is good.',
            'Not worth the price.',
            'Very satisfied with my purchase.',
            'The best product I have ever bought!',
            'Does the job, nothing special.',
            'Fantastic customer service!',
            'Product arrived damaged.',
            'Exceeded my expectations!',
        ];

        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->randomElement($comments),
            'is_approved' => true,
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the review is not approved.
     */
    public function unapproved(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_approved' => false,
        ]);
    }

    /**
     * Indicate that the review has a specific rating.
     */
    public function rating(int $rating): static
    {
        return $this->state(fn(array $attributes) => [
            'rating' => $rating,
        ]);
    }
}
