"use client"

import { useState, useEffect } from "react"
import type { ScrapbookEntry } from "@/components/Scrapmap/types"

interface MemoriesSidebarProps {
  entries: ScrapbookEntry[]
  onSelectEntry: (entry: ScrapbookEntry) => void
  selectedEntryId?: string
}

export default function MemoriesSidebar({ entries, onSelectEntry, selectedEntryId }: MemoriesSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEntries, setFilteredEntries] = useState<ScrapbookEntry[]>(entries)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEntries(entries)
    } else {
      const filtered = entries.filter((entry) => entry.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredEntries(filtered)
    }
  }, [searchTerm, entries])

  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date"
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="memories-sidebar">
      <div className="memories-header">
        <h2>My Memories</h2>
        <div className="form-group" style={{ marginTop: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="memories-list">
        {filteredEntries.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            {searchTerm ? "No memories match your search" : "No memories yet"}
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry._id}
              className={`memory-card ${selectedEntryId === entry._id ? "border-2 border-red-500" : ""}`}
              onClick={() => onSelectEntry(entry)}
            >
              <div className="memory-media">
                {entry.media && entry.media.length > 0 && entry.mediaTypes ? (
                  entry.mediaTypes[0].startsWith("image/") ? (
                    <img src={entry.media[0] || "/placeholder.svg"} alt="Memory" />
                  ) : entry.mediaTypes[0].startsWith("video/") ? (
                    <video src={entry.media[0]} />
                  ) : null
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400">No media</span>
                  </div>
                )}

                {entry.media && entry.media.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    +{entry.media.length - 1}
                  </div>
                )}
              </div>

              <div className="memory-content">
                <h3 className="memory-title">
                  {entry.notes.substring(0, 30)}
                  {entry.notes.length > 30 ? "..." : ""}
                </h3>
                <p className="memory-location">
                  {entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}
                </p>
                <p className="memory-date">{formatDate(entry.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

