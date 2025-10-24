"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, BookOpen } from "lucide-react"
import { useState } from "react"
import { EditCategoryDialog } from "./edit-category-dialog"

interface Category {
  id: string
  name: string
  description: string
  color: string
  coursesCount: number
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    description: "Tech and programming courses",
    color: "bg-blue-500",
    coursesCount: 12,
  },
  {
    id: "2",
    name: "Business",
    description: "Business and management courses",
    color: "bg-green-500",
    coursesCount: 8,
  },
  {
    id: "3",
    name: "Design",
    description: "Design and creative courses",
    color: "bg-purple-500",
    coursesCount: 6,
  },
  {
    id: "4",
    name: "Marketing",
    description: "Marketing and sales courses",
    color: "bg-orange-500",
    coursesCount: 5,
  },
]

export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const handleSave = (updatedCategory: Category) => {
    setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)))
    setEditDialogOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <p className="text-muted-foreground">No categories found. Create one to get started.</p>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${category.color} opacity-20`} />
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>
                  <span className="font-medium text-foreground">{category.coursesCount}</span> courses
                </span>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="flex-1 gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
