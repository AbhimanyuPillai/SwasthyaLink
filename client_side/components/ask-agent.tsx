"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Namaste! I am Swasthya Mitra, your digital health assistant. You can describe your symptoms or ask any health-related questions. How may I assist you today?",
    timestamp: new Date(),
  },
]

export function AskAgent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const symptoms = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: symptoms,
      timestamp: new Date(),
    }

    // FIXED: Explicitly typed 'prev' as Message[]
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, 
          symptoms,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()

      let displayText = ""
      if (typeof data === "object") {
        displayText = `Probable Ailment: ${data.probable_ailment}\nCare Points: ${data.care_points}\nRecommended Specialist: ${data.recommended_specialist}`
      } else {
        displayText = JSON.stringify(data, null, 2)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: displayText,
        timestamp: new Date(),
      }

      // FIXED: Explicitly typed 'prev' as Message[]
      setMessages((prev: Message[]) => [...prev, assistantMessage])
    } catch (error) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't connect to the SwasthyaLink server. Please try again.",
        timestamp: new Date(),
      }
      // FIXED: Explicitly typed 'prev' as Message[]
      setMessages((prev: Message[]) => [...prev, assistantMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // FIXED: Explicitly typed the keyboard event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-primary text-primary-foreground">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Swasthya Mitra</h3>
          <p className="text-[10px] text-primary-foreground/80">AI Health Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-muted/30">
        {/* FIXED: Explicitly typed 'message' as Message */}
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                message.role === "user" ? "bg-accent" : "bg-primary"
              )}
            >
              {message.role === "user" ? (
                <User className="h-3 w-3 text-accent-foreground" />
              ) : (
                <Bot className="h-3 w-3 text-primary-foreground" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2",
                message.role === "user"
                  ? "bg-accent text-accent-foreground rounded-tr-sm"
                  : "bg-card text-foreground border border-border rounded-tl-sm shadow-sm"
              )}
            >
              <p className="text-xs whitespace-pre-line leading-relaxed">{message.content}</p>
              <p
                className={cn(
                  "text-[10px] mt-1.5",
                  message.role === "user" ? "text-accent-foreground/70" : "text-muted-foreground"
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-3 w-3 text-primary-foreground" />
            </div>
            <div className="bg-card border border-border rounded-xl rounded-tl-sm px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 py-2 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              /* FIXED: Explicitly typed the onChange event */
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms..."
              rows={1}
              className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary transition-all"
              style={{ minHeight: "36px", maxHeight: "80px" }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Not a substitute for professional medical advice
        </p>
      </div>
    </div>
  )
}