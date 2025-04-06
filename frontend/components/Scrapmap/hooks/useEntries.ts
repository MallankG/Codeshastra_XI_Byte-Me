"use client"

import { useState } from "react"
import type { ScrapbookEntry, MediaItem } from "@/components/Scrapmap/types"

export function useEntries() {
  const [entries, setEntries] = useState<ScrapbookEntry[]>([])

  const fetchEntries = async (): Promise<ScrapbookEntry[]> => {
    const res = await fetch("/api/entries")
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const loadedEntries: ScrapbookEntry[] = await res.json()
    setEntries(loadedEntries)
    return loadedEntries
  }

  const addEntry = async (entry: Partial<ScrapbookEntry>, mediaFiles: File[]): Promise<ScrapbookEntry> => {
    const mediaData = await processMediaFiles(mediaFiles)

    const entryWithMedia = {
      ...entry,
      media: mediaData.map((m) => m.data),
      mediaTypes: mediaData.map((m) => m.type),
    }

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entryWithMedia),
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()
    const newEntry = { _id: data.id, ...entryWithMedia } as ScrapbookEntry

    setEntries((prev) => [...prev, newEntry])
    return newEntry
  }

  const updateEntry = async (
    id: string,
    entry: Partial<ScrapbookEntry>,
    mediaFiles: File[],
  ): Promise<ScrapbookEntry> => {
    // Get existing entry to preserve media that wasn't changed
    const existingEntry = entries.find((e) => e._id === id)
    if (!existingEntry) throw new Error("Entry not found")

    let mediaData: MediaItem[] = []
    let media = [...(existingEntry.media || [])]
    let mediaTypes = [...(existingEntry.mediaTypes || [])]

    // Process new media files
    if (mediaFiles.length > 0) {
      mediaData = await processMediaFiles(mediaFiles)
      media = [...media, ...mediaData.map((m) => m.data)]
      mediaTypes = [...mediaTypes, ...mediaData.map((m) => m.type)]
    }

    const entryWithMedia = {
      ...entry,
      media,
      mediaTypes,
    }

    const res = await fetch("/api/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...entryWithMedia }),
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const updatedEntry = { _id: id, ...entryWithMedia } as ScrapbookEntry

    setEntries((prev) => prev.map((e) => (e._id === id ? updatedEntry : e)))
    return updatedEntry
  }

  const deleteEntry = async (id: string): Promise<void> => {
    const res = await fetch("/api/entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    setEntries((prev) => prev.filter((e) => e._id !== id))
  }

  // Helper function to process media files
  const processMediaFiles = async (files: File[]): Promise<MediaItem[]> => {
    const mediaPromises = files.map((file) => {
      return new Promise<MediaItem>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            data: reader.result as string,
            type: file.type,
          })
        }
        reader.readAsDataURL(file)
      })
    })

    return Promise.all(mediaPromises)
  }

  return {
    entries,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
  }
}

