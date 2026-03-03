import { useForm } from '@inertiajs/react';
import { Category } from '@/types';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        price: '',
        stock: '',
        category_id: '',
    });

    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData('name', name);
        setData('slug', generateSlug(name));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };


    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={handleNameChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Product name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block font-medium mb-1">Slug</label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={e => setData('slug', e.target.value)}
                        className="w-full border rounded px-3 py-2 bg-gray-50"
                        placeholder="product-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Price ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Stock</label>
                        <input
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="0"
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
                        <option value="">Select a category</option>
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
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create Product'}
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
