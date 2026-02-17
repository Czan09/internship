import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 1. Import your hook
import img from '../assets/images/login.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    // 2. Use the login function and loading state from your hook
    const { login, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError('');
        
        if (!email || !password) {
            setLocalError('Email and password are required');
            return;
        }

        // 3. Call the central login function from useAuth
        const result = await login({ email, password });

        if (result.success) {
            // 4. Redirect on success
            navigate('/dashboard');
        }
    };

    // Use either the local validation error or the API error from the hook
    const displayError = localError || authError;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-full max-w-3xl lg:max-w-4xl items-stretch min-h-[420px]">
                <div className="hidden md:block md:w-1/2 h-full flex-shrink-0 pr-20">
                    <img src={img} alt="loginImg" className="h-full w-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 md:-ml-20 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        {displayError && <p className="text-red-500 text-sm">{displayError}</p>}
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 md:py-3 rounded-md transition cursor-pointer`}
                        >
                            {loading ? 'Checking...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;