"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit2, Trash2, BookOpen, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { EditCategoryDialog } from "./edit-category-dialog"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "@/hooks/use-toast"
import type { CourseCategory, CategoriesFilters } from "@/lib/types"

interface CategoriesListProps {
  filters: CategoriesFilters
}

export function CategoriesList({ filters }: CategoriesListProps) {
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CourseCategory | null>(null)

  const { categories, isLoading, deleteCategory, isDeleting } = useCategories({ 
    branch_id: filters.branchId,
    enabled: true
  })

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (category: CourseCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      await deleteCategory(categoryToDelete.id)
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (error: any) {
      console.error("Delete category error:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  // Filter categories based on search query
  const filteredCategories = categories?.filter(category => {
    if (filters.search) {
      return category.name.toLowerCase().includes(filters.search.toLowerCase())
    }
    return true
  }) || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-10" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">
              {filters.search ? "No categories found matching your search." : "No categories found."}
            </p>
            <p className="text-sm text-muted-foreground">
              {filters.search ? "Try adjusting your search terms." : "Create your first category to get started."}
            </p>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id} className="p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10"
                  >
                    <div 
                      className="w-6 h-6 rounded bg-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{category.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Category for organizing courses
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>
                  <span className="font-medium text-foreground">{category._count?.courses || 0}</span> courses
                </span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(category)} 
                  className="flex-1 gap-2 hover:bg-primary/5"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(category)}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <EditCategoryDialog
        category={editingCategory}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{categoryToDelete?.name}</span>? 
              This action cannot be undone and will affect {categoryToDelete?._count?.courses || 0} courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
