"use client"

import { useState } from "react"
import { RoomsHeader } from "@/components/rooms/rooms-header"
import { RoomsList } from "@/components/rooms/rooms-list"
import { useRooms } from "@/hooks/use-rooms"
import { RoomFilters } from "@/lib/types"

export default function RoomsPage() {
  const [filters, setFilters] = useState<RoomFilters>({})
  const [searchQuery, setSearchQuery] = useState("")
  
  // Get rooms data for total count
  const { rooms } = useRooms(filters)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // For now, we'll handle search in the backend later
    // Could implement client-side filtering here if needed
  }

  const handleFilterChange = (newFilters: RoomFilters) => {
    setFilters(newFilters)
  }

  // Filter rooms by search query (client-side for now)
  const filteredRooms = rooms.filter(room => 
    searchQuery === "" || 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.branch?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <RoomsHeader 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        totalRooms={filteredRooms.length}
      />
      
      <RoomsList 
        filters={{
          ...filters,
          // Add search to filters if needed in the future
        }}
      />
    </div>
  )
}
