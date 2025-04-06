"use client"

import { useRef } from "react"
import type { ScrapbookEntry } from "@/components/Scrapmap/types"

export function useMarkers(
  map: google.maps.Map | null,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onView: (id: string) => void,
) {
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const infoWindowsRef = useRef<Map<string, google.maps.InfoWindow>>(new Map())

  const createMarkerForEntry = (entry: ScrapbookEntry) => {
    if (!map || !window.google) return

    const marker = new window.google.maps.Marker({
      position: { lat: entry.lat, lng: entry.lng },
      map: map,
      animation: window.google.maps.Animation.DROP,
      title: entry.notes.substring(0, 30) + (entry.notes.length > 30 ? "..." : ""),
    })

    // Create info window content
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
      closeAllInfoWindows()
      infoWindow.open({
        anchor: marker,
        map,
      })
    })

    markersRef.current.set(entry._id, marker)
    infoWindowsRef.current.set(entry._id, infoWindow)

    // Set up global handlers if they don't exist
    if (typeof window !== "undefined") {
      ;(window as any).editEntry = (id: string) => onEdit(id)
      ;(window as any).deleteEntry = (id: string) => onDelete(id)
      ;(window as any).viewEntryDetails = (id: string) => onView(id)
    }

    return marker
  }

  const removeMarker = (id: string) => {
    const marker = markersRef.current.get(id)
    if (marker) {
      marker.setMap(null)
      markersRef.current.delete(id)
    }

    const infoWindow = infoWindowsRef.current.get(id)
    if (infoWindow) {
      infoWindow.close()
      infoWindowsRef.current.delete(id)
    }
  }

  const closeAllInfoWindows = () => {
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
  }

  return {
    createMarkerForEntry,
    removeMarker,
    closeAllInfoWindows,
  }
}

