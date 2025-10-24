"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center px-4 z-40">
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(!open)} className="text-sidebar-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
        <div className="ml-4 font-bold text-sidebar-foreground">Training Center</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => onOpenChange(false)} />}

      {/* Mobile Sidebar */}
      {open && (
        <div className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40 overflow-y-auto">
          <Sidebar />
        </div>
      )}

      {/* Content offset for mobile */}
      <div className="md:hidden h-16" />
    </>
  )
}
