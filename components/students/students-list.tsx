"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Mail, Phone, BookOpen } from "lucide-react"
import { useState } from "react"
import { EditStudentDialog } from "./edit-student-dialog"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  enrolledCourses: string[]
  joinDate: string
  status: "active" | "inactive" | "suspended"
  branch: string
  progress: number
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 111-1111",
    enrolledCourses: ["Web Development Fundamentals", "Advanced React Patterns"],
    joinDate: "2024-09-15",
    status: "active",
    branch: "Downtown Branch",
    progress: 75,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 (555) 222-2222",
    enrolledCourses: ["Business Communication"],
    joinDate: "2024-10-01",
    status: "active",
    branch: "Uptown Branch",
    progress: 60,
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1 (555) 333-3333",
    enrolledCourses: ["Data Science Basics"],
    joinDate: "2024-08-20",
    status: "active",
    branch: "Downtown Branch",
    progress: 90,
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 444-4444",
    enrolledCourses: ["Web Development Fundamentals"],
    joinDate: "2024-07-10",
    status: "inactive",
    branch: "Westside Branch",
    progress: 45,
  },
]

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  const handleSave = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
    setEditDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <>
      <div className="space-y-4">
        {students.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No students found. Add one to get started.</p>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
                    <Badge variant={getStatusColor(student.status)}>{student.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {student.phone}
                    </div>
                    <div className="text-muted-foreground">
                      Branch: <span className="text-foreground font-medium">{student.branch}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Enrolled Courses</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.enrolledCourses.map((course) => (
                        <Badge key={course} variant="outline">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-muted-foreground">
                      Joined: <span className="text-foreground font-medium">{student.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-foreground font-medium">{student.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
