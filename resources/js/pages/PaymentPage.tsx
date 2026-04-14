import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface Props {
    amount: number;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function StripeCheckoutButton({ amount, onSuccess, onError }: Props) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ amount: amount }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment');
            }

            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
            if (!stripe) throw new Error('Failed to load Stripe');

            const { error } = await stripe.confirmPayment({
                clientSecret: data.clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
            });

            if (error) {
                throw new Error(error.message);
            }

        } catch (error: any) {
            console.error('Payment error:', error);
            if (onError) onError(error.message);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
            {loading ? 'Processing...' : `Pay $${amount} with Card`}
        </button>
    );
}
