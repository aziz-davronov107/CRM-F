"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Clock, Users, BookOpen } from "lucide-react"
import { useState } from "react"
import { EditCourseDialog } from "./edit-course-dialog"

interface Course {
  id: string
  name: string
  category: string
  description: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  maxStudents: number
  instructor: string
  status: "active" | "inactive" | "archived"
  enrolledStudents: number
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Web Development Fundamentals",
    category: "Technology",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript",
    duration: "8 weeks",
    level: "beginner",
    maxStudents: 30,
    instructor: "John Smith",
    status: "active",
    enrolledStudents: 28,
  },
  {
    id: "2",
    name: "Advanced React Patterns",
    category: "Technology",
    description: "Master advanced React patterns and best practices",
    duration: "6 weeks",
    level: "advanced",
    maxStudents: 20,
    instructor: "Sarah Johnson",
    status: "active",
    enrolledStudents: 18,
  },
  {
    id: "3",
    name: "Business Communication",
    category: "Business",
    description: "Improve your professional communication skills",
    duration: "4 weeks",
    level: "intermediate",
    maxStudents: 25,
    instructor: "Mike Davis",
    status: "active",
    enrolledStudents: 22,
  },
  {
    id: "4",
    name: "Data Science Basics",
    category: "Technology",
    description: "Introduction to data science and analytics",
    duration: "10 weeks",
    level: "beginner",
    maxStudents: 25,
    instructor: "Emily Brown",
    status: "inactive",
    enrolledStudents: 0,
  },
]

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  const handleSave = (updatedCourse: Course) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)))
    setEditDialogOpen(false)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "default"
      case "intermediate":
        return "secondary"
      case "advanced":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <>
      <div className="space-y-4">
        {courses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No courses found. Create one to get started.</p>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{course.name}</h3>
                    <Badge variant={getStatusColor(course.status)}>{course.status}</Badge>
                    <Badge variant={getLevelColor(course.level)}>{course.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      Category: <span className="text-foreground font-medium">{course.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Duration: <span className="text-foreground font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Instructor: <span className="text-foreground font-medium">{course.instructor}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Enrolled:{" "}
                      <span className="text-foreground font-medium">
                        {course.enrolledStudents}/{course.maxStudents}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(course)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
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
      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </>
  )
}
