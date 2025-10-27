"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, UserPlus } from "lucide-react"
import { useStudents } from "@/hooks/use-students"
import { useStudentGroups } from "@/hooks/use-student-groups"
import type { Student } from "@/lib/types"

interface EnrollStudentDialogProps {
  groupId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EnrollStudentDialog({ groupId, open, onOpenChange, onSuccess }: EnrollStudentDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  
  const { students, loading: studentsLoading } = useStudents({
    fullname: searchTerm || undefined,
    status: "ACTIVE",
    has_groups: false // Get students who are not in any groups
  })
  
  const { enrollStudent, bulkEnrollStudents } = useStudentGroups()

  const handleEnroll = async () => {
    if (selectedStudents.length === 0) return
    
    setLoading(true)
    try {
      if (selectedStudents.length === 1) {
        await enrollStudent({
          group_id: groupId,
          student_id: selectedStudents[0]
        })
      } else {
        await bulkEnrollStudents({
          group_id: groupId,
          student_ids: selectedStudents
        })
      }
      
      onSuccess?.()
      onOpenChange(false)
      setSelectedStudents([])
      setSearchTerm("")
    } catch (error) {
      console.error("Error enrolling students:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Enroll Students to Group
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Students</Label>
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

          {/* Selected Count */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {selectedStudents.length} student(s) selected
            </div>
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
                <Card key={student.id} className="p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
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
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No students found matching your search." : "No available students to enroll."}
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
              setSelectedStudents([])
              setSearchTerm("")
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll}
            disabled={selectedStudents.length === 0 || loading}
          >
            {loading ? "Enrolling..." : `Enroll ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}