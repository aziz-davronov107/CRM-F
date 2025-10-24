import { BranchesHeader } from "@/components/branches/branches-header"
import { BranchesList } from "@/components/branches/branches-list"

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
        <p className="text-gray-600 mt-1">Manage your training center branches</p>
      </div>
      <BranchesList />
    </div>
  )
}
