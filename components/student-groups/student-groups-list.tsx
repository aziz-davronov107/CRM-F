"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Trash2, 
  Mail, 
  Phone, 
  BookOpen, 
  Users, 
  Calendar,
  User,
  GraduationCap,
  MapPin,
  Clock,
  UserMinus,
  Eye
} from "lucide-react"
import { useStudentGroups } from "@/hooks/use-student-groups"
import { StudentGroupDetailDialog } from "./student-group-detail-dialog"
import type { StudentGroup, StudentStatus, GroupStatus } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface StudentGroupsListProps {
  studentGroups: StudentGroup[]
  loading?: boolean
}

export function StudentGroupsList({ studentGroups, loading }: StudentGroupsListProps) {
  const [removingEnrollment, setRemovingEnrollment] = useState<StudentGroup | null>(null)
  const [viewingEnrollment, setViewingEnrollment] = useState<StudentGroup | null>(null)
  
  const { removeStudentFromGroup } = useStudentGroups()

  const handleRemoveEnrollment = async () => {
    if (!removingEnrollment) return

    try {
      await removeStudentFromGroup(removingEnrollment.id)
      setRemovingEnrollment(null)
    } catch (error) {
      console.error("Error removing student from group:", error)
    }
  }

  const getStatusBadgeVariant = (status: StudentStatus | GroupStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "COMPLETED":
      case "GRADUATED":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {studentGroups.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No student enrollments found.</p>
            <p className="text-sm text-muted-foreground">Start by enrolling students to groups.</p>
          </Card>
        ) : (
          studentGroups.map((enrollment) => (
            <Card key={enrollment.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-6">
                {/* Student Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={enrollment.student?.photo} />
                    <AvatarFallback>
                      {enrollment.student?.fullname?.split(' ').map(n => n[0]).join('') || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {enrollment.student?.fullname || 'Unknown Student'}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(enrollment.student?.status || 'INACTIVE')}>
                        {enrollment.student?.status || 'INACTIVE'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {enrollment.student?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {enrollment.student.email}
                        </div>
                      )}
                      {enrollment.student?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {enrollment.student.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Group Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {enrollment.group?.name || 'Unknown Group'}
                      </h4>
                      <Badge variant={getStatusBadgeVariant(enrollment.group?.status || 'INACTIVE')} className="text-xs">
                        {enrollment.group?.status || 'INACTIVE'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {enrollment.group?.course && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-foreground font-medium">
                          {enrollment.group.course.name}
                        </span>
                      </div>
                    )}
                    
                    {enrollment.group?.teacher && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{enrollment.group.teacher.fullname}</span>
                      </div>
                    )}
                    
                    {enrollment.group?.room && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{enrollment.group.room.name}</span>
                      </div>
                    )}
                    
                    {enrollment.group?.days && enrollment.group?.start_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDays(enrollment.group.days)} - {formatTime(enrollment.group.start_time)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enrollment Info */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Enrolled: {formatDate(enrollment.createdAt)}</span>
                    </div>
                    
                    {enrollment._count?.attendances && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Attendances: {enrollment._count.attendances}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingEnrollment(enrollment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRemovingEnrollment(enrollment)}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      {viewingEnrollment && (
        <StudentGroupDetailDialog
          enrollment={viewingEnrollment}
          open={!!viewingEnrollment}
          onOpenChange={(open) => !open && setViewingEnrollment(null)}
        />
      )}

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!removingEnrollment} onOpenChange={() => setRemovingEnrollment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student from Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{removingEnrollment?.student?.fullname}" from 
              "{removingEnrollment?.group?.name}"? This action cannot be undone and will remove 
              all attendance records for this enrollment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveEnrollment} 
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}