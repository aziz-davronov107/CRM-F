"use client"

import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth check AppLayout da qilinadi
  return <>{children}</>
}
