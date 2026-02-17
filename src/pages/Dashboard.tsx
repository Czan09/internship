import React, { useState, useEffect } from 'react';
import { Switch, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useAuth } from '../hooks/useAuth'; // Ensure this path is correct

// Types
interface User {
    id: string;
    name: string;
}

interface Budget {
    id: number;
    amount: number;
    spent: number;
}

const Dashboard: React.FC = () => {
    // 1. Get the authenticated user and logout function from your hook
    const { user: authUser, logout } = useAuth();
    
    const [enabled, setEnabled] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, budgetRes] = await Promise.all([
                    fetch('http://localhost:5000/users'),
                    fetch('http://localhost:5000/budgets'),
                ]);
                
                const userData: User[] = await userRes.json();
                const budgetData: Budget[] = await budgetRes.json();
                
                setUsers(userData);
                setBudgets(budgetData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Logic: Always use the name from the Auth State
    const currentUserName = authUser?.name || "Guest";

    const totalRevenue = budgets.reduce((acc, curr) => acc + curr.amount, 0);

    if (loading) return <div className="p-6 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                {/* DYNAMIC NAME */}
                <h1 className="text-3xl font-bold">Welcome {currentUserName}</h1>

                <div className="relative">
                    <Menu>
                        <MenuButton className="px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                            My account
                        </MenuButton>

                        <MenuItems 
                            anchor="bottom end" 
                            className="w-48 mt-2 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-lg focus:outline-none"
                        >
                            <MenuItem>
                                <a className="block rounded-lg py-2 px-3 text-sm hover:bg-blue-50" href="/settings">
                                    Settings
                                </a>
                            </MenuItem>
                            <div className="my-1 h-px bg-gray-100" />
                            <MenuItem>
                                {/* LOGOUT ACTION */}
                                <button 
                                    onClick={logout}
                                    className="w-full text-left block rounded-lg py-2 px-3 text-sm hover:bg-red-50 text-red-600 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </header>

            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Total Users</h2>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Total Budget</h2>
                        <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Active Budgets</h2>
                        <p className="text-2xl font-bold">{budgets.length}</p>
                    </div>
                </section>

                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Internal User List</h2>
                    <ul className="divide-y">
                        {users.map(u => (
                            <li key={u.id} className={`py-2 ${u.id === authUser?.id ? 'font-bold text-blue-600' : ''}`}>
                                {u.name} {u.id === authUser?.id && "(You)"}
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;