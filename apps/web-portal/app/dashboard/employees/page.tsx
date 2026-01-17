"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"

interface User {
  id: string
  full_name: string
  email: string
  role: string
  department: string | null
  position: string | null
  is_active: boolean
}

const roleMap: { [key: string]: string } = {
  "ADMIN": "ผู้ดูแลระบบ",
  "HR": "ทรัพยากรบุคคล",
  "MANAGER": "ผู้จัดการ",
  "EMPLOYEE": "พนักงาน",
}

export default function EmployeesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await apiClient.get<User[]>("/users/")
        setUsers(response.data)
      } catch (error) {
        console.error("Failed to fetch users", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">รายชื่อพนักงาน</h1>
            <p className="text-muted-foreground mt-1">ดูและจัดการข้อมูลพนักงานทั้งหมดในระบบ</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
            </div>
            <div>
                <CardTitle>พนักงานทั้งหมด</CardTitle>
                <CardDescription>รวม {users.length} คน</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">กำลังโหลดข้อมูล...</div>
            ) : (
                <div className="rounded-md border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead className="w-12">ลำดับ</TableHead>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>แผนก</TableHead>
                    <TableHead>บทบาท</TableHead>
                    <TableHead>สถานะ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                    <TableRow key={user.id}>
                         <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{user.department || "-"}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                                {roleMap[user.role] || user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.is_active ? "outline" : "secondary"} className={user.is_active ? "text-green-600 border-green-600" : ""}>
                                {user.is_active ? "ใช้งาน" : "ปิดใช้งาน"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
