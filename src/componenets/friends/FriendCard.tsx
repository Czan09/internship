import { friendStore } from "../../store/friendStore"
import type { User } from "../../types/user"
import type { Friend } from "../../types/friend"

type FriendCardProps = {
  friend: Friend
  friendUser: User
  isSent: boolean
  currentUserId: string
}

export default function FriendCard({ friend, friendUser, isSent, currentUserId }: FriendCardProps) {
  const handleUpdate = async (status: "ACCEPTED" | "REJECTED") => {
    try {
      await friendStore.update(friend.id, status)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{friendUser.name}</h2>
          <p className="text-gray-500">{friendUser.email}</p>
          <p className="text-sm mt-1">
            Status: <span className="font-medium">{friend.status}</span>
          </p>
          <p className="text-sm text-gray-400">
            {isSent ? "Sent" : "Received"} Request
          </p>
        </div>

        {!isSent && friend.status === "PENDING" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate("ACCEPTED")}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => handleUpdate("REJECTED")}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}