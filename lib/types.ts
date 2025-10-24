export type UserRole = "ADMIN" | "TEACHER" | "STUDENT"
export type BranchStatus = "ACTIVE" | "INACTIVE"
export type Gender = "MALE" | "FEMALE"
export type GroupStatus = "Planned" | "Active" | "Finished"
export type StudentStatus = "Active" | "Inactive" | "Graduated"
export type TeacherStatus = "Active" | "OnLeave" | "Inactive"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  branch_id: number
  photo?: string
}

export interface Branch {
  id: number
  name: string
  region: string
  district: string
  address: string
  phone: string
  status: BranchStatus
}

export interface Room {
  id: number
  branch_id: number
  name: string
  capacity: number
}

export interface CourseCategory {
  id: number
  name: string
  branch_id: number
}

export interface Course {
  id: number
  branch_id: number
  category_id: number
  name: string
  status: string
  price: number
  course_photo?: string
  duration_hours: number
  duration_months: number
  description: string
}

export interface Group {
  id: number
  name: string
  course_id: number
  room_id: number
  teacher_id: number
  status: GroupStatus
  days: string[]
  start_time: string
  start_date: string
  end_date: string
  branch_id: number
}

export interface Student {
  id: string
  fullname: string
  email: string
  phone: string
  gender: Gender
  student_photo?: string
  birthday: string
  status: StudentStatus
  other_details?: Record<string, any>
  branch_id: number
}

export interface Teacher {
  id: number
  phone: string
  email: string
  fullname: string
  gender: Gender
  teacher_photo?: string
  birthday: string
  branch_id: number
  coin: number
  status: TeacherStatus
  description: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
