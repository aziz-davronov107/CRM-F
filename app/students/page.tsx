import { StudentsHeader } from "@/components/students/students-header"
import { StudentsList } from "@/components/students/students-list"

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Manage your students</p>
      </div>
      <StudentsList />
    </div>
  )
}
