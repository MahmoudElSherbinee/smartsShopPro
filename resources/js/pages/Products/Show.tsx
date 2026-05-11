import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import { Sparkles, Heart, ShoppingBag, Star, Package, ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Props {
    product: Product;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: {
            type: string;
            id: number;
        };
    };
}

export default function Show({ product }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(`/products/${product.id}/reviews`, {
            rating,
            comment
        }, {
            onFinish: () => {
                setSubmitting(false);
                setRating(0);
                setComment('');
            }
        });
    };

    const handleDeleteReview = (reviewId: number) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/reviews/${reviewId}`);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="py-12 bg-linear-to-br from-gray-50 via-white to-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Top Navigation */}
                    <div className="flex justify-between items-center mb-6">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Products
                        </Link>

                        <div className="flex gap-3">
                            <Link
                                href="/wishlist"
                                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                            >
                                <Heart className="w-4 h-4 text-red-500" />
                                <span className="text-gray-700 text-sm">Wishlist</span>
                            </Link>
                            <Link
                                href="/cart"
                                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                            >
                                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                                <span className="text-gray-700 text-sm">Cart</span>
                            </Link>
                        </div>
                    </div>

                    {/* AI Insight Banner */}
                    <div className="relative mb-8 overflow-hidden bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
                        <div className="relative p-4 px-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-white" />
                                <p className="text-white/90 text-sm">
                                    AI Insight: <strong className="text-white">"{product.name}"</strong> is trending with {product.reviews_count || 0} reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 lg:p-8">
                            {/* Product Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Image */}
                                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex items-center justify-center min-h-[400px]">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="max-w-full max-h-96 object-contain p-4 transition-transform duration-500 hover:scale-105"
                                    />
                                </div>

                                {/* Right Column - Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                                            {product.name}
                                        </h1>
                                        <Link
                                            href={`/categories/${product.category?.id}`}
                                            className="text-indigo-500 hover:text-indigo-600 text-sm inline-flex items-center gap-1"
                                        >
                                            {product.category?.name}
                                        </Link>
                                    </div>

                                    {/* Wishlist Button */}
                                    {user.type === 'customer' && (
                                        <button
                                            onClick={() => {
                                                if (product.in_wishlist) {
                                                    router.delete(`/wishlist/remove/${product.id}`);
                                                } else {
                                                    router.post(`/wishlist/add/${product.id}`);
                                                }
                                            }}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${product.in_wishlist
                                                    ? 'bg-red-50 text-red-500 border border-red-200'
                                                    : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-red-50 hover:text-red-400'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${product.in_wishlist ? 'fill-red-500' : ''}`} />
                                            {product.in_wishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                        </button>
                                    )}

                                    {/* Rating Summary */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${star <= Math.round(product.average_rating || 0)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm">
                                            {product.average_rating || 0} out of 5 ({product.reviews_count || 0} reviews)
                                        </span>
                                    </div>

                                    {/* Price & Stock */}
                                    <div className="border-t border-b py-4 border-gray-100">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-4xl font-bold text-green-600">
                                                ${product.price}
                                            </span>
                                            <span className={`text-sm px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                        </div>
                                    )}

                                    {/* Add to Cart */}
                                    <div className="pt-2">
                                        <AddToCartButton productId={product.id} stock={product.stock} />
                                    </div>

                                    {/* Meta Info */}
                                    <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                                        <p>Added: {new Date(product.created_at || '').toLocaleDateString()}</p>
                                        <p>Last updated: {new Date(product.updated_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="mt-10 border-t pt-8 border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                                        <p className="text-gray-500 text-sm">What others are saying</p>
                                    </div>
                                    {product.average_rating && (
                                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= Math.round(product.average_rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold">{product.average_rating}</span>
                                            <span className="text-gray-400 text-sm">({product.reviews_count})</span>
                                        </div>
                                    )}
                                </div>

                                {/* Add Review Form */}
                                {auth.user?.type === 'customer' && (
                                    <form onSubmit={handleSubmitReview} className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="font-semibold mb-4 text-gray-900">Write a Review</h3>

                                        {/* Star Rating */}
                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        {star <= (hoverRating || rating) ? '⭐' : '☆'}
                                                    </button>
                                                ))}
                                            </div>
                                            {rating === 0 && <p className="text-red-500 text-sm mt-1">Please select a rating</p>}
                                        </div>

                                        {/* Comment */}
                                        <div className="mb-4">
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Comment (optional)</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                rows={3}
                                                placeholder="Share your experience with this product..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting || rating === 0}
                                            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {!product.reviews || product.reviews.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                        </div>
                                    ) : (
                                        product.reviews.map((review: any) => (
                                            <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`w-4 h-4 ${star <= review.rating
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{review.user?.name}</span>
                                                            <span className="text-sm text-gray-400">
                                                                {new Date(review.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {review.comment && (
                                                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                                        )}
                                                    </div>
                                                    {(auth.user?.id === review.user_id || auth.user?.type === 'admin') && (
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons (Admin/Vendor) */}
                            {(user.type === 'admin' || (user.type === 'vendor' && product.user_id === user.id)) && (
                                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Product
                                    </Link>
                                    {user.type === 'admin' && (
                                        <button
                                            onClick={handleDelete}
                                            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Product
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
