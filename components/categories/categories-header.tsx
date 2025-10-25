"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Filter, Plus } from "lucide-react"
import { useState } from "react"
import { useBranches } from "@/hooks/use-branches"
import { CreateCategoryDialog } from "./create-category-dialog"
import type { CategoriesFilters } from "@/lib/types"

interface CategoriesHeaderProps {
  filters: CategoriesFilters
  onFiltersChange: (filters: CategoriesFilters) => void
  totalCategories?: number
}

export function CategoriesHeader({ filters, onFiltersChange, totalCategories = 0 }: CategoriesHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { branches, refetch: refetchBranches } = useBranches({ 
    limit: 100, 
    enabled: false 
  })

  // Fetch branches when filter panel opens
  const handleToggleFilters = () => {
    const newShowFilters = !showFilters
    setShowFilters(newShowFilters)
    
    if (newShowFilters && branches.length === 0) {
      console.log('📚 Categories filter opened, fetching branches...')
      refetchBranches()
    }
  }

  const handleSearch = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value
    })
  }

  const handleBranchChange = (branchId: string) => {
    onFiltersChange({
      ...filters,
      branchId: branchId ? Number(branchId) : undefined
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      branchId: undefined
    })
  }

  const hasActiveFilters = filters.branchId || filters.search

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Course Categories</h1>
                <p className="text-sm text-muted-foreground">
                  Organize courses by categories
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-4">
              {totalCategories} total
            </Badge>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories by name..."
              value={filters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={handleToggleFilters}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  1
                </Badge>
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select 
                  value={filters.branchId?.toString() || ""} 
                  onValueChange={handleBranchChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name} - {branch.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={clearFilters} size="sm" variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <CreateCategoryDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        branchId={filters.branchId}
      />
    </>
  )
}
