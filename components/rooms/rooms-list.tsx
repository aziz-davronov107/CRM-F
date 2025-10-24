"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Users, Projector } from "lucide-react"
import { useState } from "react"
import { EditRoomDialog } from "./edit-room-dialog"

interface Room {
  id: string
  name: string
  branch: string
  capacity: number
  equipment: string[]
  status: "available" | "occupied" | "maintenance"
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Room A1",
    branch: "Downtown Branch",
    capacity: 30,
    equipment: ["Projector", "Whiteboard", "AC"],
    status: "available",
  },
  {
    id: "2",
    name: "Room A2",
    branch: "Downtown Branch",
    capacity: 25,
    equipment: ["Projector", "Smart Board", "AC"],
    status: "occupied",
  },
  {
    id: "3",
    name: "Room B1",
    branch: "Uptown Branch",
    capacity: 40,
    equipment: ["Projector", "Whiteboard", "AC", "Sound System"],
    status: "available",
  },
  {
    id: "4",
    name: "Room B2",
    branch: "Uptown Branch",
    capacity: 20,
    equipment: ["Whiteboard", "AC"],
    status: "maintenance",
  },
]

export function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id))
  }

  const handleSave = (updatedRoom: Room) => {
    setRooms(rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)))
    setEditDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "occupied":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <>
      <div className="space-y-4">
        {rooms.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No rooms found. Create one to get started.</p>
          </Card>
        ) : (
          rooms.map((room) => (
            <Card key={room.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                    <Badge variant={getStatusColor(room.status)}>{room.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="text-muted-foreground">
                      Branch: <span className="text-foreground font-medium">{room.branch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Capacity: <span className="text-foreground font-medium">{room.capacity}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.equipment.map((item) => (
                      <Badge key={item} variant="outline" className="gap-1">
                        <Projector className="w-3 h-3" />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(room)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(room.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      {editingRoom && (
        <EditRoomDialog room={editingRoom} open={editDialogOpen} onOpenChange={setEditDialogOpen} onSave={handleSave} />
      )}
    </>
  )
}
