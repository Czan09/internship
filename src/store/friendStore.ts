import { getUserId } from "./authStore"

export interface Friend {
  id: string
  userId: string
  friendUserId: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED"
  blockedBy?: string | null
}

type Listener = (friends: Friend[]) => void

class FriendStore {
  private baseUrl = "http://localhost:5000/friends"
  private friends: Friend[] = []
  private listeners: Listener[] = []

  // ===== Subscribe =====
  subscribe(listener: Listener) {
    this.listeners.push(listener)
    listener(this.friends)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.friends))
  }

  getState() {
    return this.friends
  }

  // ===== Fetch all friends for current user =====
  async fetchAll(): Promise<Friend[]> {
    const userId = getUserId()
    if (!userId) throw new Error("User not authenticated")

    const res = await fetch(`${this.baseUrl}?userId=${userId}`)
    const data: Friend[] = await res.json()
    this.friends = data
    this.notify()
    return data
  }

  // ===== Fetch single friend by ID =====
  async fetchById(id: string): Promise<Friend> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    const data: Friend = await res.json()
    return data
  }

  // ===== Create friend request =====
  async create(friendUserId: string): Promise<Friend> {
    const userId = getUserId()
    if (!userId) throw new Error("User not authenticated")

    const now = new Date().toISOString()
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        friendUserId,
        status: "PENDING",
        blockedBy: null,
        createdAt: now,
        updatedAt: now
      }),
    })

    const newFriend: Friend = await res.json()
    this.friends = [...this.friends, newFriend]
    this.notify()
    return newFriend
  }

  // ===== Update friend request (accept/reject/block) =====
  async update(
    id: string,
    status: "ACCEPTED" | "REJECTED" | "BLOCKED",
    blockedBy?: string | null
  ): Promise<Friend> {
    const friend = await this.fetchById(id)

    // Only the friendUserId can accept/reject
    const userId = getUserId()
    if (friend.friendUserId !== userId) {
      throw new Error("Only the recipient can accept/reject/block")
    }

    const now = new Date().toISOString()
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, blockedBy: blockedBy || null, updatedAt: now }),
    })
    const updatedFriend: Friend = await res.json()

    // Update local state
    this.friends = this.friends.map((f) => (f.id === id ? updatedFriend : f))
    this.notify()

    // If accepted/rejected, create mirrored entry for the sender
    if (status === "ACCEPTED" || status === "REJECTED") {
      const mirrorRes = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: friend.friendUserId,        // friend becomes owner
          friendUserId: friend.userId,        // original owner becomes friend
          status,
          blockedBy: null,
          createdAt: now,
          updatedAt: now
        }),
      })
      const mirroredFriend: Friend = await mirrorRes.json()
      this.friends = [...this.friends, mirroredFriend]
      this.notify()
    }

    return updatedFriend
  }
}

export const friendStore = new FriendStore()