"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserMinus, AlertTriangle } from "lucide-react"
import { useStudentGroups } from "@/hooks/use-student-groups"

interface RemoveStudentDialogProps {
  studentGroupId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RemoveStudentDialog({ 
  studentGroupId, 
  open, 
  onOpenChange, 
  onSuccess 
}: RemoveStudentDialogProps) {
  const [loading, setLoading] = useState(false)
  
  const { removeStudentFromGroup } = useStudentGroups()

  const handleRemove = async () => {
    setLoading(true)
    try {
      await removeStudentFromGroup(studentGroupId)
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error removing student from group:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-destructive" />
            Remove Student from Group
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Are you sure you want to remove this student from the group? This action cannot be undone and will remove all attendance records for this student in this group.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}