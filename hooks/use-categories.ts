"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { CourseCategory, CreateCategoryData, UpdateCategoryData, CategoryFilters, CategoryStatistics } from '@/lib/types'

interface UseCategoriesReturn {
  categories: CourseCategory[]
  loading: boolean
  isLoading: boolean // Alias for loading
  error: string | null
  totalPages: number
  currentPage: number
  refetch: () => void
  createCategory: (data: CreateCategoryData) => Promise<CourseCategory>
  updateCategory: (id: number, data: UpdateCategoryData) => Promise<CourseCategory>
  deleteCategory: (id: number) => Promise<void>
  getCategoryById: (id: number) => Promise<CourseCategory>
  isDeleting: boolean
}

export const useCategories = (filters: CategoryFilters = {}): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(filters.page || 1)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.branch_id) queryParams.append('branch_id', filters.branch_id.toString())
      if (filters.name) queryParams.append('name', filters.name)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const url = `/course-categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('📚 Fetching categories with URL:', url)
      console.log('🌐 Full API URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${url}`)
      
      const data: CourseCategory[] = await apiClient.get<CourseCategory[]>(url)
      
      console.log('✅ Categories data received:', data)
      console.log('✅ Data type:', typeof data, 'Is Array:', Array.isArray(data))
      
      const categoriesData: CourseCategory[] = Array.isArray(data) ? data : []
      console.log('✅ Setting categories:', categoriesData.length, 'items')
      
      setCategories(categoriesData)
      
      // Note: API should return pagination info, for now we'll set defaults
      setTotalPages(Math.ceil(categoriesData.length / (filters.limit || 10)))
      setCurrentPage(filters.page || 1)
      
      console.log('✅ State updated - loading will be set to false')
    } catch (err: any) {
      console.error('❌ Error fetching categories:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [filters.branch_id, filters.name, filters.page, filters.limit, filters.sortBy, filters.sortOrder])

  const createCategory = useCallback(async (data: CreateCategoryData): Promise<CourseCategory> => {
    try {
      // Clean data to ensure only backend-supported fields are sent
      const cleanData = {
        name: data.name,
        branch_id: data.branch_id || data.branchId,
      }
      
      // Remove any undefined or null values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key as keyof typeof cleanData] === undefined || cleanData[key as keyof typeof cleanData] === null) {
          delete cleanData[key as keyof typeof cleanData]
        }
      })
      
      console.log('🏗️ Creating category with clean data:', cleanData)
      const newCategory = await apiClient.createCategory(cleanData) as CourseCategory
      console.log('✅ Category created:', newCategory)
      await fetchCategories() // Refresh list
      
      // Trigger global refresh for all categories hooks
      window.dispatchEvent(new CustomEvent('categories-updated'))
      
      return newCategory
    } catch (err: any) {
      console.error('❌ Error creating category:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: number, data: UpdateCategoryData): Promise<CourseCategory> => {
    try {
      // Clean data to ensure only backend-supported fields are sent
      const cleanData = {
        name: data.name,
        branch_id: data.branch_id || data.branchId,
      }
      
      // Remove any undefined or null values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key as keyof typeof cleanData] === undefined || cleanData[key as keyof typeof cleanData] === null) {
          delete cleanData[key as keyof typeof cleanData]
        }
      })
      
      console.log('🔄 Attempting to update category with ID:', id)
      console.log('🔄 Update data:', cleanData)
      console.log('🔄 Full update URL will be:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/course-categories/${id}`)
      
      const updatedCategory = await apiClient.updateCategory(id, cleanData) as CourseCategory
      console.log('✅ Category updated successfully:', updatedCategory)
      await fetchCategories() // Refresh list
      
      // Trigger global refresh for all categories hooks
      window.dispatchEvent(new CustomEvent('categories-updated'))
      
      return updatedCategory
    } catch (err: any) {
      console.error('❌ Error updating category:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: number): Promise<void> => {
    setIsDeleting(true)
    try {
      console.log('🗑️ Deleting category with ID:', id)
      
      const response = await apiClient.deleteCategory(id)
      console.log('✅ Delete API response:', response)
      
      console.log('🔄 Refreshing categories list...')
      await fetchCategories() // Refresh list
      
      // Trigger global refresh for all categories hooks
      window.dispatchEvent(new CustomEvent('categories-updated'))
      
      console.log('✅ Category deleted and list refreshed')
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      console.error('❌ Error response:', err.response)
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete category'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }, [fetchCategories])

  const getCategoryById = useCallback(async (id: number): Promise<CourseCategory> => {
    try {
      console.log('🔍 Fetching category by ID:', id)
      const category = await apiClient.get<CourseCategory>(`/course-categories/${id}`)
      console.log('✅ Category fetched:', category)
      return category
    } catch (err: any) {
      console.error('❌ Error fetching category:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    // Only fetch if enabled is not explicitly set to false
    if (filters.enabled !== false) {
      fetchCategories()
    }
  }, [fetchCategories, filters.enabled])

  // Listen for global categories updates
  useEffect(() => {
    const handleCategoriesUpdate = () => {
      if (filters.enabled !== false) {
        fetchCategories()
      }
    }

    window.addEventListener('categories-updated', handleCategoriesUpdate)
    return () => {
      window.removeEventListener('categories-updated', handleCategoriesUpdate)
    }
  }, [fetchCategories, filters.enabled])

  return {
    categories,
    loading,
    isLoading: loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    isDeleting
  }
}

// Helper hook to get single category
export const useCategory = (id: number) => {
  const [category, setCategory] = useState<CourseCategory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.get<CourseCategory>(`/course-categories/${id}`)
      setCategory(data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch category')
      setCategory(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return {
    category,
    loading,
    error,
    refetch: fetchCategory
  }
}

// Hook for category statistics
export const useCategoryStatistics = (categoryId: number) => {
  const [statistics, setStatistics] = useState<CategoryStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = async () => {
    if (!categoryId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('📊 Fetching category statistics:', categoryId)
      const data = await apiClient.getCategoryStatistics(categoryId) as CategoryStatistics
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