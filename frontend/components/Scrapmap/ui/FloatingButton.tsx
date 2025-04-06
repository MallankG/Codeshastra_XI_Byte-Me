"use client"

import type React from "react"

import { Plus } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition z-10 flex items-center justify-center"
      aria-label="Add new memory"
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}

export default FloatingButton

