"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  pageCount?: number
  onPaginationChange?: (state: PaginationState) => void
  onSortingChange?: (state: SortingState) => void
  onColumnFiltersChange?: (state: ColumnFiltersState) => void
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  pageCount,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pageCount,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onColumnFiltersChange,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater(pagination) : updater
      setPagination(newState)
      onPaginationChange?.(newState)
    },
    onSortingChange: (updater) => {
      const newState = typeof updater === "function" ? updater(sorting) : updater
      setSorting(newState)
      onSortingChange?.(newState)
    },
    onColumnFiltersChange: (updater) => {
      const newState = typeof updater === "function" ? updater(columnFilters) : updater
      setColumnFilters(newState)
      onColumnFiltersChange?.(newState)
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-light border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-foreground-muted">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-foreground-muted">
                  No results found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-surface-light transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground-muted">
          Page {pagination.pageIndex + 1} of {pageCount || 1}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
