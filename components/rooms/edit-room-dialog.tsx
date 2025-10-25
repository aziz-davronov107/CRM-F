"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRooms } from "@/hooks/use-rooms"
import { useBranches } from "@/hooks/use-branches"
import { Room, UpdateRoomData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditRoomDialogProps {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function EditRoomDialog({ room, open, onOpenChange, onSave }: EditRoomDialogProps) {
  const { updateRoom } = useRooms()
  const { branches, loading: branchesLoading, refetch: refetchBranches } = useBranches({ 
    limit: 100,
    enabled: false  // Don't auto-fetch, we'll manual fetch when needed
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Fetch branches when modal opens
  useEffect(() => {
    if (open && branches.length === 0) {
      console.log('🏠 Edit room modal opened, fetching branches...')
      refetchBranches()
    }
  }, [open, refetchBranches, branches.length])
  
  const [formData, setFormData] = useState<UpdateRoomData>({
    name: room.name,
    branch_id: room.branch_id,
    capacity: room.capacity,
  })

  useEffect(() => {
    setFormData({
      name: room.name,
      branch_id: room.branch_id,
      capacity: room.capacity,
    })
  }, [room])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔄 Updating room, waiting for completion...')
      await updateRoom(room.id, formData)
      console.log('✅ Room updated, now refreshing data...')
      
      // Wait for parent component to refresh data
      if (onSave) {
        await onSave()
      }
      
      console.log('✅ Data refreshed, showing success and closing modal...')
      toast({
        title: "Success",
        description: "Room updated successfully",
      })
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        onOpenChange(false)
      }, 500)
      
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to update room",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select 
                value={formData.branch_id?.toString() || ""} 
                onValueChange={(value) => setFormData({ ...formData, branch_id: parseInt(value) })}
                disabled={loading || branchesLoading}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name} - {branch.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {branchesLoading && (
                <p className="text-xs text-muted-foreground">Loading branches...</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                required
                disabled={loading}
                min="1"
              />
              <p className="text-xs text-muted-foreground">Number of students the room can accommodate</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
