import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  content: string
  role: "user" | "assistant"
  className?: string
}

export function MessageBubble({ content, role, className }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        role === "user"
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted",
        className
      )}
    >
      {content}
    </div>
  )
} 