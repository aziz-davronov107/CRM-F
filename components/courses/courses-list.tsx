"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Clock, Users, BookOpen, DollarSign, Tag } from "lucide-react"
import { useState } from "react"
import { Course } from "@/lib/types"
import { useCourses } from "@/hooks/use-courses"
import { useToast } from "@/hooks/use-toast"
import { EditCourseDialog } from "./edit-course-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CoursesListProps {
  courses: Course[]
  loading?: boolean
}

export function CoursesList({ courses, loading }: CoursesListProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  
  const { deleteCourse } = useCourses()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deletingCourse) return

    try {
      await deleteCourse(deletingCourse.id)
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
      setDeletingCourse(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
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
                    <Badge variant={getStatusBadgeVariant(course.status)}>{course.status}</Badge>
                    {course.category && (
                      <Badge variant="outline">{course.category.name}</Badge>
                    )}
                  </div>
                  
                  {course.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-foreground font-medium">{formatCurrency(course.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-foreground font-medium">{course.duration_hours}h / {course.duration_months}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-foreground font-medium">{course._count?.groups || 0} groups</span>
                    </div>
                    {course.branch && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="w-4 h-4 text-orange-600" />
                        <span className="text-foreground font-medium">{course.branch.name}</span>
                      </div>
                    )}
                  </div>


                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingCourse(course)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingCourse(course)}
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
      
      {/* Edit Course Dialog */}
      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          open={!!editingCourse}
          onOpenChange={(open) => !open && setEditingCourse(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCourse} onOpenChange={() => setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCourse?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
