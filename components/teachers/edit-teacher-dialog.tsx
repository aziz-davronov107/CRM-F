"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  courses: string[]
  qualification: string
  experience: number
  status: "active" | "inactive" | "on-leave"
  branch: string
}

interface EditTeacherDialogProps {
  teacher: Teacher
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (teacher: Teacher) => void
}

const courseOptions = [
  "Web Development Fundamentals",
  "Advanced React Patterns",
  "Business Communication",
  "Data Science Basics",
]

export function EditTeacherDialog({ teacher, open, onOpenChange, onSave }: EditTeacherDialogProps) {
  const [formData, setFormData] = useState(teacher)

  useEffect(() => {
    setFormData(teacher)
  }, [teacher])

  const handleCourseChange = (course: string) => {
    setFormData({
      ...formData,
      courses: formData.courses.includes(course)
        ? formData.courses.filter((c) => c !== course)
        : [...formData.courses, course],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                <SelectTrigger id="branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                  <SelectItem value="Uptown Branch">Uptown Branch</SelectItem>
                  <SelectItem value="Westside Branch">Westside Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              required
            />
          </div>
          <div className="space-y-3">
            <Label>Assigned Courses</Label>
            <div className="space-y-2">
              {courseOptions.map((course) => (
                <div key={course} className="flex items-center space-x-2">
                  <Checkbox
                    id={course}
                    checked={formData.courses.includes(course)}
                    onCheckedChange={() => handleCourseChange(course)}
                  />
                  <Label htmlFor={course} className="font-normal cursor-pointer">
                    {course}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as "active" | "inactive" | "on-leave" })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
