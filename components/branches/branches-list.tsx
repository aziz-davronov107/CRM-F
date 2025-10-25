"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit2, Trash2, MapPin, Phone, Building2, Users, BookOpen, AlertCircle } from "lucide-react"
import React, { useState, useEffect } from "react"
import { EditBranchDialog } from "./edit-branch-dialog"
import { useBranches } from "@/hooks/use-branches"
import { Branch } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface BranchesListProps {
  centerId?: number
  region?: string
  status?: "ACTIVE" | "INACTIVE"
}

export function BranchesList({ centerId, region, status }: BranchesListProps) {
  const { branches, loading, error, deleteBranch } = useBranches({
    center_id: centerId,
    region,
    status,
    limit: 50
  })
  
  // Debug info
  console.log('🔍 BranchesList render:', { 
    branches: branches,
    branchesCount: branches.length,
    loading: loading, 
    error: error,
    centerId,
    region,
    status
  })
  
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  // Force show data if loading is stuck
  useEffect(() => {
    if (loading) {
      console.log('⏳ Still loading after 3 seconds, branches count:', branches.length)
      setTimeout(() => {
        if (loading && branches.length > 0) {
          console.log('🔧 Loading seems stuck, but we have data. Forcing render.')
        }
      }, 3000)
    }
  }, [loading, branches.length])

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    const branch = branches.find(b => b.id === id)
    const branchName = branch?.name || `Branch #${id}`
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${branchName}"? This action cannot be undone.`
    )
    
    if (!confirmed) {
      console.log('🚫 Delete cancelled by user')
      return
    }

    try {
      console.log('🗑️ Starting delete for branch:', id)
      setDeletingId(id)
      
      await deleteBranch(id)
      
      console.log('✅ Branch deleted successfully:', id)
      toast({
        title: "Success",
        description: `"${branchName}" deleted successfully`,
      })
    } catch (error: any) {
      console.error('❌ Delete error:', error)
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete branch"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveSuccess = async () => {
    console.log('🔄 handleSaveSuccess: Refreshing branches data...')
    // Don't close modal here - let the dialog component handle it
    setEditingBranch(null)
    
    // Force refresh the data
    // The useBranches hook will automatically refresh after create/update
    console.log('✅ handleSaveSuccess: Data refresh completed')
  }

  // Show data if we have it, even if loading is true
  const shouldShowData = branches.length > 0
  const shouldShowLoading = loading && branches.length === 0

  if (shouldShowLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!shouldShowLoading && branches.length === 0 && !error) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-2">No branches found</p>
        <p className="text-sm text-muted-foreground">
          {centerId || region || status 
            ? "Try adjusting your filters or create a new branch."
            : "Create your first branch to get started."
          }
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {branches.map((branch) => (
          <Card key={branch.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{branch.name}</h3>
                  <Badge variant={branch.status === "ACTIVE" ? "default" : "secondary"}>
                    {branch.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{branch.address}, {branch.district}, {branch.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {branch.phone}
                  </div>
                  {branch.center && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {branch.center.name}
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {branch.rooms && branch.rooms.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium text-foreground">{branch.rooms.length}</span> rooms
                    </div>
                  )}
                  {branch.courses && branch.courses.length > 0 && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium text-foreground">{branch.courses.length}</span> courses
                    </div>
                  )}
                  {branch.teachers && branch.teachers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-foreground">{branch.teachers.length}</span> teachers
                    </div>
                  )}
                  {branch.groups && branch.groups.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-foreground">{branch.groups.length}</span> groups
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Created: {new Date(branch.createdAt).toLocaleDateString()}
                  {branch.updatedAt !== branch.createdAt && (
                    <span className="ml-3">
                      Updated: {new Date(branch.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(branch)} 
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(branch.id)}
                  disabled={deletingId === branch.id}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === branch.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {editingBranch && (
        <EditBranchDialog
          branch={editingBranch}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  )
}
