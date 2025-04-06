"use client"

import dynamic from "next/dynamic"

// Dynamically import the ScrapMap component to avoid SSR issues with Google Maps
const ScrapMap = dynamic(() => import("@/components/ScrapMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return <ScrapMap />
}



