"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import { useBranches } from "@/hooks/use-branches"
import { createCategorySchema } from "@/lib/schemas"
import { toast } from "@/hooks/use-toast"
import type { CreateCategoryData } from "@/lib/types"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branchId?: number
}



export function CreateCategoryDialog({ open, onOpenChange, branchId }: CreateCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    branchId: branchId || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createCategory, isLoading } = useCategories({ 
    branch_id: branchId || undefined,
    enabled: false 
  })
  const { branches, isLoading: branchesLoading } = useBranches({ enabled: !branchId })

  const resetForm = () => {
    setFormData({
      name: "",
      branchId: branchId || "",
    })
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const validData = createCategorySchema.parse({
        name: formData.name,
        branch_id: Number(formData.branchId),
      })

      await createCategory(validData)
      
      toast({
        title: "Success",
        description: "Category created successfully",
      })

      // Optimized modal closing with delay
      setTimeout(() => {
        onOpenChange(false)
        resetForm()
      }, 500)
    } catch (error: any) {
      console.error("Create category error:", error)
      
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
          description: error.response?.data?.message || "Failed to create category",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!branchId && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Programming Languages"
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
              disabled={isLoading || (!branchId && !formData.branchId)}
            >
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
