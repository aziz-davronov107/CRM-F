"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateBranchDialog } from "./create-branch-dialog"

export function BranchesHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branches</h1>
            <p className="text-muted-foreground mt-1">Manage training center branches</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Branch
          </Button>
        </div>
      </div>
      <CreateBranchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
