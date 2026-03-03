import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
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
        post('/categories');
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Category</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={handleNameChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Category name"
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
                        placeholder="category-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
                    {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {processing ? 'Creating...' : 'Create Category'}
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
