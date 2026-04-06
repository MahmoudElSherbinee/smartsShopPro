import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                            ← Back to Products
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="text-gray-700">View Cart</span>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 lg:p-8">
                            {/* Product Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Image */}
                                <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-400px">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="max-w-full max-h-96 object-contain p-4"
                                    />
                                </div>

                                {/* Right Column - Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                                        <Link
                                            href={`/categories/${product.category?.id}`}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            {product.category?.name}
                                        </Link>
                                    </div>



                                    <div className="border-t border-b py-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-green-600">
                                                ${product.price}
                                            </span>
                                            <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                        </div>
                                    )}

                                    {/* Add to Cart */}
                                    <div className="pt-4">
                                        <AddToCartButton productId={product.id} stock={product.stock} />
                                    </div>

                                    {/* Meta Info */}
                                    <div className="text-xs text-gray-400 pt-4 border-t">
                                        <p>Added: {new Date(product.created_at || '').toLocaleDateString()}</p>
                                        <p>Last updated: {new Date(product.updated_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="mt-8 border-t pt-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-bold">Reviews</h2>
                                    {product.average_rating && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className="text-2xl">
                                                        {star <= Math.round(product.average_rating) ? '⭐' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-gray-600">
                                                ({product.average_rating}) • {product.reviews_count} reviews
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Add Review Form - Only for customers who purchased? or just logged in */}
                                {auth.user?.type === 'customer' && (
                                    <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-semibold mb-3">Write a Review</h3>

                                        {/* Star Rating */}
                                        <div className="mb-3">
                                            <label className="block mb-1">Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="text-3xl focus:outline-none"
                                                    >
                                                        {star <= (hoverRating || rating) ? '⭐' : '☆'}
                                                    </button>
                                                ))}
                                            </div>
                                            {rating === 0 && <p className="text-red-500 text-sm mt-1">Please select a rating</p>}
                                        </div>

                                        {/* Comment */}
                                        <div className="mb-3">
                                            <label className="block mb-1">Comment (optional)</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full border rounded px-3 py-2"
                                                rows={3}
                                                placeholder="Share your experience with this product..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting || rating === 0}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {product.reviews?.length === 0 ? (
                                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                    ) : (
                                        product.reviews?.map((review: any) => (
                                            <div key={review.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <span key={star}>
                                                                        {star <= review.rating ? '⭐' : '☆'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <span className="font-medium">{review.user?.name}</span>
                                                            <span className="text-sm text-gray-400">
                                                                {new Date(review.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {review.comment && (
                                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                                        )}
                                                    </div>
                                                    {(auth.user?.id === review.user_id || auth.user?.type === 'admin') && (
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="text-red-500 hover:text-red-700 text-sm"
                                                        >
                                                            Delete
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
                                <div className="mt-8 pt-6 border-t flex gap-4">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Edit Product
                                    </Link>

                                    {user.type === 'admin' && (
                                        <button
                                            onClick={handleDelete}
                                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
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
