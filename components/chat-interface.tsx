"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Mic, MicOff } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatInterfaceProps {
  destination?: string
}

export default function ChatInterface({ destination }: ChatInterfaceProps) {
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
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update welcome message if destination changes
  useEffect(() => {
    if (destination) {
      const welcomeMessage: Message = {
        id: messages.length + 1,
        text: `Great! I see you're planning a trip to ${destination}. How can I help you with your ${destination} itinerary?`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, welcomeMessage])
    }
  }, [destination])

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
          "I'd recommend visiting the local markets and trying the street food for an authentic experience.",
          "The best time to visit would be during the shoulder season when there are fewer tourists.",
          "For transportation, I suggest using public transit as it's efficient and will save you money.",
          "Don't forget to check if you need any special vaccinations or travel documents before your trip.",
          "I recommend booking accommodations in advance, especially if you're traveling during peak season.",
        ],
        weather: [
          "The weather should be pleasant during your visit. Pack light clothing but bring a jacket for evenings.",
          "It might be rainy season during your visit. I recommend bringing waterproof clothing and an umbrella.",
          "Expect hot and humid conditions. Light, breathable clothing is recommended, and don't forget sunscreen!",
          "The weather can be unpredictable, so I suggest packing layers that you can add or remove as needed.",
        ],
        food: [
          "You must try the local specialty dishes! I recommend visiting the night markets for the best street food.",
          "There are several Michelin-starred restaurants in the area if you're looking for a fine dining experience.",
          "For authentic local cuisine, try to eat where the locals eat - usually away from the main tourist areas.",
          "Food tours are a great way to sample a variety of local dishes while learning about the culture.",
        ],
      }

      // Determine which response set to use based on keywords in the user's message
      let responseSet = botResponses.default
      const lowerCaseInput = input.toLowerCase()

      if (
        lowerCaseInput.includes("weather") ||
        lowerCaseInput.includes("temperature") ||
        lowerCaseInput.includes("climate")
      ) {
        responseSet = botResponses.weather
      } else if (
        lowerCaseInput.includes("food") ||
        lowerCaseInput.includes("eat") ||
        lowerCaseInput.includes("restaurant") ||
        lowerCaseInput.includes("cuisine")
      ) {
        responseSet = botResponses.food
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

  const toggleListening = () => {
    // Check if browser supports speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      setIsListening(!isListening)

      if (!isListening) {
        // This is a simplified version - in a real app, you'd implement the full speech recognition
        alert("Speech recognition would start here. This is a simplified demo.")

        // Simulate receiving speech after 3 seconds
        setTimeout(() => {
          setInput((prev) => prev + " How's the weather there?")
          setIsListening(false)
        }, 3000)
      }
    } else {
      alert("Speech recognition is not supported in your browser.")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
        <h3 className="text-lg font-medium flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Trip Advisor Chat
        </h3>
        <p className="text-sm opacity-90">Ask questions about your trip</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={`${message.timestamp.getTime()}-${message.sender}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
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
                    {message.sender === "user" ? <User className="h-5 w-5 m-auto" /> : <Bot className="h-5 w-5 m-auto" />}
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
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <div className="flex space-x-1">
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={toggleListening}
            variant="outline"
            className={isListening ? "bg-rose-100 text-rose-600 border-rose-300" : ""}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
            disabled={isTyping || input.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isListening ? "Listening... speak now" : "Press the microphone button to use voice input"}
        </div>
      </div>
    </div>
  )
}

