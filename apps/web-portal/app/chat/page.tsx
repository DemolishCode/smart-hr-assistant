"use client"

import ChatWindow from "@/components/chat/ChatWindow"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChatPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
      
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  )
}
