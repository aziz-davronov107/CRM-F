import { ScheduleHeader } from "@/components/schedule/schedule-header"
import { ScheduleCalendar } from "@/components/schedule/schedule-calendar"

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600 mt-1">Manage class schedules</p>
      </div>
      <ScheduleCalendar />
    </div>
  )
}
