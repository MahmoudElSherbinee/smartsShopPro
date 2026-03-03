import { useForm } from '@inertiajs/react';
import { Category } from '@/types';

interface Props {
    category: Category;
}

export default function Edit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        slug: category.slug || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

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

                <div>
                    <label className="block font-medium mb-1">Slug</label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={e => setData('slug', e.target.value)}
                        className="w-full border rounded px-3 py-2 bg-gray-50"
                    />
                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        {processing ? 'Updating...' : 'Update Category'}
                    </button>

                    <a
                        href="/categories"
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </a>
                </div>
            </form>
        </div>
    );
}
