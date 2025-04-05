
"use client"

import dynamic from "next/dynamic"
import TripForm from "@/components/trip-form"
import ItineraryDisplay from "@/components/itinerary-display"
import ChatInterface from "@/components/chat-interface"
const TripMap = dynamic(() => import("@/components/trip-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p>Loading map...</p>
    </div>
  ),
})

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TravelDashboard({ itinerary, destination }: any) {
  const [formMinimized, setFormMinimized] = useState(false)
  const [showItinerary, setShowItinerary] = useState(true)
  const [showMap, setShowMap] = useState(true)

  const handleFormSubmit = (formData: any) => {
    // Process form & generate itinerary
    setFormMinimized(true)
  }

  const dummyItinerary = {
    destination: "Paris",
    days: [
      {
        day: 1,
        activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"],
      },
      {
        day: 2,
        activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
      },
      {
        day: 3,
        activities: [
          "Versailles Day Trip",
          "Explore Champs-Élysées",
          "Dinner at local bistro",
        ],
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
  {/* Header */}
  <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
    <div className="container mx-auto px-4 py-3 flex items-center">
      <Link
        href="/"
        className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span>Back to Home</span>
      </Link>
      <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
        AI Trip Advisor
      </h1>
      <div className="w-20"></div>
    </div>
  </header>

  {/* Main */}
  <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
    {/* Top: Form */}
    <div className="relative">
      <AnimatePresence>
        {!formMinimized && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4">
              <TripForm onSubmit={handleFormSubmit} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formMinimized && (
          <motion.div
            key="fab"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 z-50"
          >
            <Button
              onClick={() => setFormMinimized(false)}
              className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
            >
              +
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* 2-column layout: Itinerary + Map */}
    <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
      {/* Left: Itinerary + Bot */}
      <div className="flex flex-col gap-6 flex-1 overflow-hidden">
        <Card className="flex-1 overflow-auto p-4">
          <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
        </Card>
        <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
          <ChatInterface destination={itinerary?.destination || dummyItinerary.destination} />
        </Card>
      </div>

      {/* Right: Map */}
      <Card className="flex-1 h-full overflow-hidden p-4">
        <TripMap destination={destination || dummyItinerary.destination} />
      </Card>
    </div>
  </main>
</div>

  )
}
