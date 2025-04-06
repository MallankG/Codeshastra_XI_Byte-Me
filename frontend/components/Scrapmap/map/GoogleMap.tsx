"use client"

import { forwardRef } from "react"

interface GoogleMapProps {
  className?: string
}

const GoogleMap = forwardRef<HTMLDivElement, GoogleMapProps>(({ className = "" }, ref) => {
  return <div ref={ref} className={`h-full w-full ${className}`} data-map-instance />
})

GoogleMap.displayName = "GoogleMap"

export default GoogleMap

