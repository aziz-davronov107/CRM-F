import { RoomsHeader } from "@/components/rooms/rooms-header"
import { RoomsList } from "@/components/rooms/rooms-list"

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <p className="text-gray-600 mt-1">Manage your rooms</p>
      </div>
      <RoomsList />
    </div>
  )
}
