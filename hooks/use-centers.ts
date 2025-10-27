"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { Center } from '@/lib/types'

interface CenterFilters {
  region?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  enabled?: boolean // Add enabled flag
}

interface UseCentersReturn {
  centers: Center[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useCenters = (filters: CenterFilters = {}): UseCentersReturn => {
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCenters = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.region) queryParams.append('region', filters.region)
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const url = `/centers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🏢 Fetching centers:', url)
      
      const data = await apiClient.get<Center[]>(url)
      
      console.log('✅ Centers data received:', data)
      
      setCenters(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('❌ Error fetching centers:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch centers')
      setCenters([])
    } finally {
      setLoading(false)
    }
  }, [filters.region, filters.page, filters.limit, filters.sortBy, filters.sortOrder])

  useEffect(() => {
    // Only fetch if enabled is not explicitly set to false
    if (filters.enabled !== false) {
      fetchCenters()
    }
  }, [fetchCenters, filters.enabled])

  return {
    centers,
    loading,
    error,
    refetch: fetchCenters
  }
}

// Helper hook to get single center
export const useCenter = (id: number) => {
  const [center, setCenter] = useState<Center | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCenter = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.get<Center>(`/centers/${id}`)
      setCenter(data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch center')
      setCenter(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCenter()
  }, [fetchCenter])

  return {
    center,
    loading,
    error,
    refetch: fetchCenter
  }
}