"use client"

import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export function FinanceHeader() {
  return (
    <div className="border-b border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground mt-1">Track revenue, expenses, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </div>
      </div>
    </div>
  )
}
