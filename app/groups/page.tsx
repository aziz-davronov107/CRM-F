"use client"

import { useState } from "react"
import { GroupsHeader } from "@/components/groups/groups-header"
import { GroupsList } from "@/components/groups/groups-list"
import { useGroups } from "@/hooks/use-groups"
import { GroupFilters } from "@/lib/types"

export default function GroupsPage() {
  const [filters, setFilters] = useState<GroupFilters>({})
  const { groups, loading } = useGroups(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="text-gray-600 mt-1">Manage your groups</p>
      </div>
      
      <GroupsHeader 
        filters={filters} 
        onFiltersChange={setFilters} 
        totalGroups={groups.length} 
      />
      <GroupsList groups={groups} loading={loading} />
    </div>
  )
}
