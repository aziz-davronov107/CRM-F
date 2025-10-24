"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, UserRole } from "./types"
import { apiClient } from "./api-client"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  currentBranchId: number | null
  setCurrentBranchId: (id: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentBranchId, setCurrentBranchId] = useState<number | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if running in browser
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem("token")
          if (token === "fake_admin_token") {
            // For demo purposes, set a default user
            setUser({
              id: 1,
              name: "Admin",
              email: "admin@gmail.com",
              phone: "+998901234567",
              branch_id: 1,
              role: "ADMIN"
            })
            setCurrentBranchId(1)
          }
        }
      } catch (error) {
        console.error("Auth init error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Demo login - real implementation would call API
    if (email === "admin@gmail.com" && password === "123456") {
      const userData = {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        phone: "+998901234567",
        branch_id: 1,
        role: "ADMIN" as UserRole
      }
      setUser(userData)
      setCurrentBranchId(userData.branch_id)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", "fake_admin_token")
        localStorage.setItem("current_branch_id", userData.branch_id.toString())
      }
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    setCurrentBranchId(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
      localStorage.removeItem("current_branch_id")
    }
  }

  const handleSetCurrentBranchId = (id: number) => {
    setCurrentBranchId(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem("current_branch_id", id.toString())
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        currentBranchId,
        setCurrentBranchId: handleSetCurrentBranchId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
