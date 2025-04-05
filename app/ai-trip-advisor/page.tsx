"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AiTripAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Trip Advisor. How can I help you plan your perfect trip today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
    setIsTyping(true)

    // Simulate AI response after a short delay
    setTimeout(() => {
      const botResponses: { [key: string]: string[] } = {
        default: [
          "I'd recommend visiting Bali for a tropical getaway. It offers beautiful beaches, cultural experiences, and affordable accommodations.",
          "Paris is wonderful in the spring! The weather is mild and the crowds are smaller than in summer.",
          "For a family vacation, consider theme parks in Orlando or a beach resort with kids' activities.",
          "If you're looking for adventure travel, New Zealand offers hiking, bungee jumping, and beautiful landscapes.",
          "Based on your interests, I think you'd enjoy a food tour in Italy or Japan.",
          "For budget travel, Southeast Asia offers great value with affordable accommodations and delicious street food.",
          "The best time to visit Japan is during cherry blossom season (late March to early April) or autumn (October to November).",
        ],
        beach: [
          "For beautiful beaches, I'd recommend the Maldives, Bora Bora, or the Amalfi Coast in Italy.",
          "Thailand has some stunning beaches - Phuket, Koh Samui, and Krabi are all excellent choices with crystal clear waters.",
          "If you're looking for beaches with vibrant nightlife, consider Ibiza in Spain or Cancun in Mexico.",
        ],
        mountain: [
          "The Swiss Alps offer breathtaking mountain views and excellent hiking trails in summer and skiing in winter.",
          "For mountain adventures, consider Nepal for trekking, Colorado for skiing, or Patagonia for dramatic landscapes.",
          "The Canadian Rockies, particularly Banff and Jasper National Parks, offer stunning mountain scenery and outdoor activities year-round.",
        ],
        budget: [
          "For budget travel, consider Southeast Asia (Thailand, Vietnam, Indonesia), Eastern Europe (Hungary, Poland), or South America (Colombia, Peru).",
          "To save money on accommodations, look into hostels, guesthouses, or vacation rentals instead of hotels.",
          "Traveling during shoulder season (just before or after peak season) can save you money while still offering good weather and fewer crowds.",
        ],
      }

      // Determine which response set to use based on keywords in the user's message
      let responseSet = botResponses.default
      const lowerCaseInput = input.toLowerCase()

      if (lowerCaseInput.includes("beach") || lowerCaseInput.includes("ocean") || lowerCaseInput.includes("sea")) {
        responseSet = botResponses.beach
      } else if (
        lowerCaseInput.includes("mountain") ||
        lowerCaseInput.includes("hiking") ||
        lowerCaseInput.includes("trek")
      ) {
        responseSet = botResponses.mountain
      } else if (
        lowerCaseInput.includes("budget") ||
        lowerCaseInput.includes("cheap") ||
        lowerCaseInput.includes("affordable")
      ) {
        responseSet = botResponses.budget
      }

      const randomResponse = responseSet[Math.floor(Math.random() * responseSet.length)]

      setIsTyping(false)
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link
            href="/"
            className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">AI Trip Advisor</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="bg-white dark:bg-gray-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
            <h2 className="text-lg font-medium flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              AI Trip Advisor
            </h2>
            <p className="text-sm opacity-90">Get personalized travel recommendations and plan your perfect trip</p>
          </div>

          <ScrollArea className="h-[calc(100vh-250px)] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar
                      className={
                        message.sender === "user"
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }
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
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                    <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                placeholder="Ask about destinations, travel tips, or recommendations..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 self-end h-[60px] px-4"
                disabled={isTyping || input.trim() === ""}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send, Shift+Enter for a new line
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

