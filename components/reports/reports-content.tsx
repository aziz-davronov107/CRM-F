"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const enrollmentData = [
  { month: "Jan", students: 45, teachers: 8, courses: 5 },
  { month: "Feb", students: 52, teachers: 8, courses: 6 },
  { month: "Mar", students: 68, teachers: 10, courses: 7 },
  { month: "Apr", students: 75, teachers: 10, courses: 8 },
  { month: "May", students: 89, teachers: 12, courses: 9 },
  { month: "Jun", students: 102, teachers: 12, courses: 10 },
]

const revenueData = [
  { month: "Jan", revenue: 15000, expenses: 8000 },
  { month: "Feb", revenue: 18000, expenses: 8500 },
  { month: "Mar", revenue: 22000, expenses: 9000 },
  { month: "Apr", revenue: 25000, expenses: 9500 },
  { month: "May", revenue: 28000, expenses: 10000 },
  { month: "Jun", revenue: 32000, expenses: 10500 },
]

const courseDistribution = [
  { name: "Web Development", value: 35, color: "#3b82f6" },
  { name: "React Advanced", value: 25, color: "#10b981" },
  { name: "Business Comm", value: 20, color: "#f59e0b" },
  { name: "Data Science", value: 20, color: "#8b5cf6" },
]

const performanceData = [
  { course: "Web Dev", completion: 85, satisfaction: 92 },
  { course: "React", completion: 78, satisfaction: 88 },
  { course: "Business", completion: 90, satisfaction: 95 },
  { course: "Data Science", completion: 72, satisfaction: 85 },
]

export function ReportsContent() {
  return (
    <Tabs defaultValue="enrollment" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="enrollment" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Enrollment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="students" fill="var(--primary)" name="Students" />
              <Bar dataKey="teachers" fill="var(--accent)" name="Teachers" />
              <Bar dataKey="courses" fill="var(--chart-2)" name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="revenue" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" name="Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="var(--destructive)" name="Expenses" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Course Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Course Statistics</h3>
            <div className="space-y-4">
              {courseDistribution.map((course) => (
                <div key={course.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }} />
                    <span className="text-sm text-foreground">{course.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{course.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Course Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="course" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="completion" fill="var(--chart-1)" name="Completion Rate %" />
              <Bar dataKey="satisfaction" fill="var(--chart-2)" name="Satisfaction %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
