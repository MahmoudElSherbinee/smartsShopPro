import { useForm } from '@inertiajs/react';
import { Category, Product } from '@/types';

interface Props {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Stock</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Category</label>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Updating...' : 'Update Product'}
                    </button>

                    <a
                        href="/products"
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
