"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Mic, MicOff, Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

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
  const [itinerary, setItinerary] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [attractions, setAttractions] = useState<any[]>([])
  const [tripDetails, setTripDetails] = useState<any>({})
  const [showItineraryForm, setShowItineraryForm] = useState(false)
  const [formData, setFormData] = useState({
    destination: destination || "",
    origin: "NYC",
    departureDate: new Date().toISOString().split("T")[0],
    returnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    budget: 500,
    travelers: 1,
    interests: "",
    specialRequests: "",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update welcome message if destination changes
  useEffect(() => {
    if (destination && destination !== formData.destination) {
      setFormData((prev) => ({ ...prev, destination }))

      const welcomeMessage: Message = {
        id: messages.length + 1,
        text: `Great! I see you're planning a trip to ${destination}. How can I help you with your ${destination} itinerary?`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, welcomeMessage])
    }
  }, [destination])

  const handleSendMessage = async () => {
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

    try {
      // Send message to Flask API
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      setIsTyping(false)
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date(data.timestamp || Date.now()),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBudgetChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, budget: value[0] }))
  }

  const handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= 20) {
      setFormData((prev) => ({ ...prev, travelers: value }))
    }
  }

  const generateItinerary = async () => {
    setIsTyping(true)

    try {
      const response = await fetch("http://localhost:5000/api/generate_itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      setItinerary(data.itinerary)
      setPdfUrl(data.pdfUrl)
      setAttractions(data.attractions || [])
      setTripDetails(data.tripDetails || {})

      const botMessage: Message = {
        id: messages.length + 1,
        text: `I've created a personalized itinerary for your trip to ${formData.destination}! You can view it below and download the PDF for offline viewing.`,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setShowItineraryForm(false)
    } catch (error) {
      console.error("Error generating itinerary:", error)
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "Sorry, I'm having trouble generating your itinerary. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
        <h3 className="text-lg font-medium flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Trip Advisor Chat
        </h3>
        <p className="text-sm opacity-90">Ask questions about your trip</p>
      </div>

      <div className="flex-1 flex flex-col">
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
                      {message.sender === "user" ? (
                        <User className="h-5 w-5 m-auto" />
                      ) : (
                        <Bot className="h-5 w-5 m-auto" />
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-rose-600 dark:bg-rose-700 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.text }} />
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

            {itinerary && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4">
                <h3 className="text-lg font-bold mb-2">Your Personalized Itinerary</h3>
                <div className="mb-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: itinerary }} />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {tripDetails.destination} • {tripDetails.departureDate} to {tripDetails.returnDate}
                    </p>
                  </div>
                  <a
                    href={`http://localhost:5000${pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {attractions.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4">
                <h3 className="text-lg font-bold mb-2">Top Attractions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attractions.map((attraction, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <h4 className="font-medium">{attraction.name}</h4>
                      <p className="text-sm text-gray-500">
                        {attraction.type} • Rating: {attraction.rating}
                      </p>
                      <p className="text-sm">{attraction.address}</p>
                      {attraction.googleUrl && (
                        <a
                          href={attraction.googleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:text-rose-800 text-sm"
                        >
                          View on Google Maps
                        </a>
                      )}
                      {attraction.photoUrl && (
                        <img
                          src={attraction.photoUrl || "/placeholder.svg"}
                          alt={attraction.name}
                          className="mt-2 rounded-md w-full h-32 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 mb-2">
            <Dialog open={showItineraryForm} onOpenChange={setShowItineraryForm}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Your Travel Itinerary</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleFormChange}
                        placeholder="e.g., Paris, Tokyo, New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="origin">Origin (IATA code)</Label>
                      <Input
                        id="origin"
                        name="origin"
                        value={formData.origin}
                        onChange={handleFormChange}
                        placeholder="e.g., LAX, JFK, LHR"
                      />
                    </div>
                    <div>
                      <Label htmlFor="travelers">Travelers</Label>
                      <Input
                        id="travelers"
                        name="travelers"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelers}
                        onChange={handleTravelersChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        name="departureDate"
                        type="date"
                        value={formData.departureDate}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        name="returnDate"
                        type="date"
                        value={formData.returnDate}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="budget">Budget (${formData.budget})</Label>
                      <Slider
                        id="budget"
                        min={100}
                        max={5000}
                        step={100}
                        value={[formData.budget]}
                        onValueChange={handleBudgetChange}
                        className="mt-2"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="interests">Interests</Label>
                      <Textarea
                        id="interests"
                        name="interests"
                        value={formData.interests}
                        onChange={handleFormChange}
                        placeholder="e.g., museums, hiking, local cuisine"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleFormChange}
                        placeholder="Dietary needs, accessibility, etc."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={generateItinerary} className="bg-rose-600 hover:bg-rose-700">
                    Generate Itinerary
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isListening ? "Listening... speak now" : "Press the microphone button to use voice input"}
          </div>
        </div>
      </div>
    </div>
  )
}

