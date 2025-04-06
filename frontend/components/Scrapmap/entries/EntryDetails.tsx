"use client"

import { useState } from "react"
import type { ScrapbookEntry } from "@/components/Scrapmap/types"
import SocialShare from "@/components/Scrapmap/sharing/SocialShare"

interface EntryDetailsProps {
  entry: ScrapbookEntry
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function EntryDetails({ entry, onEdit, onDelete, onClose }: EntryDetailsProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const hasMedia = entry.media && entry.media.length > 0
  const mediaCount = entry.media?.length || 0

  const goToNextMedia = () => {
    if (mediaCount > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaCount)
    }
  }

  const goToPrevMedia = () => {
    if (mediaCount > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + mediaCount) % mediaCount)
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Memory Details</h2>
        <button onClick={onClose} className="close-button" aria-label="Close details">
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

      <div className="space-y-4">
        {hasMedia && (
          <div className="media-carousel">
            {entry.mediaTypes && entry.media && entry.mediaTypes[currentMediaIndex]?.startsWith("image/") ? (
              <img
                src={entry.media[currentMediaIndex] || "/placeholder.svg"}
                alt="Memory"
                className="w-full h-full object-cover"
              />
            ) : entry.mediaTypes && entry.media && entry.mediaTypes[currentMediaIndex]?.startsWith("video/") ? (
              <video src={entry.media[currentMediaIndex]} controls className="w-full h-full object-cover" />
            ) : null}

            {mediaCount > 1 && (
              <div className="carousel-nav">
                <button onClick={goToPrevMedia} className="carousel-button" aria-label="Previous media">
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
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <div className="carousel-counter">
                  {currentMediaIndex + 1} / {mediaCount}
                </div>
                <button onClick={goToNextMedia} className="carousel-button" aria-label="Next media">
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
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Memory</label>
          <p className="text-gray-800 whitespace-pre-wrap">{entry.notes}</p>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <p className="text-gray-800">
            {entry.lat.toFixed(6)}, {entry.lng.toFixed(6)}
          </p>
        </div>

        {entry.createdAt && (
          <div className="form-group">
            <label className="form-label">Created</label>
            <p className="text-gray-800">
              {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
            </p>
          </div>
        )}

        <SocialShare entry={entry} />

        <div className="button-group">
          <button onClick={onEdit} className="button button-secondary">
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
              className="button-icon"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button onClick={onDelete} className="button button-primary">
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
              className="button-icon"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

