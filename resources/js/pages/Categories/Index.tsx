import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Category } from '@/types';

interface Props {
    categories: {
        data: Category[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

interface PageProps extends Record<string, any> {
    auth: {
        user: {
            type: string;
        };
    };
}

export default function CategoriesIndex({ categories, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/categories/${id}`);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        router.get('/categories', { search }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h1 className="text-2xl font-bold">Categories</h1>

                                {(user.type === 'admin') && (
                                    <Link
                                        href="/categories/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        + Add Category
                                    </Link>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    defaultValue={filters?.search}
                                    onChange={handleSearch}
                                    className="w-full sm:w-96 border rounded px-3 py-2"
                                />
                            </div>

                            {/* Categories Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                                            {user.type === 'admin' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.data.map(category => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link href={`/categories/${category.id}`} className="text-blue-500 hover:underline">
                                                        {category.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{category.slug}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{category.products_count || 0}</td>
                                                {user.type === 'admin' && (
                                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">

                                                        <Link
                                                            href={`/categories/${category.id}/edit`}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(category.id, category.name)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {categories.links && (
                                <div className="mt-6 flex justify-center space-x-1">
                                    {categories.links.map((link: any, i: number) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 border rounded ${link.active
                                                ? 'bg-blue-500 text-white'
                                                : link.url
                                                    ? 'hover:bg-gray-100'
                                                    : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
