"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  status: "completed" | "pending" | "failed"
  reference: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Course Fee - Web Development",
    amount: 5000,
    type: "income",
    category: "Course Revenue",
    date: "2024-11-20",
    status: "completed",
    reference: "TXN-001",
  },
  {
    id: "2",
    description: "Instructor Salary - November",
    amount: 3500,
    type: "expense",
    category: "Payroll",
    date: "2024-11-20",
    status: "completed",
    reference: "TXN-002",
  },
  {
    id: "3",
    description: "Course Fee - React Advanced",
    amount: 4500,
    type: "income",
    category: "Course Revenue",
    date: "2024-11-19",
    status: "completed",
    reference: "TXN-003",
  },
  {
    id: "4",
    description: "Office Supplies",
    amount: 850,
    type: "expense",
    category: "Operations",
    date: "2024-11-19",
    status: "pending",
    reference: "TXN-004",
  },
  {
    id: "5",
    description: "Course Fee - Business Communication",
    amount: 3200,
    type: "income",
    category: "Course Revenue",
    date: "2024-11-18",
    status: "completed",
    reference: "TXN-005",
  },
  {
    id: "6",
    description: "Utilities & Internet",
    amount: 1200,
    type: "expense",
    category: "Operations",
    date: "2024-11-18",
    status: "completed",
    reference: "TXN-006",
  },
]

export function TransactionsList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reference</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.reference}</td>
                <td className="py-3 px-4 text-sm text-foreground">{transaction.description}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.category}</td>
                <td className="py-3 px-4 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-red-500" />
                    )}
                    <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.date}</td>
                <td className="py-3 px-4 text-sm">
                  <Badge variant={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
