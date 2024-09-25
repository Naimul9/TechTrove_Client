import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const Login = () => {
    const { signIn, signInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
    
        try {
            const result = await signIn(email, password);
            console.log(result.user);
            e.target.reset();
            
            // Check if the user is verified
            if (result.user.emailVerified) {
                toast.success("Login successful!");
                navigate('/');
            } else {
                toast.error("Please verify your email before logging in.");
                // Optionally, you could sign the user out
                // await logOut(); // If you want to sign out the user
            }
        } catch (error) {
            console.error(error);
            toast.error("Invalid email or password. Please try again.");
        }
    };
    
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            console.log(result.user);
            toast.success("Google Sign-In successful!");
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error("Google Sign-In failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-10 bg-gray-100">
            <Helmet><title>Login</title></Helmet>
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="Email" 
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            aria-label="Email address"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder="Password" 
                            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            aria-label="Password"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300" aria-label="Login">
                        Login
                    </button>
                </form>
                <div className="text-center text-gray-600">
                    <p>New here? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
                </div>
                <div className="flex justify-center">
                    <button onClick={handleGoogleSignIn} className="flex items-center justify-center w-full py-2 mt-4 text-gray-700 bg-gray-100 border rounded-lg hover:bg-gray-200 focus:ring focus:ring-gray-300" aria-label="Sign in with Google">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                            <path fill="#4285F4" d="M24 9.5c3.8 0 6.5 1.7 8.1 3.2l5.9-5.9C34.4 3.5 29.8 1 24 1 14.8 1 7.4 7.7 5 16.7l7.2 5.6c1.3-5.1 6-8.8 11.8-8.8z"/>
                            <path fill="#34A853" d="M9.9 28.2C8.9 25.8 8.5 23.2 8.5 20.5s.4-5.3 1.4-7.7L2.7 7.2C1 10.7 0 14.8 0 19c0 4.2 1 8.3 2.7 12l7.2-5.8z"/>
                            <path fill="#FBBC05" d="M24 44c5.8 0 10.4-1.9 13.8-5.3L31 33.5c-2.1 1.4-4.7 2.2-7.5 2.2-5.7 0-10.4-3.7-12.1-8.8L4.1 31.8C7.3 39.5 14.9 44 24 44z"/>
                            <path fill="#EA4335" d="M44.6 20.4H24v8.8h11.8c-1.7 4.9-5.8 8.4-11.8 8.4-6.9 0-12.7-5.5-12.7-12.7s5.8-12.7 12.7-12.7c3.3 0 6.1 1.2 8.2 3.2l6.6-6.6c-3.6-3.4-8.4-5.6-14.8-5.6-11.3 0-20.5 9.2-20.5 20.5s9.2 20.5 20.5 20.5c11.4 0 20.3-9.3 20.3-20.7 0-1.4-.1-2.8-.3-4.1z"/>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
