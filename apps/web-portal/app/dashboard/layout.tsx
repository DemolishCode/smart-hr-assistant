"use client"

import { DashboardSidebar, MobileSidebar } from "@/components/layout/DashboardSidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

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
    <div className="flex h-screen bg-muted/40 transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block h-full">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
             <MobileSidebar />
             
             {/* Flexible Spacer */}
             <div className="flex-1"></div>
             
             {/* Right Side Actions */}
             <div className="flex items-center gap-4">
                <div className="text-sm text-right hidden sm:block">
                    <p className="font-medium leading-none">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="h-8 w-[1px] bg-border hidden sm:block"></div>
                <LanguageSwitcher />
                <ModeToggle />
             </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
             <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
             </div>
        </main>
      </div>
    </div>
  )
}
