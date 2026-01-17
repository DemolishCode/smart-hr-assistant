"use client"

export const dynamic = 'force-dynamic'

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
import { useLanguage } from "@/contexts/LanguageContext"

interface User {
  id: string
  full_name: string
  email: string
  role: string
  department: string | null
  position: string | null
  is_active: boolean
}

export default function EmployeesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

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
            <h1 className="text-3xl font-bold tracking-tight">{t.employees.title}</h1>
            <p className="text-muted-foreground mt-1">{t.employees.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
            </div>
            <div>
                <CardTitle>{t.employees.allEmployees}</CardTitle>
                <CardDescription>{t.employees.total} {users.length} {t.employees.people}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">{t.employees.loading}</div>
            ) : (
                <div className="rounded-md border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                    <TableHead className="w-12">{t.employees.table.no}</TableHead>
                    <TableHead>{t.employees.table.fullName}</TableHead>
                    <TableHead>{t.employees.table.email}</TableHead>
                    <TableHead>{t.employees.table.department}</TableHead>
                    <TableHead>{t.employees.table.role}</TableHead>
                    <TableHead>{t.employees.table.status}</TableHead>
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
                                {t.roles[user.role as keyof typeof t.roles] || user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.is_active ? "outline" : "secondary"} className={user.is_active ? "text-green-600 border-green-600" : ""}>
                                {user.is_active ? t.employees.status.active : t.employees.status.inactive}
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
