import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
    products_count: number;
}

interface Filters {
    search?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    rating?: string;
    sort?: string;
    in_stock?: boolean;
}

interface Props {
    filters: Filters;
    categories: Category[];
    total: number;
}

export default function ProductFilters({ filters, categories, total }: Props) {
    const [localFilters, setLocalFilters] = useState<Filters>(filters);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        setLocalFilters(filters);
        setPriceRange({
            min: filters.min_price || '',
            max: filters.max_price || '',
        });
    }, [filters]);

    const applyFilters = () => {
        const params: any = { ...localFilters };

        // إزالة القيم الفارغة
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get('/products', params, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({});
        setPriceRange({ min: '', max: '' });
        router.get('/products', {}, { preserveState: true });
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        setPriceRange(prev => ({ ...prev, [type]: value }));
        setLocalFilters(prev => ({ ...prev, [`${type}_price`]: value }));
    };

    const ratingOptions = [
        { value: '4', label: '★★★★ & up (4+)' },
        { value: '3', label: '★★★ & up (3+)' },
        { value: '2', label: '★★ & up (2+)' },
        { value: '1', label: '★ & up (1+)' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'rating_desc', label: 'Best Rating' },
    ];

    return (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <input
                    type="text"
                    value={localFilters.search || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    placeholder="Search products..."
                    className="w-full border rounded-lg px-4 py-2"
                />
            </div>

            {/* Categories */}
            <div>
                <label className="block text-sm font-medium mb-1">Categories</label>
                <select
                    value={localFilters.category || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.products_count})
                        </option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        className="w-1/2 border rounded-lg px-3 py-2"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        className="w-1/2 border rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <label className="block text-sm font-medium mb-1">Minimum Rating</label>
                <select
                    value={localFilters.rating || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, rating: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                >
                    <option value="">Any Rating</option>
                    {ratingOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* In Stock Only */}
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localFilters.in_stock || false}
                        onChange={(e) => setLocalFilters({ ...localFilters, in_stock: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <span className="text-sm">In Stock Only</span>
                </label>
            </div>

            {/* Sort By */}
            <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <select
                    value={localFilters.sort || ''}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setLocalFilters({ ...localFilters, sort: newSort });
                        // تطبيق الفلاتر مباشرة
                        const params: any = { ...localFilters, sort: newSort };
                        // إزالة القيم الفارغة
                        Object.keys(params).forEach(key => {
                            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                                delete params[key];
                            }
                        });
                        router.get('/products', params, { preserveState: true });
                    }}
                    className="w-full border rounded-lg px-4 py-2"
                >
                    <option value="">Default</option>
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
                <button
                    onClick={applyFilters}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Apply Filters
                </button>
                <button
                    onClick={clearFilters}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                    Clear All
                </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 text-center pt-2 border-t">
                {total} product{total !== 1 ? 's' : ''} found
            </div>
        </div>
    );
}
