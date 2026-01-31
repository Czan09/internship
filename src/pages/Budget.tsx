import React, { useState } from 'react';

const Budget: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [budgetItems, setBudgetItems] = useState<{ description: string; amount: number }[]>([]);

    const addBudgetItem = () => {
        if (description && amount > 0) {
            setBudgetItems([...budgetItems, { description, amount }]);
            setDescription('');
            setAmount(0);
        }
    };

    return (
        <div>
            <h1>Budget Tracker</h1>
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <button onClick={addBudgetItem}>Add Item</button>
            <ul>
                {budgetItems.map((item, index) => (
                    <li key={index}>
                        {item.description}: ${item.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Budget;