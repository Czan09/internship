import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import img from '../assets/images/login.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // 1. Fetch data from JSON Server filtered by email and password
            const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
            
            if (!response.ok) {
                throw new Error('Server connection failed');
            }

            const users = await response.json();

            // 2. Check if a matching user was found
            if (users.length > 0) {
                const user = users[0];
                
                // 3. Grant access: Store user info (omit password for safety)
                localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email }));
                
                // 4. Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-full max-w-3xl lg:max-w-4xl items-stretch min-h-[420px] login-card">
                <div className="hidden md:block md:w-1/2 h-full flex-shrink-0 pr-20 ">
                    <img src={img} alt="loginImg" className="h-full w-full object-cover md:max-h-[520px] lg:max-h-[640px] " />
                </div>
                <div className="w-full md:w-1/2 md:-ml-20 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 login-title">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 md:py-3 rounded-md text-sm md:text-base transition`}
                        >
                            {isLoading ? 'Checking...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;