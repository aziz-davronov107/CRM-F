"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Trash2, Mail, Phone, BookOpen, Search, Users, UserPlus, Filter, Eye } from "lucide-react"
import { useState } from "react"
import { EditStudentDialog } from "./edit-student-dialog"
import { CreateStudentDialog } from "./create-student-dialog"
import { useStudents } from "@/hooks/use-students"
import { useStudentGroups } from "@/hooks/use-student-groups"
import type { Student, StudentStatus, Gender, StudentFilters } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StudentsList() {
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  })
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "ALL">("ALL")
  const [genderFilter, setGenderFilter] = useState<Gender | "ALL">("ALL")

  const { students, loading, error, deleteStudent } = useStudents(filters)

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id)
    }
  }

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      fullname: searchTerm || undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      gender: genderFilter !== "ALL" ? genderFilter : undefined,
      page: 1
    }))
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("ALL")
    setGenderFilter("ALL")
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc"
    })
  }

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "GRADUATED":
        return "outline"
      default:
        return "default"
    }
  }

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <>
      {/* Header and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search students by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StudentStatus | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="GRADUATED">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={(value) => setGenderFilter(value as Gender | "ALL")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button onClick={handleClearFilters} variant="outline">
              Clear
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {students.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No students found.</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Your First Student
            </Button>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{student.fullname}</h3>
                    <Badge variant={getStatusColor(student.status)}>{student.status}</Badge>
                    {student.age && (
                      <span className="text-sm text-muted-foreground">
                        Age: {student.age || calculateAge(student.birthday)}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {student.phone}
                    </div>
                    <div className="text-muted-foreground">
                      Gender: <span className="text-foreground font-medium">{student.gender}</span>
                    </div>
                  </div>

                  {student.studentGroups && student.studentGroups.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Enrolled Groups ({student.studentGroups.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {student.studentGroups.slice(0, 3).map((sg) => (
                          <Badge key={sg.id} variant="outline">
                            {sg.group?.name || `Group ${sg.group_id}`}
                          </Badge>
                        ))}
                        {student.studentGroups.length > 3 && (
                          <Badge variant="outline">
                            +{student.studentGroups.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {student.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {student.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      Joined: {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                    {student._count?.studentGroups && (
                      <span>
                        Groups: {student._count.studentGroups}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination would go here */}

      {/* Dialogs */}
      <CreateStudentDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      
      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  )
}
