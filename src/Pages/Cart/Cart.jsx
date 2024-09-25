import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutModal from "../CheckOutModal/CheckOutModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(import.meta.env.VITE_Payment);

const Cart = () => {
    const { user, loading: authLoading } = useContext(AuthContext); // Renamed loading from AuthContext to authLoading
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); // Local loading state for cart data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;

        if (!user?.email) {
            navigate('/login');
            return;
        }

        const fetchCartItems = async () => {
            setLoading(true); // Start spinner
            try {
                const response = await axiosPublic.get(`/cart?userEmail=${user.email}`);
                setCartItems(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false); // Stop spinner
            }
        };

        fetchCartItems();
    }, [user, authLoading, axiosPublic, navigate]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/cart/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your request has been deleted.",
                    icon: "success"
                });

                // Refetch the cart after deletion
                const response = await axiosPublic.get(`/cart?userEmail=${user.email}`);
                setCartItems(response.data.cartItems);
            } catch (error) {
                console.error('Failed to delete:', error);
                toast.error("Failed to delete.");
            }
        }
    };

    const handleCheckout = async (item) => {
        setSelectedItem(item);

        try {
            const response = await axiosPublic.post('/create-payment-intent', { amount: item.price * 100 }); // Amount in cents
            setClientSecret(response.data.clientSecret);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error creating payment intent:', error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setClientSecret(null); // Reset clientSecret when closing the modal
    };

    // Function to save payment history
    const savePaymentHistory = async (paymentDetails) => {
        const payment = {
            ...paymentDetails,
            userEmail: user?.email // Include the user's email
        };

        try {
            await axiosPublic.post('/payment-history', payment);
            toast.success("Payment history saved successfully.");
        } catch (error) {
            console.error('Error saving payment history:', error);
            toast.error("Failed to save payment history.");
        }
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <h1 className="text-2xl font-bold mb-5">Shopping Cart</h1>
            <div className="flex justify-end mb-5">
                <Link to={'/payment-history'}>
                    <button className="btn">Payment History</button>
                </Link>
            </div>

            {loading ? ( // Show spinner while loading cart data
                <div className="text-center my-10">
                    <span className="loading loading-bars loading-md"></span>
                </div>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="card bg-base-100 shadow-xl">
                            <figure className="px-10 pt-10">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-xl w-full"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{item.name}</h2>
                                <p>Price: ${item.price}</p>
                                <div className="card-actions flex justify-between">
                                    <button 
                                        onClick={() => handleDelete(item._id)} 
                                        className="btn bg-red-500 hover:bg-red-600 text-white">
                                        Remove
                                    </button>
                                    <button 
                                        onClick={() => handleCheckout(item)} 
                                        className="btn bg-green-500 hover:bg-green-600 text-white">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Checkout Modal */}
            {isModalOpen && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutModal 
                        item={selectedItem} 
                        onClose={closeModal} 
                        onPaymentSuccess={(paymentDetails) => {
                            savePaymentHistory(paymentDetails); // Save the payment history
                            handleDelete(selectedItem._id); // Remove the item from cart after successful payment
                            closeModal(); // Close the modal after successful payment
                        }} 
                    />
                </Elements>
            )}
        </div>
    );
};

export default Cart;
