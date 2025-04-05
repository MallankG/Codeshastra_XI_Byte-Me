"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function AiTripAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Trip Advisor. How can I help you plan your perfect trip today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I'd recommend visiting Bali for a tropical getaway. It offers beautiful beaches, cultural experiences, and affordable accommodations.",
        "Paris is wonderful in the spring! The weather is mild and the crowds are smaller than in summer.",
        "For a family vacation, consider theme parks in Orlando or a beach resort with kids' activities.",
        "If you're looking for adventure travel, New Zealand offers hiking, bungee jumping, and beautiful landscapes.",
        "Based on your interests, I think you'd enjoy a food tour in Italy or Japan.",
        "For budget travel, Southeast Asia offers great value with affordable accommodations and delicious street food.",
        "The best time to visit Japan is during cherry blossom season (late March to early April) or autumn (October to November).",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden">
      <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
        <h3 className="text-lg font-medium flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Trip Advisor
        </h3>
        <p className="text-sm opacity-90">Get personalized travel recommendations</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar
                  className={message.sender === "user" ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-600"}
                >
                  {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-rose-600 dark:bg-rose-700 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about destinations, travel tips, or recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

