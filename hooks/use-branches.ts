"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { Branch, CreateBranchData, UpdateBranchData, BranchFilters } from '@/lib/types'

interface UseBranchesReturn {
  branches: Branch[]
  loading: boolean
  isLoading: boolean // Alias for loading
  error: string | null
  totalPages: number
  currentPage: number
  refetch: () => void
  createBranch: (data: CreateBranchData) => Promise<Branch>
  updateBranch: (id: number, data: UpdateBranchData) => Promise<Branch>
  deleteBranch: (id: number) => Promise<void>
  getBranchById: (id: number) => Promise<Branch>
}

export const useBranches = (filters: BranchFilters = {}): UseBranchesReturn => {
  const [branches, setBranches] = useState<Branch[]>([] as Branch[])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(filters.page || 1)

  const fetchBranches = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.center_id) queryParams.append('center_id', filters.center_id.toString())
      if (filters.region) queryParams.append('region', filters.region)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const url = `/branches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🔄 Fetching branches:', url)
      console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000')
      
      const data: Branch[] = await apiClient.get<Branch[]>(url)
      
      console.log('✅ Branches data received:', data)
      console.log('✅ Data type:', typeof data, 'Is Array:', Array.isArray(data))
      
      const branchesData: Branch[] = Array.isArray(data) ? data : []
      console.log('✅ Setting branches:', branchesData.length, 'items')
      
      setBranches(branchesData)
      
      // Note: API should return pagination info, for now we'll set defaults
      setTotalPages(Math.ceil(branchesData.length / (filters.limit || 10)))
      setCurrentPage(filters.page || 1)
      
      console.log('✅ State updated - loading will be set to false')
    } catch (err: any) {
      console.error('❌ Error fetching branches:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch branches')
      setBranches([] as Branch[])
    } finally {
      setLoading(false)
    }
  }, [filters.center_id, filters.region, filters.status, filters.page, filters.limit, filters.sortBy, filters.sortOrder])

  const createBranch = async (data: CreateBranchData): Promise<Branch> => {
    try {
      const newBranch = await apiClient.post<Branch>('/branches', data)
      await fetchBranches() // Refresh list
      
      // Trigger global refresh for all branches hooks
      window.dispatchEvent(new CustomEvent('branches-updated'))
      
      return newBranch
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create branch'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateBranch = async (id: number, data: UpdateBranchData): Promise<Branch> => {
    try {
      const updatedBranch = await apiClient.patch<Branch>(`/branches/${id}`, data)
      await fetchBranches() // Refresh list
      
      // Trigger global refresh for all branches hooks
      window.dispatchEvent(new CustomEvent('branches-updated'))
      
      return updatedBranch
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update branch'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteBranch = async (id: number): Promise<void> => {
    try {
      console.log('🗑️ Hook: Deleting branch', id)
      
      const response = await apiClient.delete(`/branches/${id}`)
      console.log('✅ Hook: Delete API response:', response)
      
      console.log('🔄 Hook: Refreshing branches list...')
      await fetchBranches() // Refresh list
      
      // Trigger global refresh for all branches hooks
      window.dispatchEvent(new CustomEvent('branches-updated'))
      
      console.log('✅ Hook: Branch deleted and list refreshed')
    } catch (err: any) {
      console.error('❌ Hook: Delete error:', err)
      console.error('❌ Hook: Error response:', err.response)
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete branch'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getBranchById = async (id: number): Promise<Branch> => {
    try {
      const branch = await apiClient.get<Branch>(`/branches/${id}`)
      return branch
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch branch'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    // Only fetch if enabled is not explicitly set to false
    if (filters.enabled !== false) {
      fetchBranches()
    }
  }, [fetchBranches, filters.enabled])

  // Listen for global branches updates
  useEffect(() => {
    const handleBranchesUpdate = () => {
      if (filters.enabled !== false) {
        fetchBranches()
      }
    }

    window.addEventListener('branches-updated', handleBranchesUpdate)
    return () => {
      window.removeEventListener('branches-updated', handleBranchesUpdate)
    }
  }, [fetchBranches, filters.enabled])

  return {
    branches,
    loading,
    isLoading: loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    getBranchById
  }
}

// Helper hook to get single branch
export const useBranch = (id: number) => {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBranch = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.get<Branch>(`/branches/${id}`)
      setBranch(data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch branch')
      setBranch(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBranch()
  }, [fetchBranch])

  return {
    branch,
    loading,
    error,
    refetch: fetchBranch
  }
}