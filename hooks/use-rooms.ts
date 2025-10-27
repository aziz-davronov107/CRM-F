"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { Room, CreateRoomData, UpdateRoomData, RoomFilters, RoomAvailability } from '@/lib/types'

interface UseRoomsReturn {
  rooms: Room[]
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  refetch: () => void
  createRoom: (data: CreateRoomData) => Promise<Room>
  updateRoom: (id: number, data: UpdateRoomData) => Promise<Room>
  deleteRoom: (id: number) => Promise<void>
  getRoomById: (id: number) => Promise<Room>
}

export const useRooms = (filters: RoomFilters = {}): UseRoomsReturn => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(filters.page || 1)

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.branch_id) queryParams.append('branch_id', filters.branch_id.toString())
      if (filters.capacity_min) queryParams.append('capacity_min', filters.capacity_min.toString())
      if (filters.capacity_max) queryParams.append('capacity_max', filters.capacity_max.toString())
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

      const url = `/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      console.log('🏠 Fetching rooms:', url)
      console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000')
      
      const data: Room[] = await apiClient.get<Room[]>(url)
      
      console.log('✅ Rooms data received:', data)
      console.log('✅ Data type:', typeof data, 'Is Array:', Array.isArray(data))
      
      const roomsData: Room[] = Array.isArray(data) ? data : []
      console.log('✅ Setting rooms:', roomsData.length, 'items')
      
      setRooms(roomsData)
      
      // Note: API should return pagination info, for now we'll set defaults
      setTotalPages(Math.ceil(roomsData.length / (filters.limit || 10)))
      setCurrentPage(filters.page || 1)
      
      console.log('✅ State updated - loading will be set to false')
    } catch (err: any) {
      console.error('❌ Error fetching rooms:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.message || err.message || 'Failed to fetch rooms')
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [filters.branch_id, filters.capacity_min, filters.capacity_max, filters.page, filters.limit, filters.sortBy, filters.sortOrder])

  const createRoom = async (data: CreateRoomData): Promise<Room> => {
    try {
      console.log('🏗️ Creating room:', data)
      const newRoom = await apiClient.post<Room>('/rooms', data)
      console.log('✅ Room created:', newRoom)
      await fetchRooms() // Refresh list
      return newRoom
    } catch (err: any) {
      console.error('❌ Error creating room:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create room'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateRoom = async (id: number, data: UpdateRoomData): Promise<Room> => {
    try {
      console.log('🔄 Updating room:', id, data)
      const updatedRoom = await apiClient.patch<Room>(`/rooms/${id}`, data)
      console.log('✅ Room updated:', updatedRoom)
      await fetchRooms() // Refresh list
      return updatedRoom
    } catch (err: any) {
      console.error('❌ Error updating room:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update room'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteRoom = async (id: number): Promise<void> => {
    try {
      console.log('🗑️ Deleting room:', id)
      
      const response = await apiClient.delete(`/rooms/${id}`)
      console.log('✅ Delete API response:', response)
      
      console.log('🔄 Refreshing rooms list...')
      await fetchRooms() // Refresh list
      
      console.log('✅ Room deleted and list refreshed')
    } catch (err: any) {
      console.error('❌ Delete error:', err)
      console.error('❌ Error response:', err.response)
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete room'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getRoomById = async (id: number): Promise<Room> => {
    try {
      console.log('🔍 Fetching room by ID:', id)
      const room = await apiClient.get<Room>(`/rooms/${id}`)
      console.log('✅ Room fetched:', room)
      return room
    } catch (err: any) {
      console.error('❌ Error fetching room:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch room'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    // Fetch rooms when filters change or on mount
    fetchRooms()
  }, [fetchRooms])

  return {
    rooms,
    loading,
    error,
    totalPages,
    currentPage,
    refetch: fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomById
  }
}

// Helper hook to get single room
export const useRoom = (id: number) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoom = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiClient.get<Room>(`/rooms/${id}`)
      setRoom(data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch room')
      setRoom(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchRoom()
  }, [fetchRoom])

  return {
    room,
    loading,
    error,
    refetch: fetchRoom
  }
}

// Hook for room availability
export const useRoomAvailability = (roomId: number) => {
  const [availability, setAvailability] = useState<RoomAvailability | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAvailability = async (date?: string) => {
    if (!roomId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('📅 Checking room availability:', roomId, date)
  const data = await apiClient.getRoomAvailability(roomId, date)
      console.log('✅ Availability data:', data)
  setAvailability(data as RoomAvailability)
    } catch (err: any) {
      console.error('❌ Error checking availability:', err)
      setError(err.response?.data?.message || err.message || 'Failed to check availability')
      setAvailability(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    availability,
    loading,
    error,
    checkAvailability
  }
}