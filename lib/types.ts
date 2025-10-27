export type UserRole = "ADMIN" | "TEACHER" | "STUDENT"
export type BranchStatus = "ACTIVE" | "INACTIVE"
export type Gender = "MALE" | "FEMALE"
export type GroupStatus = "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED"
export type StudentStatus = "ACTIVE" | "INACTIVE" | "GRADUATED"
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"


export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  branch_id: number
  photo?: string
}

export interface Center {
  id: number
  name: string
  region: string
  address: string
  phone: string
  email: string
  branches?: Branch[]
  createdAt: string
  updatedAt: string
}

export interface Branch {
  id: number
  name: string
  region: string
  district: string
  address: string
  phone: string
  status: BranchStatus
  center_id: number
  center?: Center
  rooms?: Room[]
  courses?: Course[]
  teachers?: Teacher[]
  groups?: Group[]
  createdAt: string
  updatedAt: string
}

export interface CreateBranchData {
  name: string
  region: string
  district: string
  address: string
  phone: string
  status: BranchStatus
  center_id: number
}

export interface UpdateBranchData {
  name?: string
  region?: string
  district?: string
  address?: string
  phone?: string
  status?: BranchStatus
  center_id?: number
}

export interface BranchFilters {
  center_id?: number
  region?: string
  status?: BranchStatus
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  enabled?: boolean
}

export interface Room {
  id: number
  branch_id: number
  name: string
  capacity: number
  branch?: Branch
  groups?: Group[]
  createdAt: string
  updatedAt: string
}

export interface CreateRoomData {
  branch_id: number
  name: string
  capacity: number
}

export interface UpdateRoomData {
  branch_id?: number
  name?: string
  capacity?: number
}

