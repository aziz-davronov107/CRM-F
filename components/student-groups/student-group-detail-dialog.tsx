"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, 
  Phone, 
  BookOpen, 
  User, 
  MapPin, 
  Clock, 
  Calendar,
  Users,
  GraduationCap,
  Building,
  DollarSign,
  UserCheck,
  UserX,
  Clock3
} from "lucide-react"
import type { StudentGroup } from "@/lib/types"

interface StudentGroupDetailDialogProps {
  enrollment: StudentGroup
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentGroupDetailDialog({ enrollment, open, onOpenChange }: StudentGroupDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "attendance">("overview")

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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
      MONDAY: "Monday",
      TUESDAY: "Tuesday", 
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday"
    }
    
    return days.map(day => dayMap[day] || day).join(", ")
  }

  const getStatusBadgeVariant = (status: string) => {
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

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <UserCheck className="w-4 h-4 text-green-600" />
      case "ABSENT":
        return <UserX className="w-4 h-4 text-red-600" />
      case "LATE":
        return <Clock3 className="w-4 h-4 text-orange-600" />
      case "EXCUSED":
        return <UserCheck className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const calculateAge = (birthday: string) => {
    const birthDate = new Date(birthday)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Enrollment Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="pb-2"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "attendance" ? "default" : "ghost"}
              onClick={() => setActiveTab("attendance")}
              className="pb-2"
            >
              Attendance
            </Button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Student Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </h3>
                
                <div className="flex items-start gap-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={enrollment.student?.photo} />
                    <AvatarFallback className="text-lg">
                      {enrollment.student?.fullname?.split(' ').map(n => n[0]).join('') || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold">
                        {enrollment.student?.fullname || 'Unknown Student'}
                      </h4>
                      <Badge variant={getStatusBadgeVariant(enrollment.student?.status || 'INACTIVE')}>
                        {enrollment.student?.status || 'INACTIVE'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {enrollment.student?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>{enrollment.student.email}</span>
                        </div>
                      )}
                      
                      {enrollment.student?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span>{enrollment.student.phone}</span>
                        </div>
                      )}
                      
                      {enrollment.student?.gender && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span>{enrollment.student.gender}</span>
                        </div>
                      )}
                      
                      {enrollment.student?.birthday && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span>
                            {formatDate(enrollment.student.birthday)} 
                            (Age: {enrollment.student.age || calculateAge(enrollment.student.birthday)})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {enrollment.student?.description && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">
                          {enrollment.student.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Group Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Group Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold">
                      {enrollment.group?.name || 'Unknown Group'}
                    </h4>
                    <Badge variant={getStatusBadgeVariant(enrollment.group?.status || 'INACTIVE')}>
                      {enrollment.group?.status || 'INACTIVE'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrollment.group?.course && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Course</span>
                        </div>
                        <div className="ml-6">
                          <div className="font-semibold">{enrollment.group.course.name}</div>
                          {enrollment.group.course.description && (
                            <div className="text-sm text-muted-foreground">
                              {enrollment.group.course.description}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            {enrollment.group.course.price && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span>${enrollment.group.course.price.toLocaleString()}</span>
                              </div>
                            )}
                            {enrollment.group.course.duration_months && (
                              <span>{enrollment.group.course.duration_months} months</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {enrollment.group?.teacher && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Teacher</span>
                        </div>
                        <div className="ml-6">
                          <div className="font-semibold">{enrollment.group.teacher.fullname}</div>
                          {enrollment.group.teacher.email && (
                            <div className="text-sm text-muted-foreground">
                              {enrollment.group.teacher.email}
                            </div>
                          )}
                          {enrollment.group.teacher.phone && (
                            <div className="text-sm text-muted-foreground">
                              {enrollment.group.teacher.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {enrollment.group?.room && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="font-medium">Room</span>
                        </div>
                        <div className="ml-6">
                          <div className="font-semibold">{enrollment.group.room.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Capacity: {enrollment.group.room.capacity} students
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {enrollment.group?.branch && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">Branch</span>
                        </div>
                        <div className="ml-6">
                          <div className="font-semibold">{enrollment.group.branch.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {enrollment.group.branch.region}
                            {enrollment.group.branch.district && `, ${enrollment.group.branch.district}`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Schedule Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">Schedule</span>
                    </div>
                    <div className="ml-6">
                      {enrollment.group?.days && enrollment.group?.start_time && (
                        <div className="font-semibold">
                          {formatDays(enrollment.group.days)} at {formatTime(enrollment.group.start_time)}
                        </div>
                      )}
                      {enrollment.group?.start_date && enrollment.group?.end_date && (
                        <div className="text-sm text-muted-foreground">
                          Duration: {formatDate(enrollment.group.start_date)} to {formatDate(enrollment.group.end_date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Enrollment Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Enrollment Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatDate(enrollment.createdAt)}
                    </div>
                    <div className="text-sm text-muted-foreground">Enrollment Date</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {enrollment._count?.attendances || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Attendances</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {enrollment.group?._count?.studentGroups || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Group Size</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
                
                {enrollment.attendances && enrollment.attendances.length > 0 ? (
                  <div className="space-y-3">
                    {enrollment.attendances.map((attendance) => (
                      <div key={attendance.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getAttendanceStatusIcon(attendance.status)}
                          <div>
                            <div className="font-medium">
                              {formatDate(attendance.date)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {attendance.status}
                            </div>
                          </div>
                        </div>
                        
                        {attendance.note && (
                          <div className="text-sm text-muted-foreground max-w-xs">
                            {attendance.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No attendance records found.</p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}