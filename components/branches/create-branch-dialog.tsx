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
import { CreateBranchData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateBranchDialog({ open, onOpenChange, onSuccess }: CreateBranchDialogProps) {
  const { createBranch } = useBranches()

  const { centers, loading: centersLoading, refetch: refetchCenters } = useCenters({ 
    limit: 100,
    enabled: false  // Don't auto-fetch, we'll manual fetch when needed
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Fetch centers when modal opens
  useEffect(() => {
    if (open && centers.length === 0) {
      console.log('🏢 Modal opened, fetching centers...')
      refetchCenters()
    }
  }, [open, refetchCenters, centers.length])
  
  const [formData, setFormData] = useState<CreateBranchData>({
    name: "",
    region: "",
    district: "",
    address: "",
    phone: "",
    status: "ACTIVE",
    center_id: 0, // Will be set when centers load
  })

  // Set first center as default when centers load
  useEffect(() => {
    if (centers.length > 0 && formData.center_id === 0) {
      setFormData(prev => ({ ...prev, center_id: centers[0].id }))
    }
  }, [centers, formData.center_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.center_id === 0) {
      toast({
        title: "Error",
        description: "Please select a center",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)

    try {
      console.log('🚀 Creating branch, waiting for completion...')
      await createBranch(formData)
      console.log('✅ Branch created, now refreshing data...')
      
      // Wait for parent component to refresh data
      if (onSuccess) {
        await onSuccess()
      }
      
      console.log('✅ Data refreshed, showing success and closing modal...')
      toast({
        title: "Success",
        description: "Branch created successfully",
      })
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 500)
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create branch",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      region: "",
      district: "",
      address: "",
      phone: "",
      status: "ACTIVE",
      center_id: centers.length > 0 ? centers[0].id : 0,
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
          <DialogTitle>Create New Branch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input
              id="name"
              placeholder="e.g., Chilonzor filiali"
              value={formData.name}
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
                placeholder="e.g., Toshkent"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                placeholder="e.g., Chilonzor"
                value={formData.district}
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
              placeholder="e.g., Chilonzor 9-kvartal"
              value={formData.address}
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
              placeholder="+998901234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Format: +998XXXXXXXXX</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="center">Center</Label>
            <Select 
              value={formData.center_id > 0 ? formData.center_id.toString() : ""} 
              onValueChange={(value) => setFormData({ ...formData, center_id: parseInt(value) })}
              disabled={loading || centersLoading}
            >
              <SelectTrigger id="center">
                <SelectValue placeholder={centersLoading ? "Loading centers..." : "Select center"} />
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
            {!centersLoading && centers.length === 0 && (
              <p className="text-xs text-muted-foreground text-red-500">No centers found</p>
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Branch
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
