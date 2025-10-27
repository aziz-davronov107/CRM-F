"use client"

import { useState } from "react"
import { StudentGroupsHeader } from "@/components/student-groups/student-groups-header"
import { StudentGroupsList } from "@/components/student-groups/student-groups-list"
import { useStudentGroups } from "@/hooks/use-student-groups"
import type { StudentGroupFilters } from "@/lib/types"

export default function StudentGroupsPage() {
  const [filters, setFilters] = useState<StudentGroupFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc"
  })
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  const { studentGroups, loading } = useStudentGroups(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Groups</h1>
        <p className="text-gray-600 mt-1">Manage student enrollments and group memberships</p>
      </div>
      
      <StudentGroupsHeader 
        filters={filters} 
        onFiltersChange={setFilters} 
        totalCount={studentGroups.length}
        selectedGroupId={selectedGroupId}
        onGroupSelect={setSelectedGroupId}
      />
      
      <StudentGroupsList 
        studentGroups={studentGroups} 
        loading={loading} 
      />
    </div>
  )
}