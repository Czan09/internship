export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string | null
  createdAt: string
  updatedAt: string
}