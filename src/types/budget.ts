// types/budget.ts
export default interface Budget {
  id: string
  userId: number
  name: string
  amount: number
  spent: number
  category: string
  description: string
  createdAt: string
  updatedAt: string
}
