"use client"

import { DashboardSidebar, MobileSidebar } from "@/components/layout/DashboardSidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isMounted || !isAuthenticated) return null

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b p-4 md:hidden flex items-center justify-between">
             <span className="font-bold">Smart HR</span>
            <MobileSidebar />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
             {children}
            </div>
        </main>
      </div>
    </div>
  )
}
