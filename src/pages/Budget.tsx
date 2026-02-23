import { useEffect, useState } from "react"
import { budgetStore } from "../store/budgetStore"
import type { Budget } from "../types/budget"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [name, setName] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const unsubscribe = budgetStore.subscribe(setBudgets)
    budgetStore.fetchAll()
    return unsubscribe
  }, [])

  const handleAddBudget = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!name || !amount) return

  try {
    await budgetStore.create({
      name,
      amount,
      spent: 0,
      category,
      description,
    })
    setName("")
    setAmount(0)
    setCategory("")
    setDescription("")
  } catch (error) {
    console.error(error)
  }
}


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Budgets</h1>
          <p className="text-gray-500 mt-1">
            Manage your current budgets
          </p>
        </div>
        {/* ================= ADD BUDGET FORM ================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Budget
          </h2>

          <form
            onSubmit={handleAddBudget}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Budget Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
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

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add Budget
              </button>
            </div>
          </form>
        </div>

        {/* ================= BUDGET LIST ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          {budgets.length === 0 && (
            <div className="text-gray-400 col-span-full">
              No budgets yet.
            </div>
          )}

          {budgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.amount) * 100,
              100
            )

            return (
              <div
                key={budget.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {budget.name}
                  </h2>
                  <span className="text-sm text-gray-400">
                    {budget.category}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {budget.description}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${budget.spent} spent</span>
                    <span>${budget.amount}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        
      </div>
    </div>
  )
}
