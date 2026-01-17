"use client"

import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, FileUp, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

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
            <h1 className="text-2xl font-bold">กำลังโหลดข้อมูล...</h1>
             <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">กลับหน้าเข้าสู่ระบบ</Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">สวัสดี, {user.full_name}</h1>
            <p className="text-muted-foreground mt-1">ยินดีต้อนรับสู่ระบบ Smart HR Assistant</p>
        </div>
      </div>
      
      {/* User Info Card */}
      <Card>
        <CardHeader>
            <CardTitle>ข้อมูลของคุณ</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">อีเมล</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">บทบาท</p>
                    <p className="font-medium">{user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : user.role === 'HR' ? 'ทรัพยากรบุคคล' : user.role === 'MANAGER' ? 'ผู้จัดการ' : 'พนักงาน'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">แผนก</p>
                    <p className="font-medium">{user.department || '-'}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">ตำแหน่ง</p>
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
            title="จัดการพนักงาน"
            description="ดูรายชื่อและข้อมูลพนักงานทั้งหมด"
        />
        <QuickActionCard 
            href="/chat"
            icon={MessageSquare}
            title="แชทกับ AI"
            description="ถามข้อมูลนโยบายและคำถามทั่วไป"
        />
        <QuickActionCard 
            href="/dashboard/resumes"
            icon={FileUp}
            title="วิเคราะห์ Resume"
            description="อัปโหลดและดึงข้อมูลจาก Resume"
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
