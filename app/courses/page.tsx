import { CoursesHeader } from "@/components/courses/courses-header"
import { CoursesList } from "@/components/courses/courses-list"

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-1">Manage your training courses</p>
      </div>
      <CoursesList />
    </div>
  )
}
