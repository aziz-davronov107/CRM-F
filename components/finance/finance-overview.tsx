"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

export function FinanceOverview() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$125,450",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Total Expenses",
      value: "$45,230",
      change: "+5.2%",
      trend: "up",
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      label: "Net Profit",
      value: "$80,220",
      change: "+18.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      label: "Pending Payments",
      value: "$12,500",
      change: "-8.1%",
      trend: "down",
      icon: PieChart,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
