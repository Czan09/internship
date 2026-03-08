import { useEffect, useState } from "react"
import { friendStore } from "../store/friendStore"
import type { User } from "../types/user"
import type { Friend } from "../types/friend"
import FriendCard from "../componenets/friends/FriendCard"
import FriendTabs from "../componenets/friends/FriendTabs"

export default function Friends() {
  const baseUrl = "http://localhost:5000"
  const [friends, setFriends] = useState<Friend[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchEmail, setSearchEmail] = useState("")
  const [activeTab, setActiveTab] = useState<"PENDING" | "ACCEPTED" | "REJECTED">("PENDING")
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([])

  const userId = "CURRENT_USER_ID" // replace with getUserId()
  // ===== Subscribe to friends =====
  useEffect(() => {
    const unsub = friendStore.subscribe(setFriends)
    friendStore.fetchAll()
    return () => unsub()
  }, [])
  console.log(friends)

  const searchUser= async()=>{
    const res = await fetch(`${baseUrl}/users?email=${searchEmail}`)
    const data = await res.json()
    console.log(data)
    friendStore.create(data[0].id)
  }
  // ===== Filter friends based on tab and search =====
  useEffect(() => {
    let filtered = friends.filter((f) => f.status === activeTab)
    if (searchEmail) {
      filtered = filtered.filter((f) => {
        const friendUserEmail =
          f.userId === userId
            ? users.find((u) => u.id === f.friendUserId)?.email
            : users.find((u) => u.id === f.userId)?.email
        return friendUserEmail?.toLowerCase().includes(searchEmail.toLowerCase())
      })
    }
    setFilteredFriends(filtered)
  }, [friends, activeTab, searchEmail, users])

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Friends</h1>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button 
        onClick={()=>searchUser()}
        className="text-white bg-blue-500 px-10 items-center m-0 rounded-xl text-lg">Search</button>
      </div>

      <FriendTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredFriends.length === 0 && (
          <div className="col-span-full text-gray-400">No friends found.</div>
        )}

        {filteredFriends.map((f) => {
          const isSent = f.userId === userId
          const friendUser =
            isSent
              ? users.find((u) => u.id === f.friendUserId)
              : users.find((u) => u.id === f.userId)
          if (!friendUser) return null

          return (
            <FriendCard
              key={f.id}
              friend={f}
              friendUser={friendUser}
              isSent={isSent}
              currentUserId={userId}
            />
          )
        })}
      </div>
    </div>
  )
}