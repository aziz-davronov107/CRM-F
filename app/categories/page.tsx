"use client"

import { CategoriesHeader } from "@/components/categories/categories-header"
import { CategoriesList } from "@/components/categories/categories-list"
import { useState } from "react"
import type { CategoriesFilters } from "@/lib/types"

export default function CategoriesPage() {
  const [filters, setFilters] = useState<CategoriesFilters>({
    search: "",
    branchId: undefined,
  })

  return (
    <div className="flex-1 flex flex-col">
      <CategoriesHeader filters={filters} onFiltersChange={setFilters} />
      <main className="flex-1 overflow-auto p-6">
        <CategoriesList filters={filters} />
      </main>
    </div>
  )
}
