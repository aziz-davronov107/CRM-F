"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Filter, Plus } from "lucide-react"
import { useState } from "react"
import { useBranches } from "@/hooks/use-branches"
import { CreateRoomDialog } from "./create-room-dialog"

interface RoomsHeaderProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: any) => void
  totalRooms?: number
}

export function RoomsHeader({ onSearch, onFilterChange, totalRooms = 0 }: RoomsHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [capacityMin, setCapacityMin] = useState<string>("")
  const [capacityMax, setCapacityMax] = useState<string>("")
  
  const { branches } = useBranches({ limit: 100 })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilterChange = () => {
    const filters: any = {}
    
    if (selectedBranch) filters.branch_id = parseInt(selectedBranch)
    if (capacityMin) filters.capacity_min = parseInt(capacityMin)
    if (capacityMax) filters.capacity_max = parseInt(capacityMax)
    
    onFilterChange?.(filters)
  }

  const clearFilters = () => {
    setSelectedBranch("")
    setCapacityMin("")
    setCapacityMax("")
    onFilterChange?.({})
  }

  const hasActiveFilters = selectedBranch || capacityMin || capacityMax

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Rooms</h1>
                <p className="text-sm text-muted-foreground">
                  Manage classroom spaces and capacity
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-4">
              {totalRooms} total
            </Badge>
          </div>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search rooms by name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {[selectedBranch, capacityMin, capacityMax].filter(Boolean).length}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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
                <label className="text-sm font-medium">Min Capacity</label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={capacityMin}
                  onChange={(e) => setCapacityMin(e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Capacity</label>
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  value={capacityMax}
                  onChange={(e) => setCapacityMax(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button onClick={handleFilterChange} size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <CreateRoomDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={async () => {
          console.log('🔄 Room created, data will refresh automatically')
          // Data refresh is handled by useRooms hook automatically
        }}
      />
    </>
  )
}
