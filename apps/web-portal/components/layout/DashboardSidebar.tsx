"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileUp, 
  LogOut,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "แดชบอร์ด", href: "/dashboard" },
  { icon: Users, label: "พนักงาน", href: "/dashboard/employees" },
  { icon: MessageSquare, label: "แชท AI", href: "/chat" },
  { icon: FileUp, label: "อัปโหลด Resume", href: "/dashboard/resumes" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 p-4 text-sidebar-foreground">
      <div className="mb-8 px-2 flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            H
        </div>
        <h1 className="text-xl font-bold tracking-tight">
           Smart HR
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-sidebar-border mt-auto">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent gap-3"
            onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  )
}

export function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-sidebar-border bg-sidebar w-64 text-sidebar-foreground">
                <DashboardSidebar />
            </SheetContent>
        </Sheet>
    )
}
