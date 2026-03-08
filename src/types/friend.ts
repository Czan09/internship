export interface Friend {
  id: string
  userId: string
  friendUserId: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED"
  blockedBy?: string | null
}