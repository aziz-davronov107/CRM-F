"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const equipmentOptions = ["Projector", "Smart Board", "Whiteboard", "AC", "Sound System", "WiFi", "Microphone"]

export function CreateRoomDialog({ open, onOpenChange }: CreateRoomDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    capacity: "",
    equipment: [] as string[],
    status: "available",
  })

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
    // Handle form submission
    onOpenChange(false)
    setFormData({
      name: "",
      branch: "",
      capacity: "",
      equipment: [],
      status: "available",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              placeholder="e.g., Room A1"
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
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown">Downtown Branch</SelectItem>
                  <SelectItem value="uptown">Uptown Branch</SelectItem>
                  <SelectItem value="westside">Westside Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 30"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
            <Button type="submit">Create Room</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
