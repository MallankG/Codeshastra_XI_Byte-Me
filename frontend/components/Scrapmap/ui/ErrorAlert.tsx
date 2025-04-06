"use client"

import type React from "react"

import { X, AlertCircle } from "lucide-react"

interface ErrorAlertProps {
  message: string
  onClose: () => void
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex items-center shadow-lg z-20">
      <AlertCircle className="h-5 w-5 mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 text-red-700 hover:text-red-900">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ErrorAlert

