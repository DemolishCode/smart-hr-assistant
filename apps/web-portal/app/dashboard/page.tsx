"use client"

export const dynamic = 'force-dynamic'

import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, FileUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/login") 
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{t.dashboard.loadingUser}</h1>
             <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">{t.dashboard.backToLogin}</Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.hello}, {user.full_name}</h1>
            <p className="text-muted-foreground mt-1">{t.dashboard.welcomeMessage}</p>
        </div>
      </div>
      
      {/* User Info Card */}
      <Card>
        <CardHeader>
            <CardTitle>{t.dashboard.yourInfo}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">{t.dashboard.email}</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">{t.dashboard.role}</p>
                    <p className="font-medium">{t.roles[user.role as keyof typeof t.roles] || user.role}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">{t.dashboard.department}</p>
                    <p className="font-medium">{user.department || '-'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">{t.dashboard.position}</p>
                    <p className="font-medium">{user.position || '-'}</p>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard 
            href="/dashboard/employees"
            icon={Users}
            title={t.dashboard.quickActions.manageEmployees.title}
            description={t.dashboard.quickActions.manageEmployees.description}
        />
        <QuickActionCard 
            href="/chat"
            icon={MessageSquare}
            title={t.dashboard.quickActions.chatAI.title}
            description={t.dashboard.quickActions.chatAI.description}
        />
        <QuickActionCard 
            href="/dashboard/resumes"
            icon={FileUp}
            title={t.dashboard.quickActions.analyzeResume.title}
            description={t.dashboard.quickActions.analyzeResume.description}
        />
      </div>
    </div>
  )
}

function QuickActionCard({ href, icon: Icon, title, description }: { href: string, icon: any, title: string, description: string }) {
    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
