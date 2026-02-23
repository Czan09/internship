// store/budgetStore.ts
import type { Budget } from "../pages/Budget"
import { getUserId } from "./authStore"

type Listener = (budgets: Budget[]) => void

class BudgetStore {
  private baseUrl = "http://localhost:5000/budgets"
  private budgets: Budget[] = []
  private listeners: Listener[] = []

  subscribe(listener: Listener) {
    this.listeners.push(listener)
    listener(this.budgets)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.budgets))
  }

  getState(): Budget[] {
    return this.budgets
  }

  // ==================================
  // GET ALL (for logged-in user only)
  // ==================================
  async fetchAll(): Promise<Budget[]> {
    const userId = getUserId()
    if (!userId) throw new Error("User not authenticated")

    const res = await fetch(`${this.baseUrl}?userId=${userId}`)
    const data: Budget[] = await res.json()

    this.budgets = data
    this.notify()

    return data
  }

  // ==================================
  // CREATE (auto inject userId)
  // ==================================
  async create(
  budget: Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">
) {
  const userId = getUserId()
  if (!userId) throw new Error("User not authenticated")

  const now = new Date().toISOString()

  const res = await fetch(this.baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...budget, userId, createdAt: now, updatedAt: now }),
  })

  const newBudget: Budget = await res.json()

  // ✅ Replace push with filtered to avoid duplicates
  this.budgets = [...this.budgets.filter(b => b.id !== newBudget.id), newBudget]

  this.notify() // notify subscribers
  return newBudget
}


  // ==================================
  // UPDATE
  // ==================================
  async update(
    id: string,
    updates: Partial<Omit<Budget, "id" | "userId" | "createdAt">>
  ): Promise<Budget> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
      }),
    })

    const updatedBudget: Budget = await res.json()

    this.budgets = this.budgets.map(b =>
      b.id === id ? updatedBudget : b
    )

    this.notify()
    return updatedBudget
  }

  // ==================================
  // DELETE
  // ==================================
  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    })

    this.budgets = this.budgets.filter(b => b.id !== id)
    this.notify()
  }
}

export const budgetStore = new BudgetStore()
