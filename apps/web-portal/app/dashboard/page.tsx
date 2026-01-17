"use client"

import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Simple protection check (better to wrap in layout/HOC)
    if (!isAuthenticated) {
     // router.push("/login") 
     // Commented out to allow Hydration to finish first, or handled by middleware later
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Loading User...</h1>
             <Button onClick={() => router.push("/login")} variant="outline" className="mt-4">Back to Login</Button>
        </div>
    )
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>
      
      <div className="p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user.full_name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Position:</strong> {user.position}</p>
        </div>
      </div>
    </div>
  )
}
