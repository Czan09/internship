import React, { useState } from 'react';
import img from '../assets/images/login.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
        setError('');
        console.log('Logging in with:', { email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-md flex overflow-hidden w-full max-w-2xl items-stretch min-h-[0px]">
                <div className="hidden md:block md:w-1/3 h-full flex-shrink-0">
                    <img src={img} alt="loginImg" className="h-full w-full object-cover max-h-[360px]" />
                </div>
                <div className="w-full md:w-2/3 p-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1.5 rounded-md text-sm transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;