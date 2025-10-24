"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { EditBranchDialog } from "./edit-branch-dialog"

interface Branch {
  id: string
  name: string
  location: string
  phone: string
  email: string
  manager: string
  status: "active" | "inactive"
  roomsCount: number
}

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Downtown Branch",
    location: "123 Main St, City Center",
    phone: "+1 (555) 123-4567",
    email: "downtown@trainingcenter.com",
    manager: "John Smith",
    status: "active",
    roomsCount: 8,
  },
  {
    id: "2",
    name: "Uptown Branch",
    location: "456 Oak Ave, Uptown",
    phone: "+1 (555) 234-5678",
    email: "uptown@trainingcenter.com",
    manager: "Sarah Johnson",
    status: "active",
    roomsCount: 6,
  },
  {
    id: "3",
    name: "Westside Branch",
    location: "789 West Blvd, Westside",
    phone: "+1 (555) 345-6789",
    email: "westside@trainingcenter.com",
    manager: "Mike Davis",
    status: "inactive",
    roomsCount: 4,
  },
]

export function BranchesList() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBranches(branches.filter((b) => b.id !== id))
  }

  const handleSave = (updatedBranch: Branch) => {
    setBranches(branches.map((b) => (b.id === updatedBranch.id ? updatedBranch : b)))
    setEditDialogOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        {branches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No branches found. Create one to get started.</p>
          </Card>
        ) : (
          branches.map((branch) => (
            <Card key={branch.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{branch.name}</h3>
                    <Badge variant={branch.status === "active" ? "default" : "secondary"}>{branch.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {branch.location}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {branch.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {branch.email}
                    </div>
                    <div className="text-muted-foreground">
                      Manager: <span className="text-foreground font-medium">{branch.manager}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{branch.roomsCount}</span> rooms
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(branch)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(branch.id)}
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
      {editingBranch && (
        <EditBranchDialog
          branch={editingBranch}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
