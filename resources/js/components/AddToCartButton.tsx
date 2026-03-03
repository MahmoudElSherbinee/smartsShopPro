import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    productId: number;
    stock: number;
}

export default function AddToCartButton({ productId, stock }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const handleAddToCart = () => {
        setAdding(true);
        router.post(`/cart/add/${productId}`, { quantity }, {
            onFinish: () => setAdding(false)
        });
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1"
                disabled={adding}
            >
                {[...Array(Math.min(10, stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>
            <button
                onClick={handleAddToCart}
                disabled={adding || stock === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {adding ? 'Adding...' : 'Add to Cart'}
            </button>
        </div>
    );
}
