"use client";

import { useState } from "react";
import { Edit2, Trash2, Mail, Phone, Calendar, Coins, Users } from "lucide-react";

import { useTeachers } from "@/hooks/use-teachers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Teacher, TeacherFilters } from "@/lib/types";

interface TeachersListProps {
  filters?: TeacherFilters;
  onEditClick: (teacher: Teacher) => void;
}

export function TeachersList({ filters, onEditClick }: TeachersListProps) {
  const safeFilters = filters || ({} as TeacherFilters);
  const { teachers, loading, deleteTeacher } = useTeachers(safeFilters);
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (teacher: Teacher) => {
    if (deletingId) return;
    
    setDeletingId(teacher.id);
    try {
      await deleteTeacher(teacher.id);
      toast({
        title: "Success",
        description: `Teacher ${teacher.fullname} deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete teacher",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const calculateAge = (birthday: string): number => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatPhone = (phone: string): string => {
    if (phone.startsWith("+998")) {
      return phone.replace(/(\+998)(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-foreground-muted text-lg mb-2">No teachers found</div>
        <p className="text-sm text-foreground-muted">
          {Object.keys(safeFilters).length > 0 
            ? "Try adjusting your filters to see more results" 
            : "Start by adding your first teacher"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{teacher.fullname}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={teacher.status === "ACTIVE" ? "default" : "secondary"}>
                      {teacher.status}
                    </Badge>
                    <Badge variant="outline">
                      {teacher.gender}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground-muted">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-foreground-muted">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhone(teacher.phone)}</span>
                </div>

                {teacher.birthday && (
                  <div className="flex items-center gap-2 text-foreground-muted">
                    <Calendar className="w-4 h-4" />
                    <span>{calculateAge(teacher.birthday)} years old</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-foreground-muted">
                  <Coins className="w-4 h-4" />
                  <span>{teacher.coin || 0} coins</span>
                </div>

                <div className="flex items-center gap-2 text-foreground-muted">
                  <Users className="w-4 h-4" />
                  <span>{teacher.groups?.length || 0} groups</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditClick(teacher)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {teacher.fullname}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(teacher)}
                        disabled={deletingId === teacher.id}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deletingId === teacher.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}