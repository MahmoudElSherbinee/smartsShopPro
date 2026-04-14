// StripeCardElement.tsx (المُصحح - بدون form داخلي)

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

interface CheckoutFormProps {
    clientSecret: string;
    orderId: number;
    amount: number;
    onSuccess: () => void;
    onError: (error: string) => void;
}

// ⚠️ هذا الكومبوننت لا يحتوي على <form>، فقط عناصر الدفع
const CheckoutForm = ({ clientSecret, orderId, amount, onSuccess, onError }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    const handlePayment = async () => {
        if (!stripe || !elements) {
            onError('Stripe not loaded yet');
            return;
        }

        setLoading(true);
        setPaymentStatus('processing');

        try {
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: document.querySelector('meta[name="user-name"]')?.getAttribute('content') || 'Customer',
                        email: document.querySelector('meta[name="user-email"]')?.getAttribute('content') || '',
                    },
                },
            });

            if (confirmError) {
                throw new Error(confirmError.message);
            }

            if (paymentIntent?.status === 'succeeded') {
                setPaymentStatus('success');
                onSuccess();
                window.location.href = `/orders?payment_success=1`;
            }

        } catch (error: any) {
            console.error('Payment error:', error);
            setPaymentStatus('error');
            onError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Card Details</label>
                <div className="border rounded-lg p-3 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                            hidePostalCode: true,
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">Test card: 4242 4242 4242 4242</p>
            </div>

            {paymentStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    Payment failed. Please try again with a different card.
                </div>
            )}

            <button
                type="button"  // ⚠️ type="button" مش "submit"
                onClick={handlePayment}
                disabled={!stripe || loading || paymentStatus === 'success'}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : paymentStatus === 'success' ? (
                    'Payment Complete!'
                ) : (
                    `Pay $${amount} with Card`
                )}
            </button>
        </div>
    );
};

interface StripeCheckoutButtonProps {
    orderId: number;
    amount: number;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export default function StripeCheckoutButton({ orderId, amount, onSuccess, onError }: StripeCheckoutButtonProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ order_id: orderId }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to initialize payment');
                }

                setClientSecret(data.clientSecret);
                setLoading(false);
            } catch (err: any) {
                console.error('Failed to get client secret:', err);
                setError(err.message);
                setLoading(false);
                onError(err.message);
            }
        };

        if (orderId) {
            fetchClientSecret();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg text-center">
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing payment...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 py-3 rounded-lg text-center">
                Error: {error}
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 py-3 rounded-lg text-center">
                Unable to initialize payment. Please try again.
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
                clientSecret={clientSecret}
                orderId={orderId}
                amount={amount}
                onSuccess={onSuccess}
                onError={onError}
            />
        </Elements>
    );
}
