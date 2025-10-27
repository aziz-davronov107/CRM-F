"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Users, BookOpen, Calendar, DollarSign, BarChart3, Home, CalendarDays, Tags, UserPlus } from "lucide-react"

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/branches", label: "Branches", icon: Building2 },
  { href: "/rooms", label: "Rooms", icon: Users },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/groups", label: "Groups", icon: Calendar },
  { href: "/students", label: "Students", icon: Users },
  { href: "/student-groups", label: "Student Groups", icon: UserPlus },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <h1 className="text-xl font-bold text-white">Training Center</h1>
        <p className="text-blue-100 text-sm mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600",
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors flex-shrink-0",
                isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
              )} />
              <span className="font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Training Center
        </p>
      </div>
    </aside>
  )
}
