import axios, { type AxiosInstance, type AxiosError } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

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

  async get<T>(url: string, params?: any) {
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

  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url)
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
}

export const apiClient = new ApiClient()
