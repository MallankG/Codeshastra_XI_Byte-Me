"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Search } from "lucide-react"

interface SearchResult {
  description: string
  place_id: string
}

declare global {
  interface Window {
    google: any
  }
}

const SearchBar: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!searchRef.current || typeof window.google === "undefined") return

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(searchRef.current, {
      types: ["geocode"],
      fields: ["place_id", "geometry", "name", "formatted_address"],
    })

    // Add listener for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place?.geometry?.location) return

      // Get the map instance (you might need to pass this as a prop or use context)
      const mapInstance = document.querySelector("[data-map-instance]")
      if (mapInstance) {
        const map = (mapInstance as any).__map
        if (map) {
          map.setCenter(place.geometry.location)
          map.setZoom(15)
        }
      }

      setShowResults(false)
    })

    return () => {
      // Clean up listeners if needed
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current as google.maps.places.Autocomplete)
    }
  }, [])

  // Fallback geocoding function
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchRef.current?.value) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: searchRef.current.value }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          // Get the map instance
          const mapInstance = document.querySelector("[data-map-instance]")
          if (mapInstance) {
            const map = (mapInstance as any).__map
            if (map) {
              map.setCenter(results[0].geometry.location)
              map.setZoom(15)
            }
          }
        }
      })
      setShowResults(false)
    }
  }

  // Handle input changes for custom autocomplete UI
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 2) {
      // This would be replaced with actual API call in production
      // For demo, we'll just show some fake results
      const mockResults = [
        { description: `${value} in New York`, place_id: "1" },
        { description: `${value} in Paris`, place_id: "2" },
        { description: `${value} in Tokyo`, place_id: "3" },
      ]
      setSearchResults(mockResults)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  return (
    <div className="relative w-96">
      <div className="relative flex items-center">
        <div className="absolute left-3 z-10">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleSearch}
          placeholder="Search for a location..."
          className="w-full py-2 px-3 pl-10 rounded-md border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
          style={{ caretColor: 'black' }}
        />
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                if (searchRef.current) searchRef.current.value = result.description
                setSearchTerm(result.description)
                setShowResults(false)
              }}
            >
              {result.description}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar

