"use client"

import type React from "react"
import SearchBar from "../map/SearchBar"

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 to-indigo-500 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">Digital Travel Scrapbook</h1>
      <SearchBar />
    </div>
  )
}

export default Header

