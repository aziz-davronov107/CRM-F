"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateGroupDialog } from "./create-group-dialog"

export function GroupsHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground mt-1">Manage training groups and schedules</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Group
          </Button>
        </div>
      </div>
      <CreateGroupDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
