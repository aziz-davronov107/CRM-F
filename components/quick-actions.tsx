import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BookOpen, DollarSign } from "lucide-react"

const actions = [
  { icon: Plus, label: "Add Student", href: "#" },
  { icon: BookOpen, label: "Create Course", href: "#" },
  { icon: Users, label: "Add Teacher", href: "#" },
  { icon: DollarSign, label: "Record Payment", href: "#" },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-2 text-foreground border-border hover:bg-muted bg-transparent"
                asChild
              >
                <a href={action.href}>
                  <Icon className="w-4 h-4" />
                  {action.label}
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
