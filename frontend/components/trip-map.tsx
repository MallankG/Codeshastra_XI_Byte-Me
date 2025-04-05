"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TripMapProps {
  destination: [number, number] | null
}

export default function TripMap({ destination }: TripMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
        <h3 className="text-lg font-medium">Destination Map</h3>
        <p className="text-sm opacity-90">
          {destination ? "Explore your destination" : "Your destination will appear here"}
        </p>
      </div>

      <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 p-4">
        {!mapLoaded ? (
          <div className="h-full flex items-center justify-center">
            <p>Loading map...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center"
          >
            {destination ? (
              <div className="text-center">
                <p className="mb-4">
                  Map would display the selected destination: {destination[0]}, {destination[1]}
                </p>
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <div className="h-8 w-8 bg-rose-600 rounded-full animate-ping absolute"></div>
                    <div className="h-8 w-8 bg-rose-600 rounded-full relative flex items-center justify-center text-white">
                      📍
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  In a real implementation, this would be an interactive map using Leaflet.js or Google Maps
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p>Select a destination to see it on the map</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

