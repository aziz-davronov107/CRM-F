import { FinanceHeader } from "@/components/finance/finance-header"
import { FinanceOverview } from "@/components/finance/finance-overview"
import { TransactionsList } from "@/components/finance/transactions-list"

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-gray-600 mt-1">Manage your finances and transactions</p>
      </div>
      <FinanceOverview />
      <TransactionsList />
    </div>
  )
}
