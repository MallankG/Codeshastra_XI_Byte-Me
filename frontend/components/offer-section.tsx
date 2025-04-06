"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export function OfferSection() {
  const [activeTab, setActiveTab] = useState("all")

  const tabItems = [
    { value: "all", label: "All Offers" },
    { value: "bank", label: "Bank Offers" },
    { value: "flights", label: "Flights" },
    { value: "hotels", label: "Hotels" },
    { value: "holidays", label: "Holidays" },
    { value: "trains", label: "Trains" },
    { value: "cabs", label: "Cabs" },
    { value: "bus", label: "Bus" },
    { value: "forex", label: "Forex" },
  ]

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
        <TabsList className="mb-6 bg-transparent border-b w-full justify-start overflow-x-auto">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`rounded-none border-b-2 ${
                activeTab === tab.value
                  ? "border-rose-600 text-rose-600 dark:border-rose-500 dark:text-rose-500"
                  : "border-transparent"
              }`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Offers */}
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="WOW Deals on Bank Cards, JACKPOT DEALS"
            description="Showstopper Deals, Special Card Offers & more"
            image="https://blog.bankbazaar.com/wp-content/uploads/2023/01/TOP_OFFER_PAGE_BANNER_IBL_PLATINUM.png"
            category="INTL FLIGHTS"
            buttonText="BOOK NOW"
          />
          <OfferCard
            title="LIVE NOW: FLAT 45% OFF* on Holiday Packages"
            description="Explore all incredible deals & plan a trip"
            image="https://www.outstandingcolleges.com/wp-content/uploads/2015/02/tour-packages.jpg"
            category="HOLIDAYS"
            buttonText="BOOK NOW"
          />
          <OfferCard
            title="SUN-SATIONAL DEALS FOR YOUR SUMMER VACAY"
            description="Grab Up to 30% OFF* on International Hotels!"
            image="https://businesshilights.com.ng/wp-content/uploads/2018/04/Marriot-Accra-1024x682.jpg"
            category="INTL HOTELS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Bank Offers */}
        <TabsContent value="bank" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="WOW Deals on Bank Cards, JACKPOT DEALS"
            description="Showstopper Deals, Special MMTBLACK Offers & more"
            image="https://blog.bankbazaar.com/wp-content/uploads/2023/01/TOP_OFFER_PAGE_BANNER_IBL_PLATINUM.png"
            category="BANK OFFERS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Flights */}
        <TabsContent value="flights" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="New Flights by IndiGo Stretch & Stretch+"
            description="with FLAT ₹3000 OFF*"
            image="https://www.logisticsinsider.in/wp-content/uploads/2022/06/indgo.jpeg"
            category="DOM FLIGHTS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Hotels */}
        <TabsContent value="hotels" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="SUN-SATIONAL DEALS FOR YOUR SUMMER VACAY"
            description="Grab Up to 30% OFF* on International Hotels!"
            image="https://www.fourseasons.com/alt/img-opt/~70..0,0000-125,0000-2400,0000-1350,0000/publish/content/dam/fourseasons/images/web/NYF/NYF_1376_original.jpg"
            category="INTL HOTELS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Holidays */}
        <TabsContent value="holidays" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            title="LIVE NOW: FLAT 45% OFF* on Holiday Packages"
            description="Explore all incredible deals & plan a trip"
            image="https://businesshilights.com.ng/wp-content/uploads/2018/04/Marriot-Accra-1024x682.jpg"
            category="HOLIDAYS"
            buttonText="BOOK NOW"
          />
        </TabsContent>

        {/* Other TabsContent (trains, cabs, bus, forex) can be added here similarly */}
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
