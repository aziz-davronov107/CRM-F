"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateCategoryDialog } from "./create-category-dialog"

export function CategoriesHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage course categories</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>
      <CreateCategoryDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
