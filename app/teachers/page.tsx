"use client"

import { useState } from "react"
import { TeachersHeader } from "@/components/teachers/teachers-header"
import { TeachersList } from "@/components/teachers/teachers-list"
import { CreateTeacherDialog } from "@/components/teachers/create-teacher-dialog"
import { EditTeacherDialog } from "@/components/teachers/edit-teacher-dialog"
import type { Teacher, TeacherFilters } from "@/lib/types"

export default function TeachersPage() {
  const [filters, setFilters] = useState<TeacherFilters>({})
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const handleCreateClick = () => setIsCreateOpen(true)
  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <p className="text-gray-600 mt-1">Manage your teachers</p>
      </div>

      <TeachersHeader
        activeFilters={filters}
        onFiltersChange={setFilters}
        onCreateClick={handleCreateClick}
      />

      <TeachersList
        filters={filters}
        onEditClick={handleEditClick}
      />

      <CreateTeacherDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditTeacherDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        teacher={selectedTeacher}
      />
    </div>
  )
}
