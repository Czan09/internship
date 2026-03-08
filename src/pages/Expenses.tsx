import { useEffect, useState } from "react"
import { expStore } from "../store/expenseStore"
import type { Expense } from "../types/expense"
import type Budget from "../types/budget"
import { budgetStore } from "../store/budgetStore"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgetId, setBudgetId] = useState<string>('') // string to match select value
  const [amount, setAmount] = useState<number | ''>('')
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    const unsubscribe = expStore.subscribe(setExpenses)
    expStore.fetchAll()

    const budgetUnsub = budgetStore.subscribe(setBudgets)
    budgetStore.fetchAll()

    return () => {
      unsubscribe()
      budgetUnsub()
    }
  }, [])

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!budgetId || !amount || !category || !description || !date) return

    try {
      await expStore.create({
        budgetId,
        amount,
        category,
        description,
        date,
        receipt: null,
      })

      // Reset form
      setBudgetId('')
      setAmount('')
      setCategory("")
      setDescription("")
      setDate(new Date().toISOString().split("T")[0])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
          <p className="text-gray-500 mt-1">Track your expenses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="grid md:grid-cols-2 gap-4">

            {/* Budget dropdown */}
            <select
              value={budgetId}
              onChange={(e) => setBudgetId(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Budget</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} - {b.id}
                </option>
              ))}
            </select>

            {/* Amount input */}
            <input
              type="text"
              pattern="[0-9]*"
              placeholder="Amount"
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (value === "") return setAmount('')
                const num = Number(value)
                if (!isNaN(num) && num >= 0) setAmount(num)
              }}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {expenses.length === 0 && (
            <div className="text-gray-400 col-span-full">No expenses yet.</div>
          )}

          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">{exp.description}</h2>
                <span className="text-sm text-gray-400">{exp.category}</span>
              </div>
              <p className="text-gray-600 font-medium mt-2">Amount: ${exp.amount}</p>
              <p className="text-gray-400 text-sm mt-1">Date: {new Date(exp.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}