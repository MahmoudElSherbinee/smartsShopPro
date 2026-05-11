import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown, Star, DollarSign, Package, SlidersHorizontal } from 'lucide-react';

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
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setLocalFilters(filters);
        setPriceRange({
            min: filters.min_price || '',
            max: filters.max_price || '',
        });
    }, [filters]);

    const applyFilters = () => {
        const params: any = { ...localFilters };

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
        { value: '4', label: '4★ & above', icon: '⭐⭐⭐⭐' },
        { value: '3', label: '3★ & above', icon: '⭐⭐⭐' },
        { value: '2', label: '2★ & above', icon: '⭐⭐' },
        { value: '1', label: '1★ & above', icon: '⭐' },
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'rating_desc', label: 'Best Rating' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {Object.keys(localFilters).filter(k => localFilters[k as keyof Filters] && k !== 'sort').length}
                    </span>
                </div>
                <button
                    onClick={clearFilters}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                    Reset all
                </button>
            </div>

            {/* Search */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={localFilters.search || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2"
                >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                    <select
                        value={localFilters.category || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.products_count})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                </label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Minimum Rating
                </label>
                <div className="space-y-2">
                    {ratingOptions.map(opt => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${localFilters.rating === opt.value
                                    ? 'bg-indigo-50 border border-indigo-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }`}
                        >
                            <input
                                type="radio"
                                name="rating"
                                value={opt.value}
                                checked={localFilters.rating === opt.value}
                                onChange={(e) => setLocalFilters({ ...localFilters, rating: e.target.value })}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm">{opt.icon}</span>
                            <span className="text-sm text-gray-600">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* In Stock Only */}
            <div>
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                    <input
                        type="checkbox"
                        checked={localFilters.in_stock || false}
                        onChange={(e) => setLocalFilters({ ...localFilters, in_stock: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        In Stock Only
                    </span>
                </label>
            </div>

            {/* Sort By */}
            <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                    value={localFilters.sort || ''}
                    onChange={(e) => {
                        setLocalFilters({ ...localFilters, sort: e.target.value });
                        setTimeout(applyFilters, 0);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition"
                >
                    <option value="">Default</option>
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={applyFilters}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                >
                    Apply Filters
                </button>
                <button
                    onClick={clearFilters}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                >
                    Clear
                </button>
            </div>

            {/* Results Count */}
            <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    {total} product{total !== 1 ? 's' : ''} found
                </p>
            </div>
        </div>
    );
}
