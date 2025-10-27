"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  User, 
  Mail, 
  Phone,
  UserPlus,
  UserMinus,
  BarChart3,
  DollarSign,
  GraduationCap,
  Building,
  Edit,
  Eye,
  Trash2
} from "lucide-react"
import { Group, DayOfWeek } from "@/lib/types"
import { useGroupStudents } from "@/hooks/use-student-groups"
import { useGroupStatistics } from "@/hooks/use-groups"
import { RemoveStudentDialog } from "./remove-student-dialog"

interface GroupDetailDialogProps {
  group: Group
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab?: string
}

export function GroupDetailDialog({ group, open, onOpenChange, initialTab = "overview" }: GroupDetailDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [removeStudentId, setRemoveStudentId] = useState<number | null>(null)
  
  const { groupStudents, loading: studentsLoading, refetch } = useGroupStudents(group.id, true)
  const { statistics: groupStats, loading: statsLoading } = useGroupStatistics(group.id)

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab)
      refetch()
    }
  }, [open, initialTab, refetch])

  const formatDays = (days: DayOfWeek[]) => {
    const dayMap: Record<DayOfWeek, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday", 
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday"
    }
    
    return days.map(day => dayMap[day]).join(", ")
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "INACTIVE":
        return "secondary"
      case "COMPLETED":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{group.name}</span>
              <Badge variant={getStatusBadgeVariant(group.status)}>{group.status}</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students ({group._count?.studentGroups || 0})</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Information
                </h3>
                {group.course && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{group.course.name}</span>
                      {group.course.price && (
                        <span className="text-lg font-semibold text-green-600">
                          ${group.course.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {group.course.description && (
                      <p className="text-muted-foreground">{group.course.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {group.course.duration_months && (
                        <div>
                          <span className="font-medium">Duration:</span> {group.course.duration_months} months
                        </div>
                      )}
                      {group.course.duration_hours && (
                        <div>
                          <span className="font-medium">Hours:</span> {group.course.duration_hours} hours
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Schedule & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">{formatDays(group.days)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>{formatTime(group.start_time)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        <div>Start: {formatDate(group.start_date)}</div>
                        <div>End: {formatDate(group.end_date)}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="space-y-3">
                    {group.room && (
                      <div>
                        <div className="font-medium">{group.room.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Capacity: {group.room.capacity} students
                        </div>
                      </div>
                    )}
                    {group.branch && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{group.branch.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {group.branch.district}, {group.branch.region}
                        </div>
                        {group.branch.address && (
                          <div className="text-sm text-muted-foreground">
                            {group.branch.address}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Teacher Info */}
              {group.teacher && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Teacher
                  </h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={group.teacher.photo ? group.teacher.photo : "/placeholder.jpg"} />
                      <AvatarFallback>{getInitials(group.teacher.fullname)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{group.teacher.fullname}</div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {group.teacher.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {group.teacher.phone}
                        </div>
                      </div>
                    </div>
                    <Badge variant={group.teacher.status === "ACTIVE" ? "default" : "secondary"}>
                      {group.teacher.status}
                    </Badge>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Students ({groupStudents?.totalStudents || 0})</h3>
              </div>

              {studentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-4 animate-pulse">
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
              ) : groupStudents && groupStudents.students.length > 0 ? (
                <div className="space-y-3">
                  {groupStudents.students.map((studentGroup) => (
                    <Card key={studentGroup.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={studentGroup.student.photo} />
                            <AvatarFallback>
                              {getInitials(studentGroup.student.fullname)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{studentGroup.student.fullname}</div>
                            <div className="text-sm text-muted-foreground">
                              {studentGroup.student.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Enrolled: {formatDate(studentGroup.enrolledAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {studentGroup.attendanceStats && (
                            <div className="text-right text-sm">
                              <div className="font-medium text-green-600">
                                {studentGroup.attendanceStats.rate}
                              </div>
                              <div className="text-muted-foreground">
                                {studentGroup.attendanceStats.attended}/{studentGroup.attendanceStats.totalClasses} classes
                              </div>
                            </div>
                          )}
                          <Badge variant={studentGroup.student.status === "ACTIVE" ? "default" : "secondary"}>
                            {studentGroup.student.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRemoveStudentId(studentGroup.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No students enrolled in this group yet.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-6 bg-muted rounded w-1/2"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : groupStats ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">{groupStats.totalStudents}</div>
                          <div className="text-sm text-muted-foreground">Total Students</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">{groupStats.progressPercentage}</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="text-2xl font-bold">{groupStats.totalRevenue}</div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">{groupStats.averageAttendanceRate}</div>
                          <div className="text-sm text-muted-foreground">Attendance</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="font-semibold mb-4">Class Progress</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Completed Classes:</span>
                          <span className="font-medium">{groupStats.completedClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Classes:</span>
                          <span className="font-medium">{groupStats.remainingClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Classes:</span>
                          <span className="font-medium">{groupStats.totalClasses}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4">Student Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Active Students:</span>
                          <span className="font-medium text-green-600">{groupStats.activeStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inactive Students:</span>
                          <span className="font-medium text-orange-600">{groupStats.inactiveStudents}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No statistics available for this group.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {removeStudentId && (
        <RemoveStudentDialog
          studentGroupId={removeStudentId}
          open={!!removeStudentId}
          onOpenChange={(open) => !open && setRemoveStudentId(null)}
          onSuccess={() => {
            refetch()
            setRemoveStudentId(null)
          }}
        />
      )}
    </>
  )
}