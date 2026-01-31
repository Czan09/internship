import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const Dashboard: React.FC = () => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="p-6 bg-gray-100">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </header>
            
            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">Total Users</h2>
                        <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">Revenue</h2>
                        <p className="text-2xl font-bold">$45,678</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">Active Projects</h2>
                        <p className="text-2xl font-bold">28</p>
                    </div>
                </section>

                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <p>Chart placeholder</p>
                </section>

                <div className="bg-white p-4 rounded shadow mt-6">
                    <label className="flex items-center gap-2">
                        <span>Enable notifications</span>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={`${
                                enabled ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className="sr-only">Enable notifications</span>
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
