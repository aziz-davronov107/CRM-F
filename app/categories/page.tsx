import { CategoriesHeader } from "@/components/categories/categories-header"
import { CategoriesList } from "@/components/categories/categories-list"

export default function CategoriesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <CategoriesHeader />
      <main className="flex-1 overflow-auto p-6">
        <CategoriesList />
      </main>
    </div>
  )
}
