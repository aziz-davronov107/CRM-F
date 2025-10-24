import { GroupsHeader } from "@/components/groups/groups-header"
import { GroupsList } from "@/components/groups/groups-list"

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="text-gray-600 mt-1">Manage your groups</p>
      </div>
      <GroupsList />
    </div>
  )
}
