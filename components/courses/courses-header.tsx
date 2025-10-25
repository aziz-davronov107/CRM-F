"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Filter, Plus, DollarSign, Clock } from "lucide-react"
import { useState } from "react"
import { useBranches } from "@/hooks/use-branches"
import { useCategories } from "@/hooks/use-categories"
import { CreateCourseDialog } from "./create-course-dialog"
import type { CoursesFilters } from "@/lib/types"

interface CoursesHeaderProps {
  filters: CoursesFilters
  onFiltersChange: (filters: CoursesFilters) => void
  totalCourses?: number
}

export function CoursesHeader({ filters, onFiltersChange, totalCourses = 0 }: CoursesHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const { branches, refetch: refetchBranches } = useBranches({ 
    limit: 100, 
    enabled: false 
  })

  const { categories, refetch: refetchCategories } = useCategories({ 
    branch_id: filters.branchId,
    limit: 100, 
    enabled: false 
  })

  // Fetch branches when filter panel opens
  const handleToggleFilters = () => {
    const newShowFilters = !showFilters
    setShowFilters(newShowFilters)
    
    if (newShowFilters && branches.length === 0) {
      console.log('📚 Courses filter opened, fetching branches...')
      refetchBranches()
    }
  }

  // Fetch categories when branch changes
  const handleBranchChange = (branchId: string) => {
    const newBranchId = branchId ? Number(branchId) : undefined
    onFiltersChange({
      ...filters,
      branchId: newBranchId,
      categoryId: undefined, // Reset category when branch changes
    })
    
    if (newBranchId && categories.length === 0) {
      console.log('📚 Branch changed, fetching categories for branch:', newBranchId)
      refetchCategories()
    }
  }

  const handleSearch = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value
    })
  }

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status ? (status as "ACTIVE" | "INACTIVE") : undefined
    })
  }

  const handlePriceMinChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priceMin: value ? Number(value) : undefined
    })
  }

  const handlePriceMaxChange = (value: string) => {
    onFiltersChange({
      ...filters,
      priceMax: value ? Number(value) : undefined
    })
  }

  const handleDurationMinChange = (value: string) => {
    onFiltersChange({
      ...filters,
      durationMin: value ? Number(value) : undefined
    })
  }

  const handleDurationMaxChange = (value: string) => {
    onFiltersChange({
      ...filters,
      durationMax: value ? Number(value) : undefined
    })
  }

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId ? Number(categoryId) : undefined
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      branchId: undefined,
      categoryId: undefined,
      status: undefined,
      priceMin: undefined,
      priceMax: undefined,
      durationMin: undefined,
      durationMax: undefined,
    })
  }

  const hasActiveFilters = filters.branchId || filters.categoryId || filters.status || 
                          filters.priceMin || filters.priceMax || filters.durationMin || 
                          filters.durationMax || filters.search

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Courses</h1>
                <p className="text-sm text-muted-foreground">
                  Manage training courses and programs
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-4">
              {totalCourses} total
            </Badge>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses by name..."
              value={filters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button 
            variant="outline" 
            onClick={handleToggleFilters}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {[
                  filters.branchId && 'Branch',
                  filters.categoryId && 'Category', 
                  filters.status && 'Status',
                  filters.priceMin && 'Price Min',
                  filters.priceMax && 'Price Max',
                  filters.durationMin && 'Duration Min',
                  filters.durationMax && 'Duration Max'
                ].filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={filters.categoryId?.toString() || ""} 
                  onValueChange={handleCategoryChange}
                  disabled={!filters.branchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={filters.status || ""} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin?.toString() || ""}
                  onChange={(e) => handlePriceMinChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="5000000"
                  value={filters.priceMax?.toString() || ""}
                  onChange={(e) => handlePriceMaxChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Min Duration (months)
                </label>
                <Input
                  type="number"
                  placeholder="1"
                  value={filters.durationMin?.toString() || ""}
                  onChange={(e) => handleDurationMinChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Max Duration (months)
                </label>
                <Input
                  type="number"
                  placeholder="12"
                  value={filters.durationMax?.toString() || ""}
                  onChange={(e) => handleDurationMaxChange(e.target.value)}
                />
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
      
      <CreateCourseDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        branchId={filters.branchId}
      />
    </>
  )
}
