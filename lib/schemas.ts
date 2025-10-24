import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(/^\+?[0-9]{9,}$/, "Invalid phone number"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
})

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  branch_id: z.number().min(1, "Branch is required"),
})

export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  category_id: z.number().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  price: z.number().min(0, "Price cannot be negative"),
  duration_hours: z.number().min(1, "Duration hours is required"),
  duration_months: z.number().min(1, "Duration months is required"),
  description: z.string().min(1, "Description is required"),
})

export const studentSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9]{9,}$/, "Invalid phone number"),
  gender: z.enum(["MALE", "FEMALE"]),
  birthday: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear()
    return age >= 5 && age <= 80
  }, "Age must be between 5 and 80 years"),
  status: z.enum(["Active", "Inactive", "Graduated"]),
})

export const teacherSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9]{9,}$/, "Invalid phone number"),
  gender: z.enum(["MALE", "FEMALE"]),
  birthday: z.string(),
  status: z.enum(["Active", "OnLeave", "Inactive"]),
  description: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type BranchInput = z.infer<typeof branchSchema>
export type RoomInput = z.infer<typeof roomSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type StudentInput = z.infer<typeof studentSchema>
export type TeacherInput = z.infer<typeof teacherSchema>
