import axios, { type AxiosInstance, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

class ApiClient {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.client.interceptors.request.use((config) => {
      const token = this.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshAccessToken()
          }

          try {
            const newToken = await this.refreshPromise
            this.refreshPromise = null
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.logout()
            window.location.href = "/login"
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("access_token")
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refresh_token")
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) throw new Error("No refresh token")

    const response = await this.client.post("/auth/refresh", {
      refresh_token: refreshToken,
    })

    const { access_token, refresh_token } = response.data
    this.setTokens(access_token, refresh_token)
    return access_token
  }

  private logout() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("current_branch_id")
  }

  async login(email: string, password: string) {
    const response = await this.client.post("/auth/login", { email, password })
    const { access_token, refresh_token, user } = response.data
    this.setTokens(access_token, refresh_token)
    return { access_token, refresh_token, user }
  }

  async getMe() {
    const response = await this.client.get("/auth/me")
    return response.data
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any) {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any) {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any) {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }

  async delete<T>(url: string) {
    console.log('🌐 API Client: DELETE request to:', url)
    const response = await this.client.delete<T>(url)
    console.log('✅ API Client: DELETE response:', response.status, response.data)
    return response.data
  }

  async upload(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    const response = await this.client.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  }

  // Centers API methods
  async getCenters(params?: any) {
    return this.get("/centers", params)
  }

  async getCenterById(id: number) {
    return this.get(`/centers/${id}`)
  }

  // Branches API methods
  async getBranches(params?: any) {
    return this.get("/branches", params)
  }

  async getBranchById(id: number) {
    return this.get(`/branches/${id}`)
  }

  async createBranch(data: any) {
    return this.post("/branches", data)
  }

  async updateBranch(id: number, data: any) {
    return this.patch(`/branches/${id}`, data)
  }

  async deleteBranch(id: number) {
    return this.delete(`/branches/${id}`)
  }

  // Rooms API methods
  async getRooms(params?: any) {
    return this.get("/rooms", params)
  }

  async getRoomById(id: number) {
    return this.get(`/rooms/${id}`)
  }

  async createRoom(data: any) {
    return this.post("/rooms", data)
  }

  async updateRoom(id: number, data: any) {
    return this.patch(`/rooms/${id}`, data)
  }

  async deleteRoom(id: number) {
    return this.delete(`/rooms/${id}`)
  }

  async getRoomAvailability(id: number, date?: string) {
    const params = date ? { date } : undefined
    return this.get(`/rooms/availability/${id}`, params)
  }

  // Course Categories API methods
  async getCategories(params?: any) {
    return this.get("/course-categories", params)
  }

  async getCategoryById(id: number) {
    return this.get(`/course-categories/${id}`)
  }

  async createCategory(data: any) {
    console.log('🏗️ Creating category with POST to /course-categories')
    console.log('🏗️ Data being sent:', data)
    return this.post("/course-categories", data)
  }

  async updateCategory(id: number, data: any) {
    // Try different endpoints - some backends use different patterns
    try {
      console.log('🔄 Trying PUT method for update...')
      return this.put(`/course-categories/${id}`, data)
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('🔄 PUT failed with 404, trying PATCH method...')
        try {
          return this.patch(`/course-categories/${id}`, data)
        } catch (patchError: any) {
          if (patchError.response?.status === 404) {
            console.log('🔄 PATCH failed with 404, trying POST to update endpoint...')
            return this.post(`/course-categories/${id}/update`, data)
          }
          throw patchError
        }
      }
      throw error
    }
  }

  async deleteCategory(id: number) {
    console.log('🗑️ Deleting category with DELETE to /course-categories/' + id)
    return this.delete(`/course-categories/${id}`)
  }

  async getCategoryStatistics(id: number) {
    return this.get(`/course-categories/${id}/statistics`)
  }

  // Courses API methods
  async getCourses(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.get(`/courses${queryString}`)
  }

  async createCourse(data: any) {
    console.log('🏗️ Creating course with POST to /courses')
    console.log('🏗️ Data being sent:', data)
    return this.post("/courses", data)
  }

  async updateCourse(id: number, data: any) {
    console.log('🔄 Updating course with PUT to /courses/' + id)
    console.log('🔄 Data being sent:', data)
    return this.put(`/courses/${id}`, data)
  }

  async deleteCourse(id: number) {
    console.log('🗑️ Deleting course with DELETE to /courses/' + id)
    return this.delete(`/courses/${id}`)
  }

  async getCourseById(id: number) {
    return this.get(`/courses/${id}`)
  }

  async getCourseStatistics(id: number) {
    return this.get(`/courses/${id}/statistics`)
  }

  // ===== GROUPS API METHODS =====

  async getGroups(params?: any) {
    console.log('🔍 Fetching groups with params:', params)
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.get(`/groups${queryString}`)
  }

  async createGroup(data: any) {
    console.log('🏗️ Creating group with POST to /groups')
    console.log('🏗️ Data being sent:', data)
    return this.post("/groups", data)
  }

  async updateGroup(id: number, data: any) {
    console.log('🔄 Updating group with PATCH to /groups/' + id)
    console.log('🔄 Data being sent:', data)
    return this.patch(`/groups/${id}`, data)
  }

  async deleteGroup(id: number) {
    console.log('🗑️ Deleting group with DELETE to /groups/' + id)
    return this.delete(`/groups/${id}`)
  }

  async getGroupById(id: number) {
    return this.get(`/groups/${id}`)
  }

  async getGroupSchedule(id: number, params?: { week?: string; month?: string }) {
    console.log('📅 Fetching group schedule for group:', id, 'with params:', params)
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return this.get(`/groups/${id}/schedule${queryString}`)
  }

  async getGroupStatistics(id: number) {
    return this.get(`/groups/${id}/statistics`)
  }

  // Teachers API
  async getTeachers(filters?: Record<string, any>) {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, String(filters[key]))
        }
      })
    }
    
    const queryString = params.toString()
    return this.get(`/teachers${queryString ? `?${queryString}` : ''}`)
  }

  async createTeacher(data: any) {
    return this.post('/teachers', data)
  }

  async getTeacherById(id: number) {
    return this.get(`/teachers/${id}`)
  }

  async updateTeacher(id: number, data: any) {
    return this.patch(`/teachers/${id}`, data)
  }

  async deleteTeacher(id: number) {
    return this.delete(`/teachers/${id}`)
  }

  async getTeacherStatistics(id: number) {
    return this.get(`/teachers/${id}/statistics`)
  }

  async addCoinToTeacher(id: number, amount: number, reason: string) {
    return this.post(`/teachers/${id}/add-coin`, { amount, reason })
  }

  // ===== STUDENTS API METHODS =====

  async getStudents(filters?: Record<string, any>) {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, String(filters[key]))
        }
      })
    }
    
    const queryString = params.toString()
    return this.get(`/students${queryString ? `?${queryString}` : ''}`)
  }

  async createStudent(data: any) {
    console.log('🏗️ Creating student with POST to /students')
    console.log('🏗️ Data being sent:', data)
    return this.post('/students', data)
  }

  async getStudentById(id: number) {
    return this.get(`/students/${id}`)
  }

  async updateStudent(id: number, data: any) {
    console.log('🔄 Updating student with PATCH to /students/' + id)
    console.log('🔄 Data being sent:', data)
    return this.patch(`/students/${id}`, data)
  }

  async deleteStudent(id: number) {
    console.log('🗑️ Deleting student with DELETE to /students/' + id)
    return this.delete(`/students/${id}`)
  }

  async getStudentStatistics(id: number) {
    return this.get(`/students/${id}/statistics`)
  }

  async getStudentAttendanceReport(id: number, filters?: Record<string, any>) {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, String(filters[key]))
        }
      })
    }
    
    const queryString = params.toString()
    return this.get(`/students/${id}/attendance-report${queryString ? `?${queryString}` : ''}`)
  }

  // ===== STUDENT-GROUPS API METHODS =====

  async getStudentGroups(filters?: Record<string, any>) {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, String(filters[key]))
        }
      })
    }
    
    const queryString = params.toString()
    return this.get(`/student-groups${queryString ? `?${queryString}` : ''}`)
  }

  async createStudentGroup(data: any) {
    console.log('🏗️ Enrolling student to group with POST to /student-groups')
    console.log('🏗️ Data being sent:', data)
    return this.post('/student-groups', data)
  }

  async getStudentGroupById(id: number) {
    return this.get(`/student-groups/${id}`)
  }

  async updateStudentGroup(id: number, data: any) {
    console.log('🔄 Updating student-group with PATCH to /student-groups/' + id)
    console.log('🔄 Data being sent:', data)
    return this.patch(`/student-groups/${id}`, data)
  }

  async deleteStudentGroup(id: number) {
    console.log('🗑️ Removing student from group with DELETE to /student-groups/' + id)
    return this.delete(`/student-groups/${id}`)
  }

  async getGroupStudents(groupId: number, withAttendance: boolean = false) {
    const params: any = { group_id: groupId };
    if (withAttendance) params.with_attendance = 'true';
    console.log('🌐 API: Getting students for group', groupId, 'with params:', params);
    const response = await this.get(`/student-groups/`, params);
    console.log('📊 API response for group students:', response);
    return response;
  }

  async getStudentGroupsByStudentId(studentId: number, current: boolean = false) {
    const params = current ? { current: 'true' } : {}
    return this.get(`/student-groups/student/${studentId}/groups`, params)
  }

  async bulkEnrollStudents(data: { group_id: number; student_ids: number[] }) {
    console.log('🏗️ Bulk enrolling students with POST to /student-groups/bulk-enroll')
    console.log('🏗️ Data being sent:', data)
    return this.post('/student-groups/bulk-enroll', data)
  }
}

export const apiClient = new ApiClient()
