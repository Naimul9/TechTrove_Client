/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast, { Toaster } from 'react-hot-toast';  // Import toast and Toaster
import { axiosPublic } from '../../Hooks/useAxiosPublic';

const CheckoutModal = ({ item, onClose, onPaymentSuccess }) => {
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        // Fetch the client secret from the backend when the item price changes
        const fetchClientSecret = async () => {
            try {
                const response = await axiosPublic.post('/create-payment-intent', { amount: item.price * 100 }); // Amount in cents
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                setError('Failed to initialize payment.');
                console.error('Error fetching clientSecret:', error);
            }
        };

        fetchClientSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.price, axiosPublic]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            return; // Stripe.js has not yet loaded or clientSecret is not available.
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setError(error.message);
                toast.error(error.message); // Trigger error toast notification
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment was successful
                toast.success('Payment successful! 🎉');

                // Pass payment details to the parent component
                onPaymentSuccess({
                    item: item.name,
                    price: item.price,
                    paymentId: paymentIntent.id, // Payment ID from Stripe
                    date: new Date().toISOString(),
                });

                // Close the modal after payment success
                onClose();
            }
        } catch (error) {
            setError('Payment failed. Please try again.', error);
            toast.error('Payment failed. Please try again.'); // Trigger error toast notification
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Toaster component for displaying toasts */}
            <Toaster />
            <div className="modal modal-open">
                <div className="modal-box">
                    <h2 className="text-lg font-bold">Checkout</h2>
                    <p>Item: {item.name}</p>
                    <p>Price: ${item.price}</p>
                    <form onSubmit={handleSubmit}>
                        <CardElement />
                        <button 
                            type="submit" 
                            className="btn mt-4 bg-blue-500 hover:bg-blue-600 text-white" 
                            disabled={!stripe || !clientSecret}>
                            Pay
                        </button>
                    </form>
                    {error && <p className="text-red-500">{error}</p>}
                    <button className="btn btn-sm mt-4" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
