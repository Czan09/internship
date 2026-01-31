import React, { useState } from 'react';

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<{ id: number; description: string; amount: number }[]>([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);

    const addExpense = () => {
        const newExpense = { id: Date.now(), description, amount };
        setExpenses([...expenses, newExpense]);
        setDescription('');
        setAmount(0);
    };

    return (
        <div>
            <h1>Expenses</h1>
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
            <button onClick={addExpense}>Add Expense</button>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.description}: ${expense.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Expenses;