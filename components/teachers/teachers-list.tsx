"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Mail, Phone, BookOpen, Award } from "lucide-react"
import { useState } from "react"
import { EditTeacherDialog } from "./edit-teacher-dialog"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  courses: string[]
  qualification: string
  experience: number
  status: "active" | "inactive" | "on-leave"
  branch: string
}

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@trainingcenter.com",
    phone: "+1 (555) 111-1111",
    specialization: "Web Development",
    courses: ["Web Development Fundamentals"],
    qualification: "B.Tech in Computer Science",
    experience: 8,
    status: "active",
    branch: "Downtown Branch",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@trainingcenter.com",
    phone: "+1 (555) 222-2222",
    specialization: "React & Frontend",
    courses: ["Advanced React Patterns"],
    qualification: "M.Tech in Software Engineering",
    experience: 6,
    status: "active",
    branch: "Uptown Branch",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@trainingcenter.com",
    phone: "+1 (555) 333-3333",
    specialization: "Business Management",
    courses: ["Business Communication"],
    qualification: "MBA",
    experience: 10,
    status: "active",
    branch: "Downtown Branch",
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily@trainingcenter.com",
    phone: "+1 (555) 444-4444",
    specialization: "Data Science",
    courses: ["Data Science Basics"],
    qualification: "M.Sc in Data Science",
    experience: 5,
    status: "on-leave",
    branch: "Westside Branch",
  },
]

export function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id))
  }

  const handleSave = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)))
    setEditDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "on-leave":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <>
      <div className="space-y-4">
        {teachers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No teachers found. Add one to get started.</p>
          </Card>
        ) : (
          teachers.map((teacher) => (
            <Card key={teacher.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{teacher.name}</h3>
                    <Badge variant={getStatusColor(teacher.status)}>{teacher.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {teacher.phone}
                    </div>
                    <div className="text-muted-foreground">
                      Branch: <span className="text-foreground font-medium">{teacher.branch}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="w-4 h-4" />
                      <span>
                        Specialization: <span className="text-foreground font-medium">{teacher.specialization}</span>
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Experience: <span className="text-foreground font-medium">{teacher.experience} years</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Teaching Courses</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.courses.map((course) => (
                        <Badge key={course} variant="outline">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qualification: <span className="text-foreground font-medium">{teacher.qualification}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(teacher.id)}
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
      {editingTeacher && (
        <EditTeacherDialog
          teacher={editingTeacher}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
