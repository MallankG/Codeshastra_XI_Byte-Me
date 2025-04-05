"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import type { Itinerary } from "@/app/ai-trip-advisor/page"

interface ItineraryDisplayProps {
  itinerary: Itinerary | null
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = () => {
    if (!itinerary) return

    setDownloading(true)

    // Simulate PDF download
    setTimeout(() => {
      setDownloading(false)
      alert(`Itinerary for ${itinerary.destination} would be downloaded as PDF in a real implementation.`)
    }, 1500)

    // In a real implementation, you would use a library like jsPDF or react-pdf
    // to generate and download the PDF
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Itinerary</h2>
        {itinerary && (
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
          >
            {downloading ? "Generating..." : "Download PDF"}
            <Download className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {itinerary ? (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="prose dark:prose-invert max-w-none"
            >
              <ReactMarkdown>{itinerary.content}</ReactMarkdown>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8"
            >
              <FileText className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
              <p>Fill out the form on the left to generate a personalized travel itinerary for your next adventure.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

