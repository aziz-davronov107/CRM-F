"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useStudents } from "@/hooks/use-students"
import type { Student, UpdateStudentData, StudentStatus, Gender } from "@/lib/types"

interface EditStudentDialogProps {
  student: Student
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditStudentDialog({ student, open, onOpenChange }: EditStudentDialogProps) {
  const { updateStudent } = useStudents()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateStudentData>({
    fullname: "",
    email: "",
    phone: "",
    gender: "MALE",
    birthday: "",
    status: "ACTIVE",
    description: "",
    other_details: ""
  })

  useEffect(() => {
    if (student) {
      setFormData({
        fullname: student.fullname,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        birthday: student.birthday ? student.birthday.split('T')[0] : "",
        status: student.status,
        description: student.description || "",
        other_details: student.other_details || ""
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    try {
      await updateStudent(student.id, formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating student:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Check if it starts with 998, if not add it
    if (digits.length > 0 && !digits.startsWith('998')) {
      return '+998' + digits.slice(-9)
    }
    
    // Format as +998XXXXXXXXX
    if (digits.startsWith('998')) {
      return '+' + digits
    }
    
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
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
                onChange={handlePhoneChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthday">Date of Birth</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: StudentStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other_details">Other Details</Label>
            <Textarea
              id="other_details"
              value={formData.other_details}
              onChange={(e) => setFormData({ ...formData, other_details: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
