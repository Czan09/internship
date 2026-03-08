type FriendTabsProps = {
  activeTab: "PENDING" | "ACCEPTED" | "REJECTED"
  setActiveTab: (tab: "PENDING" | "ACCEPTED" | "REJECTED") => void
}

export default function FriendTabs({ activeTab, setActiveTab }: FriendTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      {["PENDING", "ACCEPTED", "REJECTED"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}