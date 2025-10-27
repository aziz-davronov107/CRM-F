"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import type { 
  StudentGroup, 
  CreateStudentGroupData, 
  UpdateStudentGroupData, 
  StudentGroupFilters,
  GroupStudentsResponse,
  StudentGroupsResponse,
  BulkEnrollResponse 
} from "@/lib/types"

export function useStudentGroups(filters: StudentGroupFilters = {}) {
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentGroups = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentGroups(filters)
      setStudentGroups(data as StudentGroup[])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch student groups"
      setError(errorMessage)
      console.error("Error fetching student groups:", err)
    } finally {
      setLoading(false)
    }
  }

  const enrollStudent = async (studentGroupData: CreateStudentGroupData) => {
    try {
      const response = await apiClient.createStudentGroup(studentGroupData)
      toast.success("Student enrolled successfully")
      await fetchStudentGroups() // Refresh list
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to enroll student"
      toast.error(errorMessage)
      throw err
    }
  }

  const updateStudentGroup = async (id: number, updateData: UpdateStudentGroupData) => {
    try {
      const response = await apiClient.updateStudentGroup(id, updateData)
      toast.success("Student group updated successfully")
      await fetchStudentGroups() // Refresh list
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update student group"
      toast.error(errorMessage)
      throw err
    }
  }

  const removeStudentFromGroup = async (id: number) => {
    try {
      await apiClient.deleteStudentGroup(id)
      toast.success("Student removed from group successfully")
      await fetchStudentGroups() // Refresh list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to remove student from group"
      toast.error(errorMessage)
      throw err
    }
  }

  const bulkEnrollStudents = async (data: { group_id: number; student_ids: number[] }) => {
    try {
      const response = await apiClient.bulkEnrollStudents(data) as BulkEnrollResponse
      toast.success(`${response.summary.successful} students enrolled successfully`)
      if (response.summary.failed > 0) {
        toast.warning(`${response.summary.failed} students failed to enroll`)
      }
      await fetchStudentGroups() // Refresh list
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to bulk enroll students"
      toast.error(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchStudentGroups()
  }, [JSON.stringify(filters)])

  return {
    studentGroups,
    loading,
    error,
    refetch: fetchStudentGroups,
    enrollStudent,
    updateStudentGroup,
    removeStudentFromGroup,
    bulkEnrollStudents
  }
}

export function useStudentGroup(studentGroupId?: number) {
  const [studentGroup, setStudentGroup] = useState<StudentGroup | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentGroup = async () => {
    if (!studentGroupId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentGroupById(studentGroupId)
      setStudentGroup(data as StudentGroup)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch student group"
      setError(errorMessage)
      console.error("Error fetching student group:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentGroupId) {
      fetchStudentGroup()
    }
  }, [studentGroupId])

  return {
    studentGroup,
    loading,
    error,
    refetch: fetchStudentGroup
  }
}

export function useGroupStudents(groupId?: number, withAttendance: boolean = false) {
  const [groupStudents, setGroupStudents] = useState<GroupStudentsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroupStudents = async () => {
    if (!groupId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Fetching students for group ID:', groupId)
      const data = await apiClient.getGroupStudents(groupId, withAttendance)
      console.log('📊 Group students response:', data)
      setGroupStudents(data as GroupStudentsResponse)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch group students"
      setError(errorMessage)
      console.error("Error fetching group students:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (groupId) {
      fetchGroupStudents()
    }
  }, [groupId, withAttendance])

  return {
    groupStudents,
    loading,
    error,
    refetch: fetchGroupStudents
  }
}

export function useStudentGroupsByStudentId(studentId?: number, current: boolean = false) {
  const [studentGroups, setStudentGroups] = useState<StudentGroupsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentGroups = async () => {
    if (!studentId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getStudentGroupsByStudentId(studentId, current)
      setStudentGroups(data as StudentGroupsResponse)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch student groups"
      setError(errorMessage)
      console.error("Error fetching student groups:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      fetchStudentGroups()
    }
  }, [studentId, current])

  return {
    studentGroups,
    loading,
    error,
    refetch: fetchStudentGroups
  }
}