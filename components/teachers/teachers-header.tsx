"use client";

import { useState } from "react";
import { Search, Plus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useBranches } from "@/hooks/use-branches";
import type { TeacherFilters } from "@/lib/types";

interface TeachersHeaderProps {
  onFiltersChange: (filters: TeacherFilters) => void;
  onCreateClick: () => void;
  activeFilters?: TeacherFilters;
}

export function TeachersHeader({ onFiltersChange, onCreateClick, activeFilters }: TeachersHeaderProps) {
  const { branches } = useBranches();
  const [searchTerm, setSearchTerm] = useState(activeFilters?.fullname || "");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...(activeFilters || {}), fullname: value || undefined });
  };

  const handleFilterChange = (key: keyof TeacherFilters, value: any) => {
    onFiltersChange({ ...(activeFilters || {}), [key]: value || undefined });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    const af = activeFilters || {} as TeacherFilters;
    return Object.values(af).filter(value => 
      value !== undefined && value !== null && value !== ""
    ).length;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-foreground-muted">
            Manage your teaching staff and instructors
          </p>
        </div>
        <Button onClick={onCreateClick} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
          <Input
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Teachers</h4>
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={activeFilters?.status || ""} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Branch</label>
                    <Select value={activeFilters?.branch_id?.toString() || ""} onValueChange={(value) => handleFilterChange("branch_id", value ? parseInt(value) : undefined)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All branches</SelectItem>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
