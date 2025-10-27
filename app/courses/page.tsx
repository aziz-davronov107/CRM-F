"use client"

import { useState } from "react"
import { CoursesHeader } from "@/components/courses/courses-header"
import { CoursesList } from "@/components/courses/courses-list"
import { useCourses } from "@/hooks/use-courses"
import { CoursesFilters } from "@/lib/types"

export default function CoursesPage() {
  const [filters, setFilters] = useState<CoursesFilters>({
    search: "",
  })

  const { courses, loading } = useCourses({})

  const handleFiltersChange = (newFilters: Partial<CoursesFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-1">Manage your training courses</p>
      </div>
      
      <CoursesHeader 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCourses={courses.length}
      />
      
      <CoursesList 
        courses={courses}
        loading={loading}
      />
    </div>
  )
}
