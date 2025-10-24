"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Users } from "lucide-react"

interface Student {
  id: string
  name: string
  avatar?: string
  isPresent: boolean
}

interface AttendanceDialogProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    group: string
    time: string
    room: string
    instructor: string
    date: string
  } | null
}

const mockStudents: Student[] = [
  { id: "1", name: "Abdullah Abduboyiyev Akmaljon o'g'li", isPresent: false },
  { id: "2", name: "Abdurahmon Ibrohimov Ulug'bek o'g'li", isPresent: false },
  { id: "3", name: "Abror Karimov To'lqinjon o'g'li", isPresent: false },
  { id: "4", name: "Azizbek Davronov Umidbek o'g'li", isPresent: true },
  { id: "5", name: "Boburmirzo Ergashev Xolmirza o'g'li", isPresent: false },
  { id: "6", name: "Faxriddin Asqaraliyev", isPresent: false },
  { id: "7", name: "Fayzillo Ummatov Ziyodulla o'g'li", isPresent: false },
  { id: "8", name: "Humoyunmirzo Hudoynazorov Boburmirzo o'g'i", isPresent: false },
  { id: "9", name: "Muhammadmirzo Daminbayev Sherzod o'g'li", isPresent: true },
  { id: "10", name: "MuhammadYahyo Ne'matjonov", isPresent: false },
  { id: "11", name: "Omadbek To'xtasiboyev Sherzodbek o'g'li", isPresent: false },
  { id: "12", name: "Ozodbek Nasriddinov Farhodjon o'g'li", isPresent: true },
]

export function AttendanceDialog({ isOpen, onClose, event }: AttendanceDialogProps) {
  const [students, setStudents] = useState<Student[]>(mockStudents)

  const toggleAttendance = (studentId: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    )
  }

  const presentCount = students.filter(s => s.isPresent).length
  const totalCount = students.length

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {event.title} - Davomat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  <span className="font-medium">Vaqt:</span> {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  <span className="font-medium">Xona:</span> {event.room}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>
                  <span className="font-medium">O'qituvchi:</span> {event.instructor}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>
                  <span className="font-medium">Kelganlar:</span> {presentCount}/{totalCount}
                </span>
              </div>
            </div>
          </Card>

          {/* Attendance Summary */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">O'quvchilar ro'yxati</h3>
            <Badge variant="outline" className="text-sm">
              {presentCount} keldi, {totalCount - presentCount} kelmadi
            </Badge>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            {students.map((student, index) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{student.name}</span>
                  {student.isPresent && (
                    <Badge variant="default" className="text-xs">
                      17:30 ⏰
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {student.isPresent ? "Keldi" : "Kelmadi"}
                  </span>
                  <Switch
                    checked={student.isPresent}
                    onCheckedChange={() => toggleAttendance(student.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button onClick={onClose}>
              Saqlash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}