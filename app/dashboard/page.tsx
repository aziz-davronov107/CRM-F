"use client"

import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import { Users, DollarSign, Calendar, BookOpen, TrendingUp, Plus, UserPlus, GraduationCap, CreditCard } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: "Total Students", value: "1,234", icon: Users, color: "bg-blue-500", change: "+12%" },
    { label: "Active Courses", value: "24", icon: BookOpen, color: "bg-green-500", change: "+5" },
    { label: "Branches", value: "5", icon: Calendar, color: "bg-purple-500", change: "No change" },
    { label: "Revenue", value: "$45,231", icon: DollarSign, color: "bg-orange-500", change: "+8%" },
  ]

  const recentActivities = [
    { 
      title: "New student enrolled", 
      description: "Ahmed Hassan in Python Course", 
      time: "2 hours ago",
      type: "student"
    },
    { 
      title: "Course completed", 
      description: "Web Development - 15 students", 
      time: "4 hours ago",
      type: "course"
    },
    { 
      title: "Payment received", 
      description: "$500 from Fatima Ali", 
      time: "1 day ago",
      type: "payment"
    },
    { 
      title: "New teacher added", 
      description: "John Smith - JavaScript Instructor", 
      time: "2 days ago",
      type: "teacher"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to Training Center Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">Add Student</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Create Course</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 font-medium">Add Teacher</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700 font-medium">Record Payment</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
