"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData, 
  StudentFilters,
  StudentStatistics,
  StudentAttendanceReport 
} from "@/lib/types"

export function useStudents(filters: StudentFilters = {}) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudents(filters)
      setStudents(data as Student[])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch students"
      setError(errorMessage)
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }

  const createStudent = async (studentData: CreateStudentData) => {
    try {
      const response = await apiClient.createStudent(studentData)
      toast.success("Student created successfully")
      await fetchStudents() // Refresh list
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create student"
      toast.error(errorMessage)
      throw err
    }
  }

  const updateStudent = async (id: number, updateData: UpdateStudentData) => {
    try {
      const response = await apiClient.updateStudent(id, updateData)
      toast.success("Student updated successfully")
      await fetchStudents() // Refresh list
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update student"
      toast.error(errorMessage)
      throw err
    }
  }

  const deleteStudent = async (id: number) => {
    try {
      await apiClient.deleteStudent(id)
      toast.success("Student deleted successfully")
      await fetchStudents() // Refresh list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete student"
      toast.error(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [JSON.stringify(filters)])

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent
  }
}

export function useStudent(studentId?: number) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudent = async () => {
    if (!studentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentById(studentId)
      setStudent(data as Student)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch student"
      setError(errorMessage)
      console.error("Error fetching student:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchStudent()
    }
  }, [studentId])

  return {
    student,
    loading,
    error,
    refetch: fetchStudent
  }
}

export function useStudentStatistics(studentId?: number) {
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = async () => {
    if (!studentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentStatistics(studentId)
      setStatistics(data as StudentStatistics)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch student statistics"
      setError(errorMessage)
      console.error("Error fetching student statistics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchStatistics()
    }
  }, [studentId])

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  }
}

export function useStudentAttendanceReport(studentId?: number, filters: Record<string, any> = {}) {
  const [report, setReport] = useState<StudentAttendanceReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = async () => {
    if (!studentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentAttendanceReport(studentId, filters)
      setReport(data as StudentAttendanceReport)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch attendance report"
      setError(errorMessage)
      console.error("Error fetching attendance report:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchReport()
    }
  }, [studentId, JSON.stringify(filters)])

  return {
    report,
    loading,
    error,
    refetch: fetchReport
  }
}