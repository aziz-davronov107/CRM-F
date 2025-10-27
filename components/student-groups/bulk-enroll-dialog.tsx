"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useStudentGroups } from "@/hooks/use-student-groups"
import { useStudents } from "@/hooks/use-students"
import { useGroups } from "@/hooks/use-groups"
import { BookOpen, User, MapPin, Clock, Users, Search } from "lucide-react"
import type { BulkEnrollResponse } from "@/lib/types"

interface BulkEnrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkEnrollDialog({ open, onOpenChange }: BulkEnrollDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [enrollmentResult, setEnrollmentResult] = useState<BulkEnrollResponse | null>(null)

  const { bulkEnrollStudents } = useStudentGroups()
  const { students } = useStudents({ status: "ACTIVE" })
  const { groups } = useGroups({ status: "ACTIVE" })

  const selectedGroup = groups.find(g => g.id === selectedGroupId)

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedGroupId || selectedStudentIds.length === 0) {
      return
    }

    setLoading(true)
    try {
      const result = await bulkEnrollStudents({
        group_id: selectedGroupId,
        student_ids: selectedStudentIds
      })
      
      setEnrollmentResult(result)
    } catch (error) {
      console.error("Error bulk enrolling students:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedGroupId(null)
    setSelectedStudentIds([])
    setSearchTerm("")
    setEnrollmentResult(null)
    onOpenChange(false)
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

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedGroupId(null)
      setSelectedStudentIds([])
      setSearchTerm("")
      setEnrollmentResult(null)
    }
  }, [open])

  // Show results if enrollment completed
  if (enrollmentResult) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Enrollment Results</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {enrollmentResult.summary.successful}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {enrollmentResult.summary.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrollmentResult.summary.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
              </div>
            </Card>

            {enrollmentResult.successful.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold text-green-600 mb-2">Successfully Enrolled</h4>
                <div className="space-y-2">
                  {enrollmentResult.successful.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="text-green-600">✓</Badge>
                      <span>{item.student_name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {enrollmentResult.failed.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold text-red-600 mb-2">Failed to Enroll</h4>
                <div className="space-y-2">
                  {enrollmentResult.failed.map((item) => (
                    <div key={item.student_id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-red-600">✗</Badge>
                        <span>{item.student_name}</span>
                      </div>
                      <p className="text-muted-foreground text-xs ml-6">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Enroll Students</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
            
            {/* Selected Group Info */}
            {selectedGroup && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{selectedGroup.name}</h4>
                  <Badge variant="outline">{selectedGroup.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Course: {selectedGroup.course?.name}</div>
                  <div>Teacher: {selectedGroup.teacher?.fullname}</div>
                  <div>Room: {selectedGroup.room?.name}</div>
                  <div>Students: {selectedGroup._count?.studentGroups || 0}</div>
                </div>
              </Card>
            )}
          </div>

          {/* Student Selection */}
          {selectedGroupId && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Students ({selectedStudentIds.length} selected)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedStudentIds.length === filteredStudents.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              
              {/* Search Students */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Students List */}
              <Card className="p-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() => handleStudentToggle(student.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{student.fullname}</span>
                          <Badge variant="outline" className="text-xs">{student.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.email} • {student.phone}
                        </div>
                        {student._count?.studentGroups && (
                          <div className="text-xs text-muted-foreground">
                            Currently in {student._count.studentGroups} groups
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredStudents.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      {searchTerm ? "No students found matching your search." : "No active students available."}
                    </p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedGroupId || selectedStudentIds.length === 0 || loading}
            >
              {loading ? "Enrolling..." : `Enroll ${selectedStudentIds.length} Students`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}