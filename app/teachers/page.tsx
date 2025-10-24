import { TeachersHeader } from "@/components/teachers/teachers-header"
import { TeachersList } from "@/components/teachers/teachers-list"

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <p className="text-gray-600 mt-1">Manage your teachers</p>
      </div>
      <TeachersList />
    </div>
  )
}
