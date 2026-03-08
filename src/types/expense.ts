// types/expense.ts
export interface Expense {
  id: string
  budgetId: string
  userId: number
  amount: number
  description: string
  category: string
  receipt: string | null
  date: string
  createdAt: string
  updatedAt: string
}
