"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut, User, Menu } from "lucide-react"

interface NavbarProps {
  onMobileMenuToggle?: () => void
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button - faqat mobile uchun */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="lg:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="text-gray-600 text-sm">
          Salom, <span className="font-semibold text-gray-900">{user?.name || 'Admin'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
          <User className="w-4 h-4 mr-2" />
          Profil
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Chiqish
        </Button>
      </div>
    </nav>
  )
}
