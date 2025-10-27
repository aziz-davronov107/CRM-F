"use client"

import { BranchesHeader } from "@/components/branches/branches-header"
import { BranchesList } from "@/components/branches/branches-list"
import { useState } from "react"

export default function BranchesPage() {
  const [filters, setFilters] = useState<{
    center_id?: number
    region?: string
    status?: "ACTIVE" | "INACTIVE"
    search?: string
  }>({})

  return (
    <div className="min-h-screen bg-background">
      <BranchesHeader onFiltersChange={setFilters} />
      <div className="p-6">
        <BranchesList 
          centerId={filters.center_id}
          region={filters.region}
          status={filters.status}
        />
      </div>
    </div>
  )
}
