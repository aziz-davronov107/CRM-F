"use client"

import { useState } from "react"
import { Plus, Search, Filter, X } from "lucide-react"
import { GroupFilters, DayOfWeek, GroupStatus } from "@/lib/types"
import { useBranches } from "@/hooks/use-branches"
import { useCourses } from "@/hooks/use-courses"
import { CreateGroupDialog } from "./create-group-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface GroupsHeaderProps {
  filters: GroupFilters
  onFiltersChange: (filters: Partial<GroupFilters>) => void
  totalGroups: number
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
]

const GROUP_STATUSES: { value: GroupStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

export function GroupsHeader({ filters, onFiltersChange, totalGroups }: GroupsHeaderProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const { branches } = useBranches({ enabled: true })
  const { courses } = useCourses({ enabled: true })

  const clearFilters = () => {
    onFiltersChange({
      branch_id: undefined,
      course_id: undefined,
      status: undefined,
      day: undefined,
      start_date_from: undefined,
      start_date_to: undefined,
      name: undefined,
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.branch_id) count++
    if (filters.course_id) count++
    if (filters.status) count++
    if (filters.day) count++
    if (filters.start_date_from) count++
    if (filters.start_date_to) count++
    if (filters.name) count++
    return count
  }

  return (
    <>
      <div className="space-y-4 p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-muted-foreground mt-1">
              Manage training groups and schedules ({totalGroups} total)
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Group
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={filters.name || ""}
                onChange={(e) => onFiltersChange({ name: e.target.value || undefined })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => 
                onFiltersChange({ status: value === "all" ? undefined : value as GroupStatus })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {GROUP_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.branch_id?.toString() || "all"}
              onValueChange={(value) => 
                onFiltersChange({ branch_id: value === "all" ? undefined : parseInt(value) })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1 min-w-5 h-5">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Advanced Filters</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2"
                    >
                      Clear all
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {/* Course Filter */}
                    <div className="space-y-2">
                      <Label>Course</Label>
                      <Select
                        value={filters.course_id?.toString() || "all"}
                        onValueChange={(value) => 
                          onFiltersChange({ course_id: value === "all" ? undefined : parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>



                    {/* Day Filter */}
                    <div className="space-y-2">
                      <Label>Day</Label>
                      <Select
                        value={filters.day || "all"}
                        onValueChange={(value) => 
                          onFiltersChange({ day: value === "all" ? undefined : value as DayOfWeek })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Days</SelectItem>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Date From</Label>
                        <Input
                          type="date"
                          value={filters.start_date_from || ""}
                          onChange={(e) => 
                            onFiltersChange({ start_date_from: e.target.value || undefined })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date To</Label>
                        <Input
                          type="date"
                          value={filters.start_date_to || ""}
                          onChange={(e) => 
                            onFiltersChange({ start_date_to: e.target.value || undefined })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.name && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ name: undefined })}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ status: undefined })}
                />
              </Badge>
            )}
            {filters.branch_id && (
              <Badge variant="secondary" className="gap-1">
                Branch: {branches.find(b => b.id === filters.branch_id)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ branch_id: undefined })}
                />
              </Badge>
            )}
            {filters.course_id && (
              <Badge variant="secondary" className="gap-1">
                Course: {courses.find(c => c.id === filters.course_id)?.name}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ course_id: undefined })}
                />
              </Badge>
            )}

            {filters.day && (
              <Badge variant="secondary" className="gap-1">
                Day: {DAYS_OF_WEEK.find(d => d.value === filters.day)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFiltersChange({ day: undefined })}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      <CreateGroupDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
