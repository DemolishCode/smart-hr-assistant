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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <h1 className="text-3xl font-bold">Employees</h1>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>All Staff</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading employees...</div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>No.</TableHead> {/* Added No. column */}
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                    <TableRow key={user.id}>
                         <TableCell>{index + 1}</TableCell> {/* Added No. display */}
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department || "-"}</TableCell>
                        <TableCell>
                            <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
                                {user.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={user.is_active ? "outline" : "secondary"} className={user.is_active ? "text-green-600 border-green-600" : ""}>
                                {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
