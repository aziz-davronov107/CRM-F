"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreateRoomDialog } from "./create-room-dialog"

export function RoomsHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rooms</h1>
            <p className="text-muted-foreground mt-1">Manage training rooms across branches</p>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Room
          </Button>
        </div>
      </div>
      <CreateRoomDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
