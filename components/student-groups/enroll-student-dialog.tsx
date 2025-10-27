"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStudentGroups } from "@/hooks/use-student-groups"
import { useStudents } from "@/hooks/use-students"
import { useGroups } from "@/hooks/use-groups"
import { BookOpen, User, MapPin, Clock, Users } from "lucide-react"
import type { CreateStudentGroupData } from "@/lib/types"

interface EnrollStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnrollStudentDialog({ open, onOpenChange }: EnrollStudentDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const { enrollStudent } = useStudentGroups()
  const { students } = useStudents({ status: "ACTIVE" })
  const { groups } = useGroups({ status: "ACTIVE" })

  const selectedStudent = students.find(s => s.id === selectedStudentId)
  const selectedGroup = groups.find(g => g.id === selectedGroupId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStudentId || !selectedGroupId) {
      return
    }

    setLoading(true)
    try {
      const enrollmentData: CreateStudentGroupData = {
        student_id: selectedStudentId,
        group_id: selectedGroupId
      }
      
      await enrollStudent(enrollmentData)
      
      // Reset form
      setSelectedStudentId(null)
      setSelectedGroupId(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error enrolling student:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const formatDays = (days: string[]) => {
    const dayMap: Record<string, string> = {
      MONDAY: "Mon",
      TUESDAY: "Tue", 
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun"
    }
    
    return days.map(day => dayMap[day] || day).join(", ")
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedStudentId(null)
      setSelectedGroupId(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll Student to Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-3">
            <Label>Select Student</Label>
            <Select 
              value={selectedStudentId ? String(selectedStudentId) : ""} 
              onValueChange={(value) => setSelectedStudentId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={String(student.id)}>
                    <div className="flex items-center gap-2">
                      <span>{student.fullname}</span>
                      <span className="text-muted-foreground text-sm">({student.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Selected Student Preview */}
            {selectedStudent && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedStudent.photo} />
                    <AvatarFallback>
                      {selectedStudent.fullname.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{selectedStudent.fullname}</h4>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedStudent.status}</Badge>
                      {selectedStudent._count?.studentGroups && (
                        <span className="text-xs text-muted-foreground">
                          {selectedStudent._count.studentGroups} groups
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Group Selection */}
          <div className="space-y-3">
            <Label>Select Group</Label>
            <Select 
              value={selectedGroupId ? String(selectedGroupId) : ""} 
              onValueChange={(value) => setSelectedGroupId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a group..." />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    <div className="flex items-center gap-2">
                      <span>{group.name}</span>
                      <span className="text-muted-foreground text-sm">
                        ({group.course?.name})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Selected Group Preview */}
            {selectedGroup && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{selectedGroup.name}</h4>
                    <Badge variant="outline">{selectedGroup.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {selectedGroup.course && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>{selectedGroup.course.name}</span>
                      </div>
                    )}
                    
                    {selectedGroup.teacher && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        <span>{selectedGroup.teacher.fullname}</span>
                      </div>
                    )}
                    
                    {selectedGroup.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span>{selectedGroup.room.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>
                        {formatDays(selectedGroup.days)} - {formatTime(selectedGroup.start_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>{selectedGroup._count?.studentGroups || 0} students</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span>Duration: {formatDate(selectedGroup.start_date)} to {formatDate(selectedGroup.end_date)}</span>
                  </div>
                  
                  {selectedGroup.course?.price && (
                    <div className="text-sm">
                      <span className="font-medium">Price: ${selectedGroup.course.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedStudentId || !selectedGroupId || loading}
            >
              {loading ? "Enrolling..." : "Enroll Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}