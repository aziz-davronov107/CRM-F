"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit2, Trash2, Users, Building2, AlertCircle } from "lucide-react"
import React, { useState } from "react"
import { EditRoomDialog } from "./edit-room-dialog"
import { useRooms } from "@/hooks/use-rooms"
import { Room, RoomFilters } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface RoomsListProps {
  filters?: RoomFilters
}

export function RoomsList({ filters = {} }: RoomsListProps) {
  const { rooms, loading, error, deleteRoom } = useRooms({
    ...filters,
    limit: 50
  })
  
  console.log('🔍 RoomsList render:', { 
    rooms: rooms,
    roomsCount: rooms.length,
    loading: loading, 
    error: error,
    filters
  })
  
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setEditDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    const room = rooms.find(r => r.id === id)
    const roomName = room?.name || `Room #${id}`
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${roomName}"? This action cannot be undone.`
    )
    
    if (!confirmed) {
      console.log('🚫 Delete cancelled by user')
      return
    }

    try {
      console.log('🗑️ Starting delete for room:', id)
      setDeletingId(id)
      
      await deleteRoom(id)
      
      console.log('✅ Room deleted successfully:', id)
      toast({
        title: "Success",
        description: `"${roomName}" deleted successfully`,
      })
    } catch (error: any) {
      console.error('❌ Delete error:', error)
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete room"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveSuccess = async () => {
    console.log('🔄 handleSaveSuccess: Refreshing rooms data...')
    // Don't close modal here - let the dialog component handle it
    setEditingRoom(null)
    
    // Force refresh the data
    // The useRooms hook will automatically refresh after create/update
    console.log('✅ handleSaveSuccess: Data refresh completed')
  }

  if (loading && rooms.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (rooms.length === 0 && !loading) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-2">No rooms found</p>
        <p className="text-sm text-muted-foreground">
          {filters.branch_id || filters.capacity_min || filters.capacity_max
            ? "Try adjusting your filters or create a new room."
            : "Create your first room to get started."
          }
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  {room.branch && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span>{room.branch.name} - {room.branch.region}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-medium text-foreground">{room.capacity}</span> capacity
                  </div>
                </div>

                {/* Statistics */}
                {room.groups && room.groups.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Users className="w-4 h-4" />
                    <span className="font-medium text-foreground">{room.groups.length}</span> active groups
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                  {room.updatedAt !== room.createdAt && (
                    <span className="ml-3">
                      Updated: {new Date(room.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(room)} 
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(room.id)}
                  disabled={deletingId === room.id}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === room.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {editingRoom && (
        <EditRoomDialog
          room={editingRoom}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  )
}
