import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Building2, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    icon: Users,
    change: "+12%",
    color: "text-blue-500",
  },
  {
    title: "Active Courses",
    value: "24",
    icon: BookOpen,
    change: "+3",
    color: "text-green-500",
  },
  {
    title: "Branches",
    value: "5",
    icon: Building2,
    change: "No change",
    color: "text-purple-500",
  },
  {
    title: "Revenue",
    value: "$45,231",
    icon: TrendingUp,
    change: "+8%",
    color: "text-orange-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
