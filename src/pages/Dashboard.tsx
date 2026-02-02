import React, { useState, useEffect } from 'react';
import { Switch, Menu, MenuButton, MenuItems, MenuItem} from '@headlessui/react';

// Define types based on your db.json
interface User {
    id: number;
    name: string;
}

interface Budget {
    id: number;
    amount: number;
    spent: number;
}

const Dashboard: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
    
    // 1. Create state for your data
    const [users, setUsers] = useState<User[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch data from JSON Server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, budgetRes] = await Promise.all([
                    fetch('http://localhost:5000/users'),
                    fetch('http://localhost:5000/budgets')
                ]);

                const userData = await userRes.json();
                const budgetData = await budgetRes.json();

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

    // 3. Calculate dynamic totals
    const totalRevenue = budgets.reduce((acc, curr) => acc + curr.amount, 0);

    if (loading) return <div className="p-6">Loading Dashboard...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <header className="flex justify-between items-center mb-6">
    {/* This stays on the Left */}
    <h1 className="text-3xl font-bold">Dashboard</h1>

    {/* This moves to the Right */}
    <div className="relative">
        <Menu>
            <MenuButton className="px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition">
                My account
            </MenuButton>

            {/* anchor="bottom end" ensures the dropdown aligns to the right edge of the button */}
            <MenuItems 
                anchor="bottom end" 
                className="w-48 mt-2 origin-top-right rounded-xl border border-gray-200 bg-white p-1 shadow-lg focus:outline-none"
            >
                <MenuItem>
                    <a className="block rounded-lg py-2 px-3 text-sm hover:bg-blue-50" href="/settings">
                        Settings
                    </a>
                </MenuItem>
                <MenuItem>
                    <a className="block rounded-lg py-2 px-3 text-sm hover:bg-blue-50" href="/support">
                        Support
                    </a>
                </MenuItem>
                <div className="my-1 h-px bg-gray-100" /> {/* Optional Separator */}
                <MenuItem>
                    <a className="block rounded-lg py-2 px-3 text-sm hover:bg-blue-50 text-red-600" href="/logout">
                        Logout
                    </a>
                </MenuItem>
            </MenuItems>
        </Menu>
    </div>
          </header>

            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Total Users</h2>
                        {/* Display dynamic user count */}
                        <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Total Budget</h2>
                        {/* Display dynamic budget sum */}
                        <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold text-gray-600">Active Budgets</h2>
                        <p className="text-2xl font-bold">{budgets.length}</p>
                    </div>
                </section>

                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">User List</h2>
                    <ul className="divide-y">
                        {users.map(user => (
                            <li key={user.id} className="py-2">{user.name}</li>
                        ))}
                    </ul>
                </section>

                <div className="bg-white p-4 rounded shadow mt-6">
                    <label className="flex items-center gap-2">
                        <span>Enable notifications</span>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={`${
                                enabled ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span
                                className={`${
                                    enabled ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                            />
                        </Switch>
                    </label>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;