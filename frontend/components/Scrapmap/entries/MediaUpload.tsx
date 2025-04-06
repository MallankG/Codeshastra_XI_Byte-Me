"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Image, Video, type File } from "lucide-react"

interface MediaUploadProps {
  onMediaChange: (files: File[]) => void
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      onMediaChange(filesArray)

      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      onMediaChange(filesArray)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Photos or Videos</label>
      <div
        className={`flex items-center justify-center w-full ${
          isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:bg-gray-50"
        } border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-8 h-8 text-purple-500 mb-2" />
          <p className="text-sm text-gray-700 font-medium">Drag and drop files here, or click to select files</p>
          <p className="text-xs text-gray-500 mt-1">Support for images and videos</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <div className="flex items-center text-xs text-gray-500">
              <Image className="w-4 h-4 mr-1" />
              <span>Images</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Video className="w-4 h-4 mr-1" />
              <span>Videos</span>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
    </div>
  )
}

export default MediaUpload

