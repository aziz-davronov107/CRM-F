"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Login va register sahifalarida sidebar ko'rsatmay
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname === '/'
  
  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6 pt-20 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}