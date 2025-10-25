"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { useCategories } from "@/hooks/use-categories"
import { useBranches } from "@/hooks/use-branches"
import { updateCategorySchema } from "@/lib/schemas"
import { toast } from "@/hooks/use-toast"
import type { CourseCategory, UpdateCategoryData } from "@/lib/types"

interface EditCategoryDialogProps {
  category: CourseCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}



export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { updateCategory, isLoading } = useCategories({ 
    branch_id: category?.branch_id,
    enabled: false 
  })
  const { branches, isLoading: branchesLoading } = useBranches()

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        branchId: category.branch_id.toString(),
      })
    }
  }, [category])

  const resetForm = () => {
    if (category) {
      setFormData({
        name: category.name,
        branchId: category.branch_id.toString(),
      })
    }
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return
    
    setErrors({})

    try {
      const validData = updateCategorySchema.parse({
        name: formData.name,
        branch_id: Number(formData.branchId),
      })

      await updateCategory(category.id, validData)
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      // Optimized modal closing with delay
      setTimeout(() => {
        onOpenChange(false)
      }, 500)
    } catch (error: any) {
      console.error("Update category error:", error)
      
      if (error.name === "ZodError") {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update category",
          variant: "destructive",
        })
      }
    }
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branchId">Branch</Label>
            <Select
              value={formData.branchId.toString()}
              onValueChange={(value) => setFormData({ ...formData, branchId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches?.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && (
              <Alert variant="destructive">
                <AlertDescription>{errors.branchId}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                onOpenChange(false)
                resetForm()
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.branchId}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
