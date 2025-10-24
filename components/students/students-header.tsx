"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useState } from "react"
import { CreateStudentDialog } from "./create-student-dialog"

export function StudentsHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student enrollments and information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </div>
      </div>
      <CreateStudentDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
