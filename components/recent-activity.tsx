import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  { id: 1, action: "New student enrolled", details: "Ahmed Hassan in Python Course", time: "2 hours ago" },
  { id: 2, action: "Course completed", details: "Web Development - 15 students", time: "4 hours ago" },
  { id: 3, action: "Payment received", details: "$500 from Fatima Ali", time: "1 day ago" },
  { id: 4, action: "New teacher added", details: "Dr. Mohammed Ibrahim", time: "2 days ago" },
  { id: 5, action: "Schedule updated", details: "Morning batch - Python Course", time: "3 days ago" },
]

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
