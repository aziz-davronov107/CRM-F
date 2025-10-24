"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useState } from "react"
import { CreateTeacherDialog } from "./create-teacher-dialog"

export function TeachersHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-muted-foreground mt-1">Manage instructor information and assignments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
          </div>
        </div>
      </div>
      <CreateTeacherDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
