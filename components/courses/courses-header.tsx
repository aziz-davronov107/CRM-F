"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateCourseDialog } from "./create-course-dialog"

export function CoursesHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground mt-1">Manage training courses and programs</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Course
          </Button>
        </div>
      </div>
      <CreateCourseDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
