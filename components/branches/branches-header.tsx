"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Building2 } from "lucide-react"
import { useState } from "react"
import { CreateBranchDialog } from "./create-branch-dialog"
import { useBranches } from "@/hooks/use-branches"
import { useCenters } from "@/hooks/use-centers"

interface BranchesHeaderProps {
  onFiltersChange?: (filters: {
    center_id?: number
    region?: string
    status?: "ACTIVE" | "INACTIVE"
    search?: string
  }) => void
}

export function BranchesHeader({ onFiltersChange }: BranchesHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    center_id: "",
    region: "",
    status: "",
    search: "",
  })

  const { branches } = useBranches({ limit: 1000 })
  const { centers } = useCenters({ limit: 100 })

  // Get unique regions from branches
  const regions = Array.from(new Set(branches.map(b => b.region))).filter(Boolean)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const cleanFilters: any = {}
    if (newFilters.center_id) cleanFilters.center_id = parseInt(newFilters.center_id)
    if (newFilters.region) cleanFilters.region = newFilters.region
    if (newFilters.status) cleanFilters.status = newFilters.status as "ACTIVE" | "INACTIVE"
    if (newFilters.search) cleanFilters.search = newFilters.search
    
    onFiltersChange?.(cleanFilters)
  }

  const clearFilters = () => {
    setFilters({ center_id: "", region: "", status: "", search: "" })
    onFiltersChange?.({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-8 h-8" />
                Branches
              </h1>
              <p className="text-muted-foreground mt-1">Manage training center branches</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search branches..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
            
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Branch
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-1">
                <label className="text-sm font-medium">Center</label>
                <Select value={filters.center_id} onValueChange={(value) => handleFilterChange("center_id", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All centers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All centers</SelectItem>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Region</label>
                <Select value={filters.region} onValueChange={(value) => handleFilterChange("region", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CreateBranchDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          // Refresh will be handled by the hook
        }}
      />
    </>
  )
}
