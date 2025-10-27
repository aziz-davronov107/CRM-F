"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, Filter, Users } from "lucide-react"
import { useState } from "react"

import type { StudentGroupFilters, GroupStatus, StudentStatus } from "@/lib/types"
import { useGroups } from "@/hooks/use-groups"
import { useGroupStudents } from "@/hooks/use-student-groups"

interface StudentGroupsHeaderProps {
  filters: StudentGroupFilters
  onFiltersChange: (filters: StudentGroupFilters) => void
  totalCount: number
  selectedGroupId?: number | null
  onGroupSelect?: (groupId: number | null) => void
}

export function StudentGroupsHeader({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  selectedGroupId, 
  onGroupSelect 
}: StudentGroupsHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<GroupStatus | StudentStatus | "ALL">("ALL")
  const [groupFilter, setGroupFilter] = useState<number | "ALL">(selectedGroupId || "ALL")
  const [showGroupStudents, setShowGroupStudents] = useState(false)

  const { groups } = useGroups({ status: "ACTIVE" })
  const { groupStudents, loading: groupStudentsLoading } = useGroupStudents(
    groupFilter !== "ALL" ? groupFilter : undefined
  )

  const handleSearch = () => {
    onFiltersChange({
      ...filters,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      group_id: groupFilter !== "ALL" ? groupFilter : undefined,
      page: 1
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("ALL")
    setGroupFilter("ALL")
    setShowGroupStudents(false)
    onGroupSelect?.(null)
    onFiltersChange({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc"
    })
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by student or group name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={String(groupFilter)} onValueChange={(value) => {
                const newGroupFilter = value === "ALL" ? "ALL" : Number(value)
                setGroupFilter(newGroupFilter)
                setShowGroupStudents(newGroupFilter !== "ALL") // Auto-show students when group is selected
                onGroupSelect?.(newGroupFilter === "ALL" ? null : newGroupFilter)
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Groups</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={String(group.id)}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as GroupStatus | StudentStatus | "ALL")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button onClick={handleClearFilters} variant="outline">
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* No buttons needed - students auto-show when group is selected */}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Total enrollments: {totalCount}</span>
          <div className="flex items-center gap-4">
            <span>Active Groups: {groups.length}</span>
            {groupFilter !== "ALL" && groupStudents && (
              <span>Students in selected group: {groupStudents.totalStudents}</span>
            )}
          </div>
        </div>
        
        {/* Group Students Preview */}
        {showGroupStudents && groupFilter !== "ALL" && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">
                Students in {groups.find(g => g.id === groupFilter)?.name || 'Selected Group'}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowGroupStudents(false)}
              >
                Hide
              </Button>
            </div>
            
            {groupStudentsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                      <div className="h-2 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : groupStudents ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {groupStudents.students.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-2 hover:bg-background rounded text-sm">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                      {enrollment.student.fullname.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{enrollment.student.fullname}</div>
                      <div className="text-xs text-muted-foreground">
                        {enrollment.student.email} • Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                    {enrollment.attendanceStats && (
                      <div className="text-xs text-muted-foreground">
                        {enrollment.attendanceStats.rate}% attendance
                      </div>
                    )}
                  </div>
                ))}
                {groupStudents.students.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    No students enrolled in this group yet.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4 text-sm">
                Unable to load group students.
              </p>
            )}
          </div>
        )}
      </Card>
    </>
  )
}