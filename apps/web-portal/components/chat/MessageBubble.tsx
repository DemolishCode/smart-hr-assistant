import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full gap-4 p-4", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar>
        <AvatarFallback>{isUser ? "ME" : "AI"}</AvatarFallback>
        {!isUser && <AvatarImage src="/bot-avatar.png" alt="AI" />}
      </Avatar>
      
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-4 text-sm",
          isUser 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
