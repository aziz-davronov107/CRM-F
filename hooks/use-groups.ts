"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { Group, CreateGroupData, UpdateGroupData, GroupFilters, GroupSchedule, GroupStatistics } from '@/lib/types'

interface UseGroupsReturn {
  groups: Group[]
  loading: boolean
  isLoading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  refetch: () => Promise<void>
  createGroup: (data: CreateGroupData) => Promise<Group>
  updateGroup: (id: number, data: UpdateGroupData) => Promise<Group>
  deleteGroup: (id: number) => Promise<void>
  getGroupById: (id: number) => Promise<Group>
  isDeleting: boolean
}

interface UseGroupScheduleReturn {
  schedule: GroupSchedule | null
  loading: boolean
  error: string | null
  fetchSchedule: (params?: { week?: string; month?: string }) => Promise<void>
}

interface UseGroupStatisticsReturn {
  statistics: GroupStatistics | null
  loading: boolean
  error: string | null
  fetchStatistics: () => Promise<void>
}

export function useGroups(filters: GroupFilters = {}): UseGroupsReturn {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchGroups = useCallback(async () => {
    if (filters.enabled === false) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Fetching groups with filters:', filters)
      
      const params: Record<string, string> = {}
      
      if (filters.branch_id) params.branch_id = filters.branch_id.toString()
      if (filters.course_id) params.course_id = filters.course_id.toString()
      if (filters.teacher_id) params.teacher_id = filters.teacher_id.toString()
      if (filters.room_id) params.room_id = filters.room_id.toString()
      if (filters.status) params.status = filters.status
      if (filters.day) params.day = filters.day
      if (filters.start_date_from) params.start_date_from = filters.start_date_from
      if (filters.start_date_to) params.start_date_to = filters.start_date_to
      if (filters.name) params.name = filters.name
      if (filters.page) params.page = filters.page.toString()
      if (filters.limit) params.limit = filters.limit.toString()
      if (filters.sortBy) params.sortBy = filters.sortBy
      if (filters.sortOrder) params.sortOrder = filters.sortOrder
      
      const response = await apiClient.getGroups(params) as Group[]
      console.log('✅ Groups fetched successfully:', response)
      
      if (Array.isArray(response)) {
        setGroups(response)
        // API documentation-da pagination info yo'q, shuning uchun default qiymatlar
        setTotalPages(Math.ceil(response.length / (filters.limit || 10)))
        setCurrentPage(filters.page || 1)
      } else {
        console.warn('⚠️ Expected array but got:', response)
        setGroups([])
      }
    } catch (err: any) {
      console.error('❌ Error fetching groups:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch groups')
      setGroups([])
    } finally {
      setLoading(false)
    }
  }, [
    filters.branch_id,
    filters.course_id, 
    filters.teacher_id,
    filters.room_id,
    filters.status,
    filters.day,
    filters.start_date_from,
    filters.start_date_to,
    filters.name,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder
  ])

  const createGroup = useCallback(async (data: CreateGroupData): Promise<Group> => {
    try {
      console.log('🏗️ Creating group with data:', data)
      const newGroup = await apiClient.createGroup(data) as Group
      console.log('✅ Group created successfully:', newGroup)
      await fetchGroups() // Refresh list
      
      // Trigger global refresh for all groups hooks
      window.dispatchEvent(new CustomEvent('groups-updated'))
      
      return newGroup
    } catch (err: any) {
      console.error('❌ Error creating group:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create group'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchGroups])

  const updateGroup = useCallback(async (id: number, data: UpdateGroupData): Promise<Group> => {
    try {
      console.log('🔄 Attempting to update group with ID:', id)
      console.log('🔄 Update data:', data)
      console.log('🔄 Full update URL will be:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/groups/${id}`)
      
      const updatedGroup = await apiClient.updateGroup(id, data) as Group
      console.log('✅ Group updated successfully:', updatedGroup)
      await fetchGroups() // Refresh list
      
      // Trigger global refresh for all groups hooks
      window.dispatchEvent(new CustomEvent('groups-updated'))
      
      return updatedGroup
    } catch (err: any) {
      console.error('❌ Error updating group:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update group'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchGroups])

  const deleteGroup = useCallback(async (id: number): Promise<void> => {
    setIsDeleting(true)
    try {
      console.log('🗑️ Deleting group with ID:', id)
      
      const response = await apiClient.deleteGroup(id)
      console.log('✅ Delete API response:', response)
      
      console.log('🔄 Refreshing groups list...')
      await fetchGroups() // Refresh list
      
      // Trigger global refresh for all groups hooks
      window.dispatchEvent(new CustomEvent('groups-updated'))
      
      console.log('✅ Group deleted and list refreshed')
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      console.error('❌ Error response:', err.response)
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete group'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }, [fetchGroups])

  const getGroupById = useCallback(async (id: number): Promise<Group> => {
    try {
      console.log('🔍 Fetching group by ID:', id)
      const group = await apiClient.getGroupById(id) as Group
      console.log('✅ Group fetched:', group)
      return group
    } catch (err: any) {
      console.error('❌ Error fetching group:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch group'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    // Only fetch if enabled is not explicitly set to false
    if (filters.enabled !== false) {
      fetchGroups()
    }
  }, [fetchGroups, filters.enabled])

  // Listen for global groups updates
  useEffect(() => {
    const handleGroupsUpdate = () => {
      if (filters.enabled !== false) {
        fetchGroups()
      }
    }

    window.addEventListener('groups-updated', handleGroupsUpdate)
    return () => {
      window.removeEventListener('groups-updated', handleGroupsUpdate)
    }
  }, [fetchGroups, filters.enabled])

  return {
    groups,
    loading,
    isLoading: loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    isDeleting,
  }
}

export function useGroupSchedule(groupId: number): UseGroupScheduleReturn {
  const [schedule, setSchedule] = useState<GroupSchedule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async (params?: { week?: string; month?: string }) => {
    if (!groupId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('📅 Fetching group schedule for group:', groupId, 'with params:', params)
      const response = await apiClient.getGroupSchedule(groupId, params) as GroupSchedule
      console.log('✅ Group schedule fetched:', response)
      setSchedule(response)
    } catch (err: any) {
      console.error('❌ Error fetching group schedule:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch group schedule'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [groupId])

  return {
    schedule,
    loading,
    error,
    fetchSchedule,
  }
}

export function useGroupStatistics(groupId: number): UseGroupStatisticsReturn {
  const [statistics, setStatistics] = useState<GroupStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    if (!groupId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('📊 Fetching group statistics for group:', groupId)
      const response = await apiClient.getGroupStatistics(groupId) as GroupStatistics
      console.log('✅ Group statistics fetched:', response)
      setStatistics(response)
    } catch (err: any) {
      console.error('❌ Error fetching group statistics:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch group statistics'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    if (groupId) {
      fetchStatistics()
    }
  }, [groupId, fetchStatistics])

  return {
    statistics,
    loading,
    error,
    fetchStatistics,
  }
}