import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const Wishlist = () => {
    const { user, loading: authLoading } = useContext(AuthContext); // Renamed loading from AuthContext
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); // Local loading state
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;

        if (!user?.email) {
            navigate('/login');
            return;
        }

        const fetchWishlist = async () => {
            setLoading(true); // Start loading spinner
            try {
                const response = await axiosPublic.get(`/wishlist?userEmail=${user.email}`);
                setCartItems(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchWishlist();
    }, [user, authLoading, axiosPublic, navigate]);

    // Handle removal of an item from wishlist
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
                await axiosPublic.delete(`/wishlist/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your item has been deleted.",
                    icon: "success"
                });

                // Refetch the wishlist after deletion
                const response = await axiosPublic.get(`/wishlist?userEmail=${user.email}`);
                setCartItems(response.data.cartItems);

            } catch (error) {
                console.error('Failed to delete', error);
                toast.error("Failed to delete.");
            }
        }
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <Helmet><title>Wishlist</title></Helmet>
            <h1 className="text-2xl font-bold mb-5">Wishlist</h1>

            {loading ? (
                <div className="text-center my-10">
                    <span className="loading loading-bars loading-md"></span>
                </div>
            ) : (
                cartItems.length === 0 ? (
                    <p>Your wishlist is empty.</p>
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Wishlist;
