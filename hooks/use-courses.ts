"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { Course, CreateCourseData, UpdateCourseData, CourseFilters, CourseStatistics } from '@/lib/types'

interface UseCoursesReturn {
  courses: Course[]
  loading: boolean
  isLoading: boolean // Alias for loading
  error: string | null
  totalPages: number
  currentPage: number
  refetch: () => void
  createCourse: (data: CreateCourseData) => Promise<Course>
  updateCourse: (id: number, data: UpdateCourseData) => Promise<Course>
  deleteCourse: (id: number) => Promise<void>
  getCourseById: (id: number) => Promise<Course>
  isDeleting: boolean
}

export const useCourses = (filters: CourseFilters = {}): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(filters.page || 1)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams: Record<string, string> = {}
      
      if (filters.branch_id) queryParams.branch_id = filters.branch_id.toString()
      if (filters.category_id) queryParams.category_id = filters.category_id.toString()
      if (filters.status) queryParams.status = filters.status
      if (filters.price_min !== undefined) queryParams.price_min = filters.price_min.toString()
      if (filters.price_max !== undefined) queryParams.price_max = filters.price_max.toString()
      if (filters.duration_min !== undefined) queryParams.duration_min = filters.duration_min.toString()
      if (filters.duration_max !== undefined) queryParams.duration_max = filters.duration_max.toString()
      if (filters.name) queryParams.name = filters.name
      if (filters.page) queryParams.page = filters.page.toString()
      if (filters.limit) queryParams.limit = filters.limit.toString()
      if (filters.sortBy) queryParams.sortBy = filters.sortBy
      if (filters.sortOrder) queryParams.sortOrder = filters.sortOrder

      console.log('📚 Fetching courses with filters:', queryParams)
      console.log('🌐 Full API URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/courses`)
      
      const data = await apiClient.getCourses(queryParams) as Course[]
      
      console.log('✅ Courses data received:', data)
      console.log('✅ Data type:', typeof data, 'Is Array:', Array.isArray(data))
      
      const coursesData: Course[] = Array.isArray(data) ? data : []
      console.log('✅ Setting courses:', coursesData.length, 'items')
      
      setCourses(coursesData)
      
      // Note: API should return pagination info, for now we'll set defaults
      setTotalPages(Math.ceil(coursesData.length / (filters.limit || 10)))
      setCurrentPage(filters.page || 1)
      
      console.log('✅ State updated - loading will be set to false')
    } catch (err: any) {
      console.error('❌ Error fetching courses:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [
    filters.branch_id, 
    filters.category_id, 
    filters.status, 
    filters.price_min, 
    filters.price_max,
    filters.duration_min,
    filters.duration_max,
    filters.name, 
    filters.page, 
    filters.limit, 
    filters.sortBy, 
    filters.sortOrder
  ])

  const createCourse = async (data: CreateCourseData): Promise<Course> => {
    try {
      console.log('🏗️ Creating course with clean data:', data)
      const newCourse = await apiClient.createCourse(data) as Course
      console.log('✅ Course created successfully:', newCourse)
      await fetchCourses() // Refresh list
      
      // Trigger global refresh for all courses hooks
      window.dispatchEvent(new CustomEvent('courses-updated'))
      
      return newCourse
    } catch (err: any) {
      console.error('❌ Error creating course:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create course'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCourse = async (id: number, data: UpdateCourseData): Promise<Course> => {
    try {
      console.log('🔄 Attempting to update course with ID:', id)
      console.log('🔄 Update data:', data)
      console.log('🔄 Full update URL will be:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/courses/${id}`)
      
      const updatedCourse = await apiClient.updateCourse(id, data) as Course
      console.log('✅ Course updated successfully:', updatedCourse)
      await fetchCourses() // Refresh list
      
      // Trigger global refresh for all courses hooks
      window.dispatchEvent(new CustomEvent('courses-updated'))
      
      return updatedCourse
    } catch (err: any) {
      console.error('❌ Error updating course:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update course'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCourse = async (id: number): Promise<void> => {
    setIsDeleting(true)
    try {
      console.log('🗑️ Deleting course with ID:', id)
      
      const response = await apiClient.deleteCourse(id)
      console.log('✅ Delete API response:', response)
      
      console.log('🔄 Refreshing courses list...')
      await fetchCourses() // Refresh list
      
      // Trigger global refresh for all courses hooks
      window.dispatchEvent(new CustomEvent('courses-updated'))
      
      console.log('✅ Course deleted and list refreshed')
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      console.error('❌ Error response:', err.response)
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete course'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const getCourseById = async (id: number): Promise<Course> => {
    try {
      console.log('🔍 Fetching course by ID:', id)
      const course = await apiClient.getCourseById(id) as Course
      console.log('✅ Course fetched:', course)
      return course
    } catch (err: any) {
      console.error('❌ Error fetching course:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    // Only fetch if enabled is not explicitly set to false
    if (filters.enabled !== false) {
      fetchCourses()
    }
  }, [fetchCourses, filters.enabled])

  // Listen for global courses updates
  useEffect(() => {
    const handleCoursesUpdate = () => {
      if (filters.enabled !== false) {
        fetchCourses()
      }
    }

    window.addEventListener('courses-updated', handleCoursesUpdate)
    return () => {
      window.removeEventListener('courses-updated', handleCoursesUpdate)
    }
  }, [fetchCourses, filters.enabled])

  return {
    courses,
    loading,
    isLoading: loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    isDeleting
  }
}

// Helper hook to get single course
export const useCourse = (id: number) => {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourse = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.getCourseById(id) as Course
      setCourse(data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch course')
      setCourse(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCourse()
  }, [fetchCourse])

  return {
    course,
    loading,
    error,
    refetch: fetchCourse
  }
}

// Hook for course statistics
export const useCourseStatistics = (courseId: number) => {
  const [statistics, setStatistics] = useState<CourseStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = async () => {
    if (!courseId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('📊 Fetching course statistics:', courseId)
      const data = await apiClient.getCourseStatistics(courseId) as CourseStatistics
      console.log('✅ Statistics data:', data)
      setStatistics(data)
    } catch (err: any) {
      console.error('❌ Error fetching statistics:', err)
      setError(err.response?.data?.message || err.message || 'Failed to fetch statistics')
      setStatistics(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    statistics,
    loading,
    error,
    fetchStatistics
  }
}