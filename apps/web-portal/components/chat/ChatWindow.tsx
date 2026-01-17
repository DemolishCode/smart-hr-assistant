"use client"

import { useState, useRef, useEffect } from "react"
import { SendHorizontal, Bot, User } from "lucide-react"

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
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
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
      const errorMsg: Message = { role: "assistant", content: "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] w-full max-w-4xl mx-auto shadow-xl border-border/50 overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Bot className="h-5 w-5" />
            </div>
            <div>
                <h2 className="text-lg font-semibold">HR Assistant AI</h2>
                <p className="text-sm text-muted-foreground">ถามคำถามเกี่ยวกับนโยบายหรือข้อมูลทั่วไปได้เลย</p>
            </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center">
              <Bot className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">ยังไม่มีข้อความ</p>
              <p className="text-sm">เริ่มต้นสนทนาโดยพิมพ์คำถามด้านล่าง</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground animate-pulse">
              <Bot className="h-4 w-4" />
              AI กำลังคิดคำตอบ...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/80 backdrop-blur-sm flex gap-2">
        <Input 
          placeholder="พิมพ์ข้อความของคุณ..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
          className="h-11"
        />
        <Button onClick={handleSend} disabled={isLoading} size="icon" className="h-11 w-11 shrink-0">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}
