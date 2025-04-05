"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function OfferSection() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Offers</h2>
        <div className="flex items-center gap-2">
          <Button variant="link" className="text-rose-600 dark:text-rose-500">
            VIEW ALL <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-transparent border-b w-full justify-start">
          <TabsTrigger
            value="all"
            className={`rounded-none border-b-2 ${activeTab === "all" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            All Offers
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className={`rounded-none border-b-2 ${activeTab === "bank" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Bank Offers
          </TabsTrigger>
          <TabsTrigger
            value="flights"
            className={`rounded-none border-b-2 ${activeTab === "flights" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Flights
          </TabsTrigger>
          <TabsTrigger
            value="hotels"
            className={`rounded-none border-b-2 ${activeTab === "hotels" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Hotels
          </TabsTrigger>
          <TabsTrigger
            value="holidays"
            className={`rounded-none border-b-2 ${activeTab === "holidays" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Holidays
          </TabsTrigger>
          <TabsTrigger
            value="trains"
            className={`rounded-none border-b-2 ${activeTab === "trains" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Trains
          </TabsTrigger>
          <TabsTrigger
            value="cabs"
            className={`rounded-none border-b-2 ${activeTab === "cabs" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Cabs
          </TabsTrigger>
          <TabsTrigger
            value="bus"
            className={`rounded-none border-b-2 ${activeTab === "bus" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Bus
          </TabsTrigger>
          <TabsTrigger
            value="forex"
            className={`rounded-none border-b-2 ${activeTab === "forex" ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500" : "border-transparent"}`}
          >
            Forex
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="WOW Deals on Bank Cards, JACKPOT DEALS"
            description="Showstopper Deals, Special MMTBLACK Offers & more"
            image="/placeholder.svg?height=200&width=400"
            category="INTL FLIGHTS"
            buttonText="BOOK NOW"
          />

          <OfferCard
            title="LIVE NOW: FLAT 45% OFF* on Holiday Packages"
            description="Explore all incredible deals & plan a trip"
            image="/placeholder.svg?height=200&width=400"
            category="HOLIDAYS"
            buttonText="BOOK NOW"
          />

          <OfferCard
            title="SUN-SATIONAL DEALS FOR YOUR SUMMER VACAY"
            description="Grab Up to 30% OFF* on International Hotels!"
            image="/placeholder.svg?height=200&width=400"
            category="INTL HOTELS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        <TabsContent value="bank" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="WOW Deals on Bank Cards, JACKPOT DEALS"
            description="Showstopper Deals, Special MMTBLACK Offers & more"
            image="/placeholder.svg?height=200&width=400"
            category="BANK OFFERS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        <TabsContent value="flights" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="New Flights by IndiGo Stretch & Stretch+"
            description="with FLAT ₹3000 OFF*"
            image="/placeholder.svg?height=200&width=400"
            category="DOM FLIGHTS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        <TabsContent value="hotels" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="SUN-SATIONAL DEALS FOR YOUR SUMMER VACAY"
            description="Grab Up to 30% OFF* on International Hotels!"
            image="/placeholder.svg?height=200&width=400"
            category="INTL HOTELS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        <TabsContent value="holidays" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="LIVE NOW: FLAT 45% OFF* on Holiday Packages"
            description="Explore all incredible deals & plan a trip"
            image="/placeholder.svg?height=200&width=400"
            category="HOLIDAYS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Other tab contents would follow the same pattern */}
      </Tabs>
    </div>
  )
}

interface OfferCardProps {
  title: string
  description: string
  image: string
  category: string
  buttonText: string
}

function OfferCard({ title, description, image, category, buttonText }: OfferCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-800">
      <div className="relative">
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-950 text-xs font-medium px-2 py-1 rounded">
          {category}
        </div>
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-950 text-xs font-medium px-2 py-1 rounded">
          T&C'S APPLY
        </div>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4 dark:bg-gray-950">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
        <Button className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800">
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

