import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const createBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().regex(/^\+998\d{9}$/, "Phone must be in format +998XXXXXXXXX"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  center_id: z.number().min(1, "Center is required"),
})

export const updateBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required").optional(),
  region: z.string().min(1, "Region is required").optional(),
  district: z.string().min(1, "District is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  phone: z.string().regex(/^\+998\d{9}$/, "Phone must be in format +998XXXXXXXXX").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  center_id: z.number().min(1, "Center is required").optional(),
})

export const branchFiltersSchema = z.object({
  center_id: z.number().optional(),
  region: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "region", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export const centerFiltersSchema = z.object({
  region: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "region", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  branch_id: z.number().min(1, "Branch is required"),
})

export const updateRoomSchema = z.object({
  name: z.string().min(1, "Room name is required").optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  branch_id: z.number().min(1, "Branch is required").optional(),
})

export const roomFiltersSchema = z.object({
  branch_id: z.number().optional(),
  capacity_min: z.number().min(1).optional(),
  capacity_max: z.number().min(1).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "capacity", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
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

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  branch_id: z.number().min(1, "Branch is required"),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  branch_id: z.number().min(1, "Branch is required").optional(),
})

export const categoryFiltersSchema = z.object({
  branch_id: z.number().optional(),
  name: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export const createCourseSchema = z.object({
  branch_id: z.number().min(1, "Branch is required"),
  category_id: z.number().min(1, "Category is required"),
  name: z.string().min(1, "Course name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"], { required_error: "Status is required" }),
  price: z.number().min(0, "Price must be positive"),
  duration_hours: z.number().min(1, "Duration hours must be at least 1"),
  duration_months: z.number().min(1, "Duration months must be at least 1"),
  description: z.string().optional(),
})

export const updateCourseSchema = z.object({
  branch_id: z.number().min(1, "Branch is required").optional(),
  category_id: z.number().min(1, "Category is required").optional(),
  name: z.string().min(1, "Course name is required").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  duration_hours: z.number().min(1, "Duration hours must be at least 1").optional(),
  duration_months: z.number().min(1, "Duration months must be at least 1").optional(),
  description: z.string().optional(),
})

export const courseFiltersSchema = z.object({
  branch_id: z.number().optional(),
  category_id: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  duration_min: z.number().min(1).optional(),
  duration_max: z.number().min(1).optional(),
  name: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "price", "duration_months", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CreateBranchInput = z.infer<typeof createBranchSchema>
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>
export type BranchFiltersInput = z.infer<typeof branchFiltersSchema>
export type CenterFiltersInput = z.infer<typeof centerFiltersSchema>
export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
export type RoomFiltersInput = z.infer<typeof roomFiltersSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryFiltersInput = z.infer<typeof categoryFiltersSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
export type CourseFiltersInput = z.infer<typeof courseFiltersSchema>
export type StudentInput = z.infer<typeof studentSchema>
export type TeacherInput = z.infer<typeof teacherSchema>

// ===== GROUP SCHEMAS =====

export const dayOfWeekEnum = z.enum([
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", 
  "FRIDAY", "SATURDAY", "SUNDAY"
])

export const groupStatusEnum = z.enum([
  "ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"
])

export const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  course_id: z.number().min(1, "Course is required"),
  room_id: z.number().min(1, "Room is required"),
  teacher_id: z.number().min(1, "Teacher is required"),
  status: groupStatusEnum,
  days: z.array(dayOfWeekEnum).min(1, "At least one day must be selected"),
  start_time: z.string().min(1, "Start time is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  branch_id: z.number().min(1, "Branch is required"),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: "End date must be after start date",
  path: ["end_date"],
})

export const updateGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").optional(),
  course_id: z.number().min(1, "Course is required").optional(),
  room_id: z.number().min(1, "Room is required").optional(),
  teacher_id: z.number().min(1, "Teacher is required").optional(),
  status: groupStatusEnum.optional(),
  days: z.array(dayOfWeekEnum).min(1, "At least one day must be selected").optional(),
  start_time: z.string().min(1, "Start time is required").optional(),
  start_date: z.string().min(1, "Start date is required").optional(),
  end_date: z.string().min(1, "End date is required").optional(),
  branch_id: z.number().min(1, "Branch is required").optional(),
}).refine((data) => {
  if (data.end_date && data.start_date) {
    return new Date(data.end_date) > new Date(data.start_date)
  }
  return true
}, {
  message: "End date must be after start date",
  path: ["end_date"],
})

export const groupFiltersSchema = z.object({
  branch_id: z.number().optional(),
  course_id: z.number().optional(),
  teacher_id: z.number().optional(),
  room_id: z.number().optional(),
  status: groupStatusEnum.optional(),
  day: dayOfWeekEnum.optional(),
  start_date_from: z.string().optional(),
  start_date_to: z.string().optional(),
  name: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["name", "start_date", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type GroupFiltersInput = z.infer<typeof groupFiltersSchema>

// Teachers schemas
export const createTeacherSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+998\d{9}$/, "Phone must be in format +998XXXXXXXXX"),
  gender: z.enum(["MALE", "FEMALE"], { required_error: "Gender is required" }),
  birthday: z.string().min(1, "Birthday is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branch_id: z.number().min(1, "Branch is required"),
  coin: z.number().min(0, "Coin must be non-negative").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  description: z.string().optional(),
})

export const updateTeacherSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^\+998\d{9}$/, "Phone must be in format +998XXXXXXXXX").optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthday: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  branch_id: z.number().min(1, "Branch is required").optional(),
  coin: z.number().min(0, "Coin must be non-negative").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  description: z.string().optional(),
})

export const teacherFiltersSchema = z.object({
  branch_id: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  coin_min: z.number().optional(),
  coin_max: z.number().optional(),
  age_min: z.number().optional(),
  age_max: z.number().optional(),
  fullname: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["fullname", "coin", "birthday", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>
export type TeacherFiltersInput = z.infer<typeof teacherFiltersSchema>
