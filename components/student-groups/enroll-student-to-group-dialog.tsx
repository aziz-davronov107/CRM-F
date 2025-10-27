"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, UserPlus, BookOpen } from "lucide-react"
import { useStudents } from "@/hooks/use-students"
import { useStudentGroups } from "@/hooks/use-student-groups"
import { useGroups } from "@/hooks/use-groups"
import type { Student } from "@/lib/types"

interface EnrollStudentToGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EnrollStudentToGroupDialog({ open, onOpenChange, onSuccess }: EnrollStudentToGroupDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { students, loading: studentsLoading } = useStudents({
    fullname: searchTerm || undefined,
    status: "ACTIVE"
  })
  
  const { groups } = useGroups({ status: "ACTIVE" })
  const { enrollStudent } = useStudentGroups()

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedGroup) return
    
    setLoading(true)
    try {
      await enrollStudent({
        group_id: selectedGroup,
        student_id: selectedStudent
      })
      
      onSuccess?.()
      onOpenChange(false)
      setSelectedStudent(null)
      setSelectedGroup(null)
      setSearchTerm("")
    } catch (error) {
      console.error("Error enrolling student:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const selectedStudentData = students.find(s => s.id === selectedStudent)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Enroll Student to Group
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Group Selection */}
          <div className="space-y-2">
            <Label htmlFor="group">Select Group *</Label>
            <Select 
              value={selectedGroup ? String(selectedGroup) : ""} 
              onValueChange={(value) => setSelectedGroup(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a group..." />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{group.name}</span>
                      {group.course && (
                        <span className="text-sm text-muted-foreground">
                          ({group.course.name})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Student *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Selected Student Preview */}
          {selectedStudentData && (
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedStudentData.photo} />
                  <AvatarFallback className="text-xs">
                    {getInitials(selectedStudentData.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Selected: {selectedStudentData.fullname}</div>
                  <div className="text-sm text-muted-foreground">{selectedStudentData.email}</div>
                </div>
                <Badge variant={selectedStudentData.status === "ACTIVE" ? "default" : "secondary"}>
                  {selectedStudentData.status}
                </Badge>
              </div>
            </Card>
          )}

          {/* Students List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {studentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : students.length > 0 ? (
              students.map((student) => (
                <Card 
                  key={student.id} 
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedStudent === student.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.photo} />
                      <AvatarFallback className="text-xs">
                        {getInitials(student.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{student.fullname}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                      <div className="text-sm text-muted-foreground">{student.phone}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                      {student.age && (
                        <span className="text-xs text-muted-foreground">
                          Age: {student.age}
                        </span>
                      )}
                      {student._count?.studentGroups && (
                        <span className="text-xs text-muted-foreground">
                          Groups: {student._count.studentGroups}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No students found matching your search." : "No students available."}
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setSelectedStudent(null)
              setSelectedGroup(null)
              setSearchTerm("")
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll}
            disabled={!selectedStudent || !selectedGroup || loading}
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}