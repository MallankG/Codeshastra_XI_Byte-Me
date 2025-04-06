"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Video } from "lucide-react"
import type { ScrapbookEntry } from "@/types"
import MediaUpload from "./MediaUpload"
import type { LatLng } from "@googlemaps/js-api-loader"

interface EntryFormProps {
  entry: ScrapbookEntry | null
  location: LatLng
  onSave: (entry: Partial<ScrapbookEntry>, mediaFiles: File[]) => void
  onCancel: () => void
}

const EntryForm: React.FC<EntryFormProps> = ({ entry, location, onSave, onCancel }) => {
  const [notes, setNotes] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [existingMedia, setExistingMedia] = useState<{ data: string; type: string }[]>([])

  useEffect(() => {
    if (entry) {
      setNotes(entry.notes)

      // Set up existing media
      if (entry.media && entry.mediaTypes) {
        const media = entry.media.map((data, index) => ({
          data,
          type: entry.mediaTypes?.[index] || "",
        }))
        setExistingMedia(media)
      }
    } else {
      setNotes("")
      setExistingMedia([])
    }

    setMediaFiles([])
  }, [entry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ notes }, mediaFiles)
  }

  const handleMediaChange = (files: File[]) => {
    setMediaFiles((prev) => [...prev, ...files])
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingMedia = (index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="absolute top-4 right-4 bg-white p-6 rounded-lg shadow-lg w-96 z-10 border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-700">{entry ? "Edit Memory" : "Add New Memory"}</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" aria-label="Close form">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            {location.lat().toFixed(6)}, {location.lng().toFixed(6)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Memory Description</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What makes this place special?"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <MediaUpload onMediaChange={handleMediaChange} />

        {/* Preview new media files */}
        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">New Media</h3>
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith("image/") ? (
                    <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove media"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-24 bg-gray-100 rounded flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove media"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show existing media */}
        {existingMedia.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Current Media</h3>
            <div className="grid grid-cols-2 gap-2">
              {existingMedia.map((media, index) => (
                <div key={index} className="relative group">
                  {media.type.startsWith("image/") ? (
                    <div className="relative h-24 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={media.data || "/placeholder.svg"}
                        alt={`Media ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button type="button" />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove media"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : media.type.startsWith("video/") ? (
                    <div className="relative h-24 bg-gray-100 rounded flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove media"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!notes.trim()}
            className={`px-4 py-2 rounded text-white transition ${
              notes.trim() ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-400 cursor-not-allowed"
            }`}
          >
            {entry ? "Update Memory" : "Save Memory"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EntryForm

