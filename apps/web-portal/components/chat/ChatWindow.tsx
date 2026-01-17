"use client"

import { useState, useRef, useEffect } from "react"
import { SendHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { MessageBubble } from "./MessageBubble"
import { apiClient } from "@/lib/api-client"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Auto-scroll to bottom
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
        // Simple auto scroll
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isLoading) return

    const userMsg: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const response = await apiClient.post("/chat", { message: userMsg.content })
      const aiMsg: Message = { role: "assistant", content: response.data.response }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMsg: Message = { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto shadow-xl">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="text-lg font-semibold">Smart HR Assistant</h2>
        <p className="text-sm text-muted-foreground">Ask me about company policies or candidates.</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <p>No messages yet. Start conversation!</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex gap-2 p-4 text-sm text-muted-foreground animate-pulse">
              AI is thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input 
          placeholder="Type your message..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading} size="icon">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
