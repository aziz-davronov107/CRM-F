"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface Room {
  id: string
  name: string
  branch: string
  capacity: number
  equipment: string[]
  status: "available" | "occupied" | "maintenance"
}

interface EditRoomDialogProps {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (room: Room) => void
}

const equipmentOptions = ["Projector", "Smart Board", "Whiteboard", "AC", "Sound System", "WiFi", "Microphone"]

export function EditRoomDialog({ room, open, onOpenChange, onSave }: EditRoomDialogProps) {
  const [formData, setFormData] = useState(room)

  useEffect(() => {
    setFormData(room)
  }, [room])

  const handleEquipmentChange = (item: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.includes(item)
        ? formData.equipment.filter((e) => e !== item)
        : [...formData.equipment, item],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                <SelectTrigger id="branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                  <SelectItem value="Uptown Branch">Uptown Branch</SelectItem>
                  <SelectItem value="Westside Branch">Westside Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Equipment</Label>
            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={formData.equipment.includes(item)}
                    onCheckedChange={() => handleEquipmentChange(item)}
                  />
                  <Label htmlFor={item} className="font-normal cursor-pointer">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as "available" | "occupied" | "maintenance" })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
