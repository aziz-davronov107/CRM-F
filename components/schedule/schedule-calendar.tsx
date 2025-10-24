"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AttendanceDialog } from "./attendance-dialog"
import { Users } from "lucide-react"

interface ScheduleEvent {
  id: string
  date: string
  title: string
  group: string
  time: string
  room: string
  instructor: string
}

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    date: "2024-11-01",
    title: "Web Dev Group A",
    group: "Web Development Fundamentals",
    time: "10:00 AM",
    room: "Room A1",
    instructor: "John Smith",
  },
  {
    id: "2",
    date: "2024-11-01",
    title: "React Advanced Group B",
    group: "Advanced React Patterns",
    time: "2:00 PM",
    room: "Room B1",
    instructor: "Sarah Johnson",
  },
  {
    id: "3",
    date: "2024-11-03",
    title: "Web Dev Group A",
    group: "Web Development Fundamentals",
    time: "10:00 AM",
    room: "Room A1",
    instructor: "John Smith",
  },
  {
    id: "4",
    date: "2024-11-04",
    title: "Business Comm Group C",
    group: "Business Communication",
    time: "3:00 PM",
    room: "Room A2",
    instructor: "Mike Davis",
  },
  {
    id: "5",
    date: "2024-11-05",
    title: "React Advanced Group B",
    group: "Advanced React Patterns",
    time: "2:00 PM",
    room: "Room B1",
    instructor: "Sarah Johnson",
  },
]

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [attendanceDialog, setAttendanceDialog] = useState<{
    isOpen: boolean
    event: ScheduleEvent | null
  }>({
    isOpen: false,
    event: null
  })

  const openAttendanceDialog = (event: ScheduleEvent) => {
    setAttendanceDialog({
      isOpen: true,
      event
    })
  }

  const closeAttendanceDialog = () => {
    setAttendanceDialog({
      isOpen: false,
      event: null
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const currentDate = new Date(2024, 10, 1)
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `2024-11-${String(day).padStart(2, "0")}`
    return mockEvents.filter((event) => event.date === dateStr)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => day && setSelectedDate(`2024-11-${String(day).padStart(2, "0")}`)}
                className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-colors ${
                  day ? "border-border hover:bg-muted" : "border-transparent bg-muted/30 cursor-default"
                } ${
                  selectedDate === `2024-11-${String(day).padStart(2, "0")}` ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {day && (
                  <>
                    <div className="font-semibold text-sm mb-1">{day}</div>
                    <div className="space-y-1">
                      {getEventsForDate(day).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-accent text-accent-foreground rounded px-1 py-0.5 truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 sticky top-6">
          <h3 className="font-semibold text-foreground mb-4">
            {selectedDate ? `Events for ${selectedDate}` : "Select a date"}
          </h3>
          {selectedDate ? (
            <div className="space-y-3">
              {getEventsForDate(Number.parseInt(selectedDate.split("-")[2])).length > 0 ? (
                getEventsForDate(Number.parseInt(selectedDate.split("-")[2])).map((event) => (
                  <div key={event.id} className="border border-border rounded-lg p-3 space-y-3">
                    <div className="font-medium text-foreground">{event.title}</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium">Time:</span> {event.time}
                      </div>
                      <div>
                        <span className="font-medium">Room:</span> {event.room}
                      </div>
                      <div>
                        <span className="font-medium">Instructor:</span> {event.instructor}
                      </div>
                      <div>
                        <span className="font-medium">Course:</span> {event.group}
                      </div>
                    </div>
                    <Button 
                      onClick={() => openAttendanceDialog(event)}
                      size="sm" 
                      className="w-full"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Davomat
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Click on a date to view events</p>
          )}
        </Card>
      </div>

      <AttendanceDialog 
        isOpen={attendanceDialog.isOpen}
        onClose={closeAttendanceDialog}
        event={attendanceDialog.event}
      />
    </div>
  )
}
