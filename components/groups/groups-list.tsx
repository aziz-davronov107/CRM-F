"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Users, Calendar, Clock } from "lucide-react"
import { useState } from "react"
import { EditGroupDialog } from "./edit-group-dialog"

interface Group {
  id: string
  name: string
  course: string
  instructor: string
  schedule: string
  startDate: string
  endDate: string
  capacity: number
  enrolled: number
  status: "upcoming" | "ongoing" | "completed"
  room: string
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Web Dev Group A",
    course: "Web Development Fundamentals",
    instructor: "John Smith",
    schedule: "Mon, Wed, Fri - 10:00 AM",
    startDate: "2024-11-01",
    endDate: "2024-12-20",
    capacity: 30,
    enrolled: 28,
    status: "ongoing",
    room: "Room A1",
  },
  {
    id: "2",
    name: "React Advanced Group B",
    course: "Advanced React Patterns",
    instructor: "Sarah Johnson",
    schedule: "Tue, Thu - 2:00 PM",
    startDate: "2024-11-05",
    endDate: "2024-12-17",
    capacity: 20,
    enrolled: 18,
    status: "ongoing",
    room: "Room B1",
  },
  {
    id: "3",
    name: "Business Comm Group C",
    course: "Business Communication",
    instructor: "Mike Davis",
    schedule: "Mon, Wed - 3:00 PM",
    startDate: "2024-12-01",
    endDate: "2024-12-29",
    capacity: 25,
    enrolled: 22,
    status: "upcoming",
    room: "Room A2",
  },
  {
    id: "4",
    name: "Data Science Group A",
    course: "Data Science Basics",
    instructor: "Emily Brown",
    schedule: "Sat, Sun - 9:00 AM",
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    capacity: 25,
    enrolled: 24,
    status: "completed",
    room: "Room B2",
  },
]

export function GroupsList() {
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id))
  }

  const handleSave = (updatedGroup: Group) => {
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)))
    setEditDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "default"
      case "upcoming":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <>
      <div className="space-y-4">
        {groups.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No groups found. Create one to get started.</p>
          </Card>
        ) : (
          groups.map((group) => (
            <Card key={group.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                    <Badge variant={getStatusColor(group.status)}>{group.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{group.course}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="text-muted-foreground">
                      Instructor: <span className="text-foreground font-medium">{group.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {group.schedule}
                    </div>
                    <div className="text-muted-foreground">
                      Room: <span className="text-foreground font-medium">{group.room}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        <span className="text-foreground font-medium">{group.enrolled}</span>/{group.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {group.startDate} to {group.endDate}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(group)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
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
      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