// Course interfaces
export interface Course {
  id: number
  branch_id: number
  category_id: number
  name: string
  status: "ACTIVE" | "INACTIVE"
  price: number
  duration_hours: number
  duration_months: number
  description?: string
  branch?: Branch
  category?: CourseCategory
  groups?: Group[]
  _count?: {
    groups: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCourseData {
  branch_id: number
  category_id: number
  name: string
  status: "ACTIVE" | "INACTIVE"
  price: number
  duration_hours: number
  duration_months: number
  description?: string
}

export interface UpdateCourseData {
  branch_id?: number
  category_id?: number
  name?: string
  status?: "ACTIVE" | "INACTIVE"
  price?: number
  duration_hours?: number
  duration_months?: number
  description?: string
}

export interface CourseFilters {
  branch_id?: number
  category_id?: number
  status?: "ACTIVE" | "INACTIVE"
  price_min?: number
  price_max?: number
  duration_min?: number
  duration_max?: number
  name?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  enabled?: boolean
}

export interface CourseStatistics {
  course: {
    id: number
    name: string
    price: number
    duration_months: number
  }
  totalGroups: number
  activeGroups: number
  completedGroups: number
  totalStudents: number
  activeStudents: number
  graduatedStudents: number
  totalRevenue: string
  averageGroupSize: number
  completionRate: string
  monthlyEnrollments: Array<{
    month: string
    students: number
    revenue: string
  }>
  attendanceRate: string
}

// Alternative name for filters in component props
export interface CoursesFilters {
  search?: string
  branchId?: number
  categoryId?: number
  status?: "ACTIVE" | "INACTIVE"
  priceMin?: number
  priceMax?: number
  durationMin?: number
  durationMax?: number
}

export interface RoomFilters {
  branch_id?: number
  capacity_min?: number
  capacity_max?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface RoomAvailability {
  room: {
    id: number
    name: string
    capacity: number
  }
  date: string
  schedule: Array<{
    time: string
    group: {
      id: number
      name: string
      course: string
    } | null
    available: boolean
  }>
}

export interface CourseCategory {
  id: number
  name: string
  branch_id: number
  branchId?: number // Alias for branch_id
  branch?: Branch
  courses?: Course[]
  coursesCount?: number // Alias for _count.courses
  _count?: {
    courses: number
  }
  createdAt: string
  updatedAt: string
// Teacher interfaces
}
export type TeacherGender = "MALE" | "FEMALE"
export type TeacherStatus = "ACTIVE" | "INACTIVE"

// --- Teacher model (yagona) ---
export interface Teacher {
  id: number
  fullname: string
  email: string
  phone: string
  gender: TeacherGender
  birthday: string
  branch_id: number
  coin: number
  status: TeacherStatus

  // rasmlar uchun nomlar turlicha bo‘lishi mumkin:
  photo?: string | null          // FE-ning umumiy nomi
  teacher_photo?: string | null  // BE shunday yuborsa ham mos kelsin

  // relatsiyalar (ixtiyoriy)
  branch?: Branch
  groups?: Group[]

  // count (ixtiyoriy)
  _count?: {
    groups: number
  }

  createdAt: string
  updatedAt: string
}

// --- Teacher DTOs ---
export interface CreateTeacherData {
  fullname: string
  email: string
  phone: string
  gender: TeacherGender
  birthday: string
  password: string
  branch_id: number
  status: TeacherStatus
  coin?: number
  description?: string | null
  photo?: string | null
}

export interface UpdateTeacherData {
  fullname?: string
  email?: string
  phone?: string
  gender?: TeacherGender
  birthday?: string
  password?: string
  branch_id?: number
  status?: TeacherStatus
  coin?: number
  description?: string | null
  photo?: string | null
}

// --- Teacher filters ---
export interface TeacherFilters {
  branch_id?: number
  status?: TeacherStatus
  gender?: TeacherGender
  coin_min?: number
  coin_max?: number
  age_min?: number
  age_max?: number
  fullname?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateCategoryData {
  name: string
  branch_id?: number
  branchId?: number // Alternative property name
}

export interface UpdateCategoryData {
  name?: string
  branch_id?: number
  branchId?: number // Alternative property name
}

export interface CategoryFilters {
  branch_id?: number
  name?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  enabled?: boolean
}

// Alternative name for filters in component props
export interface CategoriesFilters {
  search?: string
  branchId?: number
}

export interface CategoryStatistics {
  category: {
    id: number
    name: string
  }
  totalCourses: number
  activeCourses: number
  inactiveCourses: number
  totalGroups: number
  activeGroups: number
  totalStudents: number
  averagePrice: string
  averageDuration: number
  coursesByStatus: {
    ACTIVE: number
    INACTIVE: number
  }
  monthlyEnrollments: Array<{
    month: string
    students: number
  }>
}



export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

// Student interfaces
export interface Student {
  id: number
  fullname: string
  email: string
  phone: string
  gender: Gender
  photo?: string
  birthday: string
  status: StudentStatus
  age?: number
  other_details?: string
  description?: string
  studentGroups?: StudentGroup[]
  _count?: {
    studentGroups: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateStudentData {
  fullname: string
  email: string
  password: string
  phone: string
  gender: Gender
  birthday: string
  status: StudentStatus
  description?: string
  other_details?: string
}

export interface UpdateStudentData {
  fullname?: string
  email?: string
  password?: string
  phone?: string
  gender?: Gender
  birthday?: string
  status?: StudentStatus
  description?: string
  other_details?: string
}

export interface StudentFilters {
  status?: StudentStatus
  gender?: Gender
  age_min?: number
  age_max?: number
  fullname?: string
  email?: string
  has_groups?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface StudentStatistics {
  student: {
    id: number
    fullname: string
    status: StudentStatus
    age: number
  }
  totalGroups: number
  activeGroups: number
  completedGroups: number
  totalCourses: number
  totalInvestment: string
  averageAttendanceRate: string
  totalClasses: number
  attendedClasses: number
  missedClasses: number
  performanceScore: number
  attendanceHistory: Array<{
    month: string
    totalClasses: number
    attended: number
    rate: string
  }>
  courseProgress: Array<{
    course: string
    group: string
    status: string
    completionRate: string
    attendanceRate: string
  }>
}

export interface StudentAttendanceReport {
  student: {
    id: number
    fullname: string
  }
  period: {
    start_date: string
    end_date: string
  }
  summary: {
    totalDays: number
    presentDays: number
    absentDays: number
    lateDays: number
    excusedDays: number
    attendanceRate: string
  }
  dailyAttendance: Array<{
    date: string
    status: AttendanceStatus
    group: string
    note?: string
  }>
}

// Student Group interfaces
export interface StudentGroup {
  id: number
  group_id: number
  student_id: number
  group?: Group
  student?: Student
  attendances?: Attendance[]
  _count?: {
    attendances: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateStudentGroupData {
  group_id: number
  student_id: number
}

export interface UpdateStudentGroupData {
  group_id?: number
  student_id?: number
}

export interface StudentGroupFilters {
  group_id?: number
  student_id?: number
  branch_id?: number
  course_id?: number
  teacher_id?: number
  status?: GroupStatus | StudentStatus
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface GroupStudentsResponse {
  group: {
    id: number
    name: string
    course: string
    teacher: string
  }
  totalStudents: number
  students: Array<{
    id: number
    student: Student
    enrolledAt: string
    attendanceStats?: {
      totalClasses: number
      attended: number
      missed: number
      rate: string
    }
  }>
}

export interface StudentGroupsResponse {
  student: Student
  totalGroups: number
  groups: Array<{
    id: number
    group: Group
    enrolledAt: string
    attendanceRate?: string
    isActive: boolean
  }>
}

export interface BulkEnrollResponse {
  group: {
    id: number
    name: string
  }
  successful: Array<{
    id: number
    student_id: number
    student_name: string
  }>
  failed: Array<{
    student_id: number
    student_name: string
    reason: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

export interface Attendance {
  id: number
  date: string
  status: AttendanceStatus
  note?: string
  studentGroup?: StudentGroup
}

export interface Group {
  id: number
  name: string
  course_id: number
  room_id: number
  teacher_id: number
  status: GroupStatus
  days: DayOfWeek[]
  start_time: string
  start_date: string
  end_date: string
  branch_id: number
  branch?: Branch
  course?: Course
  room?: Room
  teacher?: Teacher
  studentGroups?: StudentGroup[]
  _count?: {
    studentGroups: number
  }
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  id: number
  phone: string
  email: string
  fullname: string
  gender: Gender

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

// ===== GROUPS INTERFACES =====

export interface CreateGroupData {
  name: string
  course_id: number
  room_id: number
  teacher_id: number
  status: GroupStatus
  days: DayOfWeek[]
  start_time: string
  start_date: string
  end_date: string
  branch_id: number
}

export interface UpdateGroupData {
  name?: string
  course_id?: number
  room_id?: number
  teacher_id?: number
  status?: GroupStatus
  days?: DayOfWeek[]
  start_time?: string
  start_date?: string
  end_date?: string
  branch_id?: number
}

export interface GroupFilters {
  branch_id?: number
  course_id?: number
  teacher_id?: number
  room_id?: number
  status?: GroupStatus
  day?: DayOfWeek
  start_date_from?: string
  start_date_to?: string
  name?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  enabled?: boolean
}

export interface GroupSchedule {
  group: {
    id: number
    name: string
    days: DayOfWeek[]
    start_time: string
  }
  period: {
    start_date: string
    end_date: string
    type: "week" | "month"
  }
  schedule: Array<{
    date: string
    day: DayOfWeek
    time?: string
    hasClass: boolean
    attendances?: Array<{
      student: string
      status: AttendanceStatus
    }>
  }>
}

export interface GroupStatistics {
  group: {
    id: number
    name: string
    status: GroupStatus
    course: string
  }
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  totalClasses: number
  completedClasses: number
  remainingClasses: number
  progressPercentage: string
  totalRevenue: string
  averageAttendanceRate: string
  studentAttendance: Array<{
    student: {
      id: number
      fullname: string
    }
    totalClasses: number
    attended: number
    missed: number
    rate: string
  }>
  monthlyProgress: Array<{
    month: string
    classesHeld: number
    averageAttendance: string
  }>
}
