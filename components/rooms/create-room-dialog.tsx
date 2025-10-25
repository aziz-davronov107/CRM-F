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
import { CreateRoomData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateRoomDialog({ open, onOpenChange, onSuccess }: CreateRoomDialogProps) {
  const { createRoom } = useRooms()
  const { branches, loading: branchesLoading, refetch: refetchBranches } = useBranches({ 
    limit: 100,
    enabled: false  // Don't auto-fetch, we'll manual fetch when needed
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Fetch branches when modal opens
  useEffect(() => {
    if (open && branches.length === 0) {
      console.log('🏠 Create room modal opened, fetching branches...')
      refetchBranches()
    }
  }, [open, refetchBranches, branches.length])
  
  const [formData, setFormData] = useState<CreateRoomData>({
    name: "",
    branch_id: 0,
    capacity: 1,
  })

  // Set first branch as default when branches load
  useEffect(() => {
    if (branches.length > 0 && formData.branch_id === 0) {
      setFormData(prev => ({ ...prev, branch_id: branches[0].id }))
    }
  }, [branches, formData.branch_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.branch_id === 0) {
      toast({
        title: "Error",
        description: "Please select a branch",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)

    try {
      console.log('🚀 Creating room, waiting for completion...')
      await createRoom(formData)
      console.log('✅ Room created, now refreshing data...')
      
      // Wait for parent component to refresh data
      if (onSuccess) {
        await onSuccess()
      }
      
      console.log('✅ Data refreshed, showing success and closing modal...')
      toast({
        title: "Success",
        description: "Room created successfully",
      })
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 500)
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create room",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      branch_id: branches.length > 0 ? branches[0].id : 0,
      capacity: 1,
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
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
              placeholder="e.g., A-101"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select 
                value={formData.branch_id > 0 ? formData.branch_id.toString() : ""} 
                onValueChange={(value) => setFormData({ ...formData, branch_id: parseInt(value) })}
                disabled={loading || branchesLoading}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select branch"} />
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
              {!branchesLoading && branches.length === 0 && (
                <p className="text-xs text-muted-foreground text-red-500">No branches found</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 25"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                required
                disabled={loading}
                min="1"
              />
              <p className="text-xs text-muted-foreground">Number of students the room can accommodate</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
