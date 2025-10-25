"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { useGroups } from "@/hooks/use-groups"
import { useBranches } from "@/hooks/use-branches"
import { useCourses } from "@/hooks/use-courses"
import { useTeachers } from "@/hooks/use-teachers"
import { useRooms } from "@/hooks/use-rooms"
import { useToast } from "@/hooks/use-toast"

import type { DayOfWeek, Group as LibGroup, UpdateGroupData } from "@/lib/types"

const DAYS = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
]

const editGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  branch_id: z.number().min(1, "Branch is required"),
  course_id: z.number().min(1, "Course is required"),
  teacher_id: z.number().min(1, "Teacher is required"),
  room_id: z.number().min(1, "Room is required"),
  days: z.array(z.string()).min(1, "At least one day is required"),
  start_time: z.string().min(1, "Start time is required"),
  start_date: z.date(),
  end_date: z.date(),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"]),
})

type EditGroupFormData = z.infer<typeof editGroupSchema>

interface EditGroupDialogProps {
  group: LibGroup
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditGroupDialog({ group, open, onOpenChange }: EditGroupDialogProps) {
  const { updateGroup } = useGroups()
  const { branches } = useBranches()
  const { courses } = useCourses()
  const { teachers } = useTeachers({ status: "ACTIVE" })
  const { rooms } = useRooms()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)

  const form = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group?.name || "",
      branch_id: group?.branch_id || 0,
      course_id: group?.course_id || 0,
      teacher_id: group?.teacher_id || 0,
      room_id: group?.room_id || 0,
      days: (group?.days as unknown as string[]) || [],
      start_time: group?.start_time ? toHHmm(group.start_time) : "",
      start_date: group?.start_date ? new Date(group.start_date) : new Date(),
      end_date: group?.end_date ? new Date(group.end_date) : new Date(),
      status: group?.status || "ACTIVE",
    },
  })

  useEffect(() => {
    if (group && open) {
      form.reset({
        name: group.name,
        branch_id: group.branch_id,
        course_id: group.course_id,
        teacher_id: group.teacher_id,
        room_id: group.room_id,
        days: (group.days as unknown as string[]) || [],
        start_time: group.start_time ? toHHmm(group.start_time) : "",
        start_date: new Date(group.start_date),
        end_date: new Date(group.end_date),
        status: group.status,
      })
    }
  }, [group, open, form])

  const selectedBranchId = form.watch("branch_id")

  const filteredCourses = useMemo(
    () => courses.filter((c) => !selectedBranchId || c.branch_id === selectedBranchId),
    [courses, selectedBranchId]
  )

  const filteredTeachers = useMemo(
    () => teachers.filter((t) => !selectedBranchId || t.branch_id === selectedBranchId),
    [teachers, selectedBranchId]
  )

  const filteredRooms = useMemo(
    () => rooms.filter((r) => !selectedBranchId || r.branch_id === selectedBranchId),
    [rooms, selectedBranchId]
  )

  const onSubmit = async (data: EditGroupFormData) => {
    setLoading(true)
    try {
      const startTimeISO = toISOFromDateAndTime(data.start_date, data.start_time)
      const payload: UpdateGroupData = {
        name: data.name,
        branch_id: data.branch_id,
        course_id: data.course_id,
        teacher_id: data.teacher_id,
        room_id: data.room_id,
        days: data.days.map((d) => d as DayOfWeek),
        start_time: startTimeISO,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        status: data.status,
      }

      await updateGroup(group.id, payload)
      toast({ title: "Success", description: "Group updated successfully" })
      onOpenChange(false)
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to update group", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={String(form.watch("branch_id") || "")} onValueChange={(v) => form.setValue("branch_id", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={String(form.watch("course_id") || "")} onValueChange={(v) => form.setValue("course_id", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={String(form.watch("teacher_id") || "")} onValueChange={(v) => form.setValue("teacher_id", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeachers.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={String(form.watch("room_id") || "")} onValueChange={(v) => form.setValue("room_id", parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name} (Capacity: {r.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Schedule Days</Label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((d) => {
                const selected = (form.watch("days") || []) as string[]
                const checked = selected.includes(d.value)
                return (
                  <div key={d.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${d.value}`}
                      checked={checked}
                      onCheckedChange={(ck) => {
                        const curr = new Set(selected)
                        if (ck) curr.add(d.value)
                        else curr.delete(d.value)
                        form.setValue("days", Array.from(curr))
                      }}
                    />
                    <Label htmlFor={`day-${d.value}`} className="text-sm">
                      {d.label}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" {...form.register("start_time")} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={String(form.watch("status") || "")} onValueChange={(v) => form.setValue("status", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start", !form.watch("start_date") && "text-muted-foreground")}> 
                    {form.watch("start_date") ? format(form.watch("start_date"), "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("start_date")}
                    onSelect={(d) => d && form.setValue("start_date", d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start", !form.watch("end_date") && "text-muted-foreground")}> 
                    {form.watch("end_date") ? format(form.watch("end_date"), "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("end_date")}
                    onSelect={(d) => d && form.setValue("end_date", d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function toHHmm(isoOrTime: string): string {
  // If it's already HH:mm just return
  if (/^\d{2}:\d{2}$/.test(isoOrTime)) return isoOrTime
  const d = new Date(isoOrTime)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

function toISOFromDateAndTime(date: Date, time: string): string {
  const [h, m] = (time || "00:00").split(":").map(Number)
  const y = date.getFullYear()
  const mo = date.getMonth()
  const d = date.getDate()
  return new Date(Date.UTC(y, mo, d, h || 0, m || 0, 0, 0)).toISOString()
}
