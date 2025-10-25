"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useBranches } from "@/hooks/use-branches"
import { useCenters } from "@/hooks/use-centers"
import { Branch, UpdateBranchData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditBranchDialogProps {
  branch: Branch
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function EditBranchDialog({ branch, open, onOpenChange, onSave }: EditBranchDialogProps) {
  const { updateBranch } = useBranches()
  const { centers, loading: centersLoading, refetch: refetchCenters } = useCenters({ 
    limit: 100,
    enabled: false  // Don't auto-fetch, we'll manual fetch when needed
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Fetch centers when modal opens
  useEffect(() => {
    if (open && centers.length === 0) {
      console.log('🏢 Edit modal opened, fetching centers...')
      refetchCenters()
    }
  }, [open, refetchCenters, centers.length])
  
  const [formData, setFormData] = useState<UpdateBranchData>({
    name: branch.name,
    region: branch.region,
    district: branch.district,
    address: branch.address,
    phone: branch.phone,
    status: branch.status,
    center_id: branch.center_id,
  })

  useEffect(() => {
    setFormData({
      name: branch.name,
      region: branch.region,
      district: branch.district,
      address: branch.address,
      phone: branch.phone,
      status: branch.status,
      center_id: branch.center_id,
    })
  }, [branch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔄 Updating branch, waiting for completion...')
      await updateBranch(branch.id, formData)
      console.log('✅ Branch updated, now refreshing data...')
      
      // Wait for parent component to refresh data
      if (onSave) {
        await onSave()
      }
      
      console.log('✅ Data refreshed, showing success and closing modal...')
      toast({
        title: "Success",
        description: "Branch updated successfully",
      })
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        onOpenChange(false)
      }, 500)
      
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to update branch",
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
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name</Label>
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
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region || ""}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={formData.district || ""}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              disabled={loading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Format: +998XXXXXXXXX</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="center">Center</Label>
            <Select 
              value={formData.center_id?.toString() || ""} 
              onValueChange={(value) => setFormData({ ...formData, center_id: parseInt(value) })}
              disabled={loading || centersLoading}
            >
              <SelectTrigger id="center">
                <SelectValue placeholder="Select center" />
              </SelectTrigger>
              <SelectContent>
                {centers.map((center) => (
                  <SelectItem key={center.id} value={center.id.toString()}>
                    {center.name} - {center.region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {centersLoading && (
              <p className="text-xs text-muted-foreground">Loading centers...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "ACTIVE" | "INACTIVE") => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
