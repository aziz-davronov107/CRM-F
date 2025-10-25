"use client"

import { useState } from "react"
import { Edit2, Trash2, Users, Calendar, Clock, MapPin, BookOpen, User } from "lucide-react"
import { Group, DayOfWeek } from "@/lib/types"
import { useGroups } from "@/hooks/use-groups"
import { useToast } from "@/hooks/use-toast"
import { EditGroupDialog } from "./edit-group-dialog"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface GroupsListProps {
  groups: Group[]
  loading?: boolean
}

export function GroupsList({ groups, loading }: GroupsListProps) {
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)
  
  const { deleteGroup } = useGroups()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deletingGroup) return

    try {
      await deleteGroup(deletingGroup.id)
      toast({
        title: "Success",
        description: "Group deleted successfully",
      })
      setDeletingGroup(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete group",
        variant: "destructive",
      })
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

  const formatDays = (days: DayOfWeek[]) => {
    const dayMap: Record<DayOfWeek, string> = {
      MONDAY: "Mon",
      TUESDAY: "Tue", 
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun"
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
        month: 'short',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {groups.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No groups found. Create one to get started.</p>
          </Card>
        ) : (
          groups.map((group) => (
            <Card key={group.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
                    <Badge variant={getStatusBadgeVariant(group.status)}>{group.status}</Badge>
                  </div>
                  
                  {group.course && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-foreground font-medium">{group.course.name}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    {group.teacher && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-foreground font-medium">{group.teacher.fullname}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-foreground font-medium">
                        {formatDays(group.days)} - {formatTime(group.start_time)}
                      </span>
                    </div>
                    
                    {group.room && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="text-foreground font-medium">{group.room.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-foreground font-medium">
                        {group._count?.studentGroups || 0} students
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(group.start_date)} to {formatDate(group.end_date)}
                      </span>
                    </div>
                    
                    {group.branch && (
                      <div className="text-muted-foreground">
                        Branch: <span className="text-foreground font-medium">{group.branch.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setEditingGroup(group)} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingGroup(group)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* Edit Group Dialog */}
      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingGroup?.name}"? This action cannot be undone and will remove all students from this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
