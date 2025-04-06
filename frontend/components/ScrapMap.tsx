"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import MemoriesSidebar from "@/components/Scrapmap/memories/MemoriesSidebar"
import EntryDetails from "@/components/Scrapmap/entries/EntryDetails"
import type { ScrapbookEntry } from "@/components/Scrapmap/types"
import "@/components/ScrapMap/styles/styles.css"

declare global {
  interface Window {
    google: any
  }
}

export default function ScrapMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [clickedLatLng, setClickedLatLng] = useState<google.maps.LatLng | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [notes, setNotes] = useState<string>("")
  const [entries, setEntries] = useState<ScrapbookEntry[]>([])
  const [editEntry, setEditEntry] = useState<ScrapbookEntry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<ScrapbookEntry | null>(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Store marker references separately to avoid infinite loops
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const infoWindowsRef = useRef<Map<string, google.maps.InfoWindow>>(new Map())

  // Define these callbacks outside useEffect to prevent recreation
  const editEntryHandler = useCallback(
    (id: string) => {
      const entry = entries.find((e) => e._id === id)
      if (entry) {
        setEditEntry(entry)
        setClickedLatLng(new google.maps.LatLng(entry.lat, entry.lng))
        setMediaFiles([])
        setNotes(entry.notes)
        setShowForm(true)

        // Close any open info windows
        infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
      }
    },
    [entries],
  )

  const deleteEntryHandler = useCallback(
    async (id: string) => {
      try {
        const res = await fetch("/api/entries", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        // Remove marker from map
        const marker = markersRef.current.get(id)
        if (marker) {
          marker.setMap(null)
          markersRef.current.delete(id)
        }

        // Close info window if open
        const infoWindow = infoWindowsRef.current.get(id)
        if (infoWindow) {
          infoWindow.close()
          infoWindowsRef.current.delete(id)
        }

        // Update entries state
        setEntries((prev) => prev.filter((e) => e._id !== id))

        // Clear selected entry if it was deleted
        if (selectedEntry?._id === id) {
          setSelectedEntry(null)
        }
      } catch (err) {
        setError("Failed to delete entry: " + (err as Error).message)
      }
    },
    [selectedEntry],
  )

  const viewEntryDetails = useCallback(
    (entry: ScrapbookEntry) => {
      setSelectedEntry(entry)
      setCurrentMediaIndex(0) // Reset to first media when viewing a new entry

      // Close any open info windows
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())

      // If on mobile, close the sidebar
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false)
      }

      // Center map on the entry
      if (map) {
        map.panTo({ lat: entry.lat, lng: entry.lng })
        map.setZoom(15)
      }
    },
    [map],
  )

  // Load map and entries only once
  useEffect(() => {
    // Set up global handlers for InfoWindow buttons
    ;(window as any).editEntry = editEntryHandler
    ;(window as any).deleteEntry = deleteEntryHandler
    ;(window as any).viewEntryDetails = (id: string) => {
      const entry = entries.find((e) => e._id === id)
      if (entry) viewEntryDetails(entry)
    }

    // Fetch the API key from our server route
    fetch("/api/maps-key")
      .then((res) => res.json())
      .then((data) => {
        const loader = new Loader({
          apiKey: data.apiKey,
          version: "weekly",
          libraries: ["places"], // Explicitly include the places library
        })

        let googleMap: google.maps.Map

        loader
          .load()
          .then(() => {
            // Initialize map
            googleMap = new google.maps.Map(mapRef.current as HTMLDivElement, {
              center: { lat: 40.7128, lng: -74.006 }, // Default: NYC
              zoom: 10,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              styles: [
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
                },
                {
                  featureType: "landscape",
                  elementType: "geometry",
                  stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
                },
                {
                  featureType: "poi",
                  elementType: "geometry",
                  stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
                },
                {
                  featureType: "poi.park",
                  elementType: "geometry",
                  stylers: [{ color: "#dedede" }, { lightness: 21 }],
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry.fill",
                  stylers: [{ color: "#ffffff" }, { lightness: 17 }],
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
                },
                {
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [{ color: "#ffffff" }, { lightness: 18 }],
                },
                {
                  featureType: "road.local",
                  elementType: "geometry",
                  stylers: [{ color: "#ffffff" }, { lightness: 16 }],
                },
                {
                  featureType: "transit",
                  elementType: "geometry",
                  stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
                },
                {
                  featureType: "administrative",
                  elementType: "geometry.fill",
                  stylers: [{ color: "#fefefe" }, { lightness: 20 }],
                },
                {
                  featureType: "administrative",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
                },
              ],
            })
            setMap(googleMap)

            // Set up click listener
            googleMap.addListener("click", (event: google.maps.MapMouseEvent) => {
              // Close any open info windows
              infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())

              setClickedLatLng(event.latLng as google.maps.LatLng)
              setShowForm(true)
              setSelectedEntry(null)
              setEditEntry(null)
              setNotes("")
              setMediaFiles([])
            })

            // Set up search functionality with autocomplete
            if (searchRef.current) {
              // Initialize autocomplete
              autocompleteRef.current = new window.google.maps.places.Autocomplete(searchRef.current, {
                types: ["geocode"],
                fields: ["place_id", "geometry", "name", "formatted_address"],
              })

              // Add listener for place selection
              autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current?.getPlace()
                if (place && place.geometry && place.geometry.location) {
                  googleMap.setCenter(place.geometry.location)
                  googleMap.setZoom(15)
                }
              })

              // Fallback for Enter key
              searchRef.current.addEventListener("keypress", (e: KeyboardEvent) => {
                if (e.key === "Enter" && searchRef.current?.value && !autocompleteRef.current?.getPlace()) {
                  const geocoder = new window.google.maps.Geocoder()
                  geocoder.geocode({ address: searchRef.current.value }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                      googleMap.panTo(results[0].geometry.location)
                      googleMap.setZoom(15)
                    } else {
                      setError("Geocode failed: " + status)
                    }
                  })
                }
              })
            }

            // Load entries
            fetchEntries(googleMap)
          })
          .catch((err) => {
            setError("Failed to load Google Maps: " + err.message)
          })
      })
      .catch((err) => {
        setError("Failed to fetch API key: " + err.message)
      })

    // Clean up function
    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current.clear()

      // Clean up info windows
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
      infoWindowsRef.current.clear()

      // Remove global handlers
      delete (window as any).editEntry
      delete (window as any).deleteEntry
      delete (window as any).viewEntryDetails

      // Clean up autocomplete listeners
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Separate function to fetch entries
  const fetchEntries = async (googleMap: google.maps.Map) => {
    try {
      const res = await fetch("/api/entries")
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const loadedEntries: ScrapbookEntry[] = await res.json()
      console.log("Loaded entries:", loadedEntries)

      // Create markers for each entry
      loadedEntries.forEach((entry) => {
        createMarkerForEntry(entry, googleMap)
      })

      setEntries(loadedEntries)
    } catch (err) {
      setError("Failed to load entries: " + (err as Error).message)
    }
  }

  // Create marker for an entry
  const createMarkerForEntry = (entry: ScrapbookEntry, googleMap: google.maps.Map) => {
    const marker = new window.google.maps.Marker({
      position: { lat: entry.lat, lng: entry.lng },
      map: googleMap,
      animation: window.google.maps.Animation.DROP,
      title: entry.notes.substring(0, 30) + (entry.notes.length > 30 ? "..." : ""),
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#c62828",
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: 8,
      },
    })

    // Create info window content with first media item if available
    let mediaContent = ""
    if (entry.media && entry.media.length > 0 && entry.mediaTypes) {
      const firstMedia = entry.media[0]
      const firstMediaType = entry.mediaTypes[0]

      if (firstMediaType.startsWith("image/")) {
        mediaContent = `<img src="${firstMedia}" width="200" class="rounded shadow" />`
      } else if (firstMediaType.startsWith("video/")) {
        mediaContent = `<video src="${firstMedia}" width="200" controls class="rounded shadow"></video>`
      }

      if (entry.media.length > 1) {
        mediaContent += `<div class="mt-1 text-xs text-gray-500">${entry.media.length} media items</div>`
      }
    }

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="text-lg font-bold mb-2">${entry.notes.substring(0, 30) + (entry.notes.length > 30 ? "..." : "")}</h3>
          ${mediaContent ? `<div class="mb-2">${mediaContent}</div>` : ""}
          <div class="flex space-x-2 mt-3">
            <button onclick="window.viewEntryDetails('${entry._id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition">View</button>
            <button onclick="window.editEntry('${entry._id}')" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition">Edit</button>
            <button onclick="window.deleteEntry('${entry._id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition">Delete</button>
          </div>
        </div>
      `,
    })

    marker.addListener("click", () => {
      // Close any open info windows first
      infoWindowsRef.current.forEach((window) => window.close())

      infoWindow.open(googleMap, marker)

      // Close form and detail panel if open
      setShowForm(false)
      setSelectedEntry(null)
    })

    markersRef.current.set(entry._id, marker)
    infoWindowsRef.current.set(entry._id, infoWindow)
  }

  const handleSave = async () => {
    if (!map || !clickedLatLng) return

    // Process all media files
    const mediaPromises: Promise<{ data: string; type: string }>[] = mediaFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () =>
          resolve({
            data: reader.result as string,
            type: file.type,
          })
        reader.readAsDataURL(file)
      })
    })

    const processedMedia = await Promise.all(mediaPromises)

    // Prepare entry data
    let mediaData: string[] = []
    let mediaTypes: string[] = []

    if (editEntry && editEntry.media && editEntry.mediaTypes) {
      // Keep existing media for edit
      mediaData = [...editEntry.media]
      mediaTypes = [...editEntry.mediaTypes]
    }

    // Add new media
    processedMedia.forEach((item) => {
      mediaData.push(item.data)
      mediaTypes.push(item.type)
    })

    const entry = {
      lat: clickedLatLng.lat(),
      lng: clickedLatLng.lng(),
      notes,
      media: mediaData,
      mediaTypes,
    }

    try {
      let res
      let id = editEntry?._id

      if (editEntry) {
        res = await fetch("/api/entries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editEntry._id, ...entry }),
        })
      } else {
        res = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        })
        const data = await res.json()
        id = data.id
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      // Remove existing marker if editing
      if (editEntry) {
        const oldMarker = markersRef.current.get(editEntry._id)
        if (oldMarker) oldMarker.setMap(null)

        const oldInfoWindow = infoWindowsRef.current.get(editEntry._id)
        if (oldInfoWindow) oldInfoWindow.close()
      }

      // Create new entry object
      const newEntry: ScrapbookEntry = {
        _id: id as string,
        ...entry,
      }

      // Create marker for the entry
      createMarkerForEntry(newEntry, map)

      // Update entries state
      setEntries((prev) => {
        if (editEntry) {
          return prev.map((e) => (e._id === editEntry._id ? newEntry : e))
        } else {
          return [...prev, newEntry]
        }
      })

      setError(null)
    } catch (err) {
      setError("Failed to save entry: " + (err as Error).message)
    }

    // Reset form
    setClickedLatLng(null)
    setShowForm(false)
    setMediaFiles([])
    setNotes("")
    setEditEntry(null)
  }

  const handleCancel = () => {
    setClickedLatLng(null)
    setShowForm(false)
    setMediaFiles([])
    setNotes("")
    setEditEntry(null)
  }

  const closeDetailPanel = () => {
    setSelectedEntry(null)
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFiles((prev) => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Digital Travel Scrapbook</h1>

        <div className="search-container">
          <input ref={searchRef} type="text" placeholder="Search for a location..." className="search-input" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Mobile sidebar toggle */}
        <button className="md:hidden" onClick={toggleMobileSidebar} aria-label="Toggle memories sidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="content-container">
        {/* Memories Sidebar */}
        <div className={`memories-sidebar ${isMobileSidebarOpen ? "open" : ""}`}>
          <MemoriesSidebar entries={entries} onSelectEntry={viewEntryDetails} selectedEntryId={selectedEntry?._id} />
        </div>

        {/* Map Container */}
        <div className="map-container">
          <div ref={mapRef} className="h-full w-full" />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="error-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        {/* Form Panel */}
        {showForm && clickedLatLng && (
          <div className="panel">
            <div className="panel-header">
              <h2 className="panel-title">{editEntry ? "Edit Memory" : "Add New Memory"}</h2>
              <button onClick={handleCancel} className="close-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="location-display">
                {clickedLatLng.lat().toFixed(6)}, {clickedLatLng.lng().toFixed(6)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Memory Description</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What makes this place special?"
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photos or Videos</label>
              <div className="media-upload">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="media-upload-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p className="media-upload-text">Drag and drop files here, or click to select files</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
            </div>

            {/* Preview new media files */}
            {mediaFiles.length > 0 && (
              <div className="media-preview">
                <h3 className="media-preview-title">New Media Preview</h3>
                <div className="media-grid">
                  {mediaFiles.map((file, index) => (
                    <div key={index} className="media-item">
                      {file.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Preview ${index}`} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                        </div>
                      )}
                      <button type="button" onClick={() => removeMediaFile(index)} className="media-remove">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show existing media if editing */}
            {editEntry?.media && editEntry.media.length > 0 && editEntry.mediaTypes && (
              <div className="media-preview">
                <h3 className="media-preview-title">Current Media</h3>
                <div className="media-grid">
                  {editEntry.media.map((mediaItem, index) => (
                    <div key={index} className="media-item">
                      {editEntry.mediaTypes && editEntry.mediaTypes[index]?.startsWith("image/") ? (
                        <img src={mediaItem || "/placeholder.svg"} alt={`Media ${index}`} />
                      ) : editEntry.mediaTypes && editEntry.mediaTypes[index]?.startsWith("video/") ? (
                        <div className="flex items-center justify-center h-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="button-group">
              <button onClick={handleCancel} className="button button-secondary">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!notes.trim()} className="button button-primary">
                {editEntry ? "Update Memory" : "Save Memory"}
              </button>
            </div>
          </div>
        )}

        {/* Details Panel */}
        {selectedEntry && (
          <EntryDetails
            entry={selectedEntry}
            onEdit={() => editEntryHandler(selectedEntry._id)}
            onDelete={() => deleteEntryHandler(selectedEntry._id)}
            onClose={closeDetailPanel}
          />
        )}

        {/* Add Memory Floating Button */}
        {!showForm && !selectedEntry && (
          <button
            onClick={() => {
              if (map) {
                const center = map.getCenter()
                if (center) {
                  setClickedLatLng(center)
                  setShowForm(true)
                  setEditEntry(null)
                  setNotes("")
                  setMediaFiles([])
                }
              }
            }}
            className="fab"
            aria-label="Add new memory"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

