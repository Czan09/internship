import type { Expense } from "../types/expense"
import { getUserId } from "./authStore"
import { budgetStore } from "./budgetStore"

type Listener = (expenses: Expense[]) => void

class ExpStore {
  private baseUrl = "http://localhost:5000/expenses"
  private expenses: Expense[] = []
  private listeners: Listener[] = []

  subscribe(listener: Listener) {
    this.listeners.push(listener)
    listener(this.expenses)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.expenses))
  }

  getState() {
    return this.expenses
  }

  async fetchAll(): Promise<Expense[]> {
    const userId = getUserId()
    if (!userId) throw new Error("User not authenticated")

    const res = await fetch(`${this.baseUrl}?userId=${userId}`)
    const data: Expense[] = await res.json()
    this.expenses = data
    this.notify()
    return data
  }

  // ===== CREATE EXPENSE AND UPDATE BUDGET =====
  async create(
    expense: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Expense> {
    const userId = getUserId()
    if (!userId) throw new Error("User not authenticated")

    // ===== Check Budget Before Creating Expense =====
    const budget = await budgetStore.fetchById(String(expense.budgetId))
    const remainingBudget = budget.amount - budget.spent

    if (expense.amount > remainingBudget) {
      throw new Error("Not enough budget for this expense")
    }

    const now = new Date().toISOString()

    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...expense,
        userId,
        createdAt: now,
        updatedAt: now,
      }),
    })

    const newExpense: Expense = await res.json()

    // ===== Update Store & Notify =====
    this.expenses = [...this.expenses, newExpense]  // just append
    this.notify()

    // ===== Update Budget Spent =====
    try {
      const newSpent = budget.spent + expense.amount
      await budgetStore.update(String(expense.budgetId), { spent: newSpent })
    } catch (err) {
      console.error("Failed to update budget spent:", err)
    }

    return newExpense
  }
}

export const expStore = new ExpStore()