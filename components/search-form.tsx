"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  CalendarIcon,
  Plane,
  Building,
  Home,
  Palmtree,
  Train,
  Bus,
  Car,
  CreditCard,
  Shield,
  Bot,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ExploreButton } from "@/components/explore-button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Community } from "@/components/community"
import HotelSearch from "./HotelSearch"

export function SearchForm() {
  const [tripType, setTripType] = useState("oneWay")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [activeTab, setActiveTab] = useState("flights")
  const [fromCity, setFromCity] = useState("Delhi")
  const [toCity, setToCity] = useState("Mumbai")
  const [travellers, setTravellers] = useState(1)
  const [travelClass, setTravelClass] = useState("Economy")
  const [fareType, setFareType] = useState("regular")
  const router = useRouter()

  const handleSearch = () => {
    alert(`Searching for ${tripType} ${activeTab} from ${fromCity} to ${toCity}`)
  }

  const swapCities = () => {
    const temp = fromCity
    setFromCity(toCity)
    setToCity(temp)
  }

  return (
    <div className="container mx-auto px-4 py-6 -mt-16 relative z-10">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-4 md:p-6">
        <Tabs defaultValue="flights" onValueChange={setActiveTab}>
          <TabsList className="flex justify-between py-10 px-8 gap-2 mb-6">
            <TabsTrigger value="flights" className="flex flex-col items-center gap-1 py-3">
              <Plane className="h-5 w-5" />
              <span className="text-xs">Flights</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex flex-col items-center gap-1 py-3">
              <Building className="h-5 w-5" />
              <span className="text-xs">Hotels</span>
            </TabsTrigger>
            
            <TabsTrigger value="trains" className="flex flex-col items-center gap-1 py-3 hidden md:flex">
              <Train className="h-5 w-5" />
              <span className="text-xs">Trains</span>
            </TabsTrigger>
            <TabsTrigger value="buses" className="flex flex-col items-center gap-1 py-3 hidden md:flex">
              <Bus className="h-5 w-5" />
              <span className="text-xs">Buses</span>
            </TabsTrigger>
            <TabsTrigger value="cabs" className="flex flex-col items-center gap-1 py-3 hidden md:flex">
              <Car className="h-5 w-5" />
              <span className="text-xs">Cabs</span>
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex flex-col items-center gap-1 py-3 hidden md:flex">
              <Palmtree className="h-5 w-5" />
              <span className="text-xs">Holiday Packages</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai-advisor"
              className="flex flex-col items-center gap-1 py-3 hidden md:flex"
              onClick={() => router.push("/ai-trip-advisor")}
            >
              <Bot className="h-5 w-5" />
              <span className="text-xs">AI Trip Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex flex-col items-center gap-1 py-3 hidden md:flex">
              <Users className="h-5 w-5" />
              <span className="text-xs">Community</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <RadioGroup defaultValue="oneWay" className="flex gap-4" onValueChange={(value) => setTripType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oneWay" id="oneWay" />
                  <Label htmlFor="oneWay">One Way</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="roundTrip" id="roundTrip" />
                  <Label htmlFor="roundTrip">Round Trip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiCity" id="multiCity" />
                  <Label htmlFor="multiCity">Multi City</Label>
                </div>
              </RadioGroup>
              <div className="ml-auto flex items-center gap-2">
                <ExploreButton />
                <div className="text-sm font-medium">Book International and Domestic Flights</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="Enter city"
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">DEL, Delhi Airport India</div>
              </div>

              <button
                onClick={swapCities}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 md:translate-y-2 bg-gray-100 dark:bg-gray-800 rounded-full p-2 hidden md:block"
              >
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
                  className="lucide lucide-arrow-left-right"
                >
                  <path d="m18 8-6-6v12"></path>
                  <path d="m6 16 6 6V10"></path>
                </svg>
              </button>

              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="Enter city"
                  className="mt-1"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">BOM, Mumbai International Airport</div>
              </div>

              <div>
                <Label htmlFor="departure">Departure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !departureDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="return" className={tripType === "oneWay" ? "text-gray-400 dark:text-gray-600" : ""}>
                  Return
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        (!returnDate || tripType === "oneWay") && "text-muted-foreground",
                      )}
                      disabled={tripType === "oneWay"}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate && tripType !== "oneWay" ? format(returnDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={tripType === "oneWay"}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="travellers">Travellers & Class</Label>
                <Input
                  id="travellers"
                  value={`${travellers} Traveller, ${travelClass}`}
                  readOnly
                  className="mt-1 cursor-pointer"
                  onClick={() => alert("Traveller selection dialog would open here")}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Select a special fare</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div
                  className={`border rounded-md p-3 cursor-pointer ${fareType === "regular" ? "border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" : ""}`}
                  onClick={() => setFareType("regular")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border ${fareType === "regular" ? "border-rose-500 bg-rose-500 dark:border-rose-700 dark:bg-rose-700" : "border-gray-300 dark:border-gray-600"}`}
                    ></div>
                    <div className="font-medium">Regular</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Regular fares</div>
                </div>

                <div
                  className={`border rounded-md p-3 cursor-pointer ${fareType === "student" ? "border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" : ""}`}
                  onClick={() => setFareType("student")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border ${fareType === "student" ? "border-rose-500 bg-rose-500 dark:border-rose-700 dark:bg-rose-700" : "border-gray-300 dark:border-gray-600"}`}
                    ></div>
                    <div className="font-medium">Student</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Extra discounts/baggage</div>
                </div>

                <div
                  className={`border rounded-md p-3 cursor-pointer ${fareType === "senior" ? "border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" : ""}`}
                  onClick={() => setFareType("senior")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border ${fareType === "senior" ? "border-rose-500 bg-rose-500 dark:border-rose-700 dark:bg-rose-700" : "border-gray-300 dark:border-gray-600"}`}
                    ></div>
                    <div className="font-medium">Senior Citizen</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Up to ₹ 600 off</div>
                </div>

                <div
                  className={`border rounded-md p-3 cursor-pointer ${fareType === "armed" ? "border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" : ""}`}
                  onClick={() => setFareType("armed")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border ${fareType === "armed" ? "border-rose-500 bg-rose-500 dark:border-rose-700 dark:bg-rose-700" : "border-gray-300 dark:border-gray-600"}`}
                    ></div>
                    <div className="font-medium">Armed Forces</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Up to ₹ 600 off</div>
                </div>

                <div
                  className={`border rounded-md p-3 cursor-pointer ${fareType === "medical" ? "border-rose-500 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" : ""}`}
                  onClick={() => setFareType("medical")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border ${fareType === "medical" ? "border-rose-500 bg-rose-500 dark:border-rose-700 dark:bg-rose-700" : "border-gray-300 dark:border-gray-600"}`}
                    ></div>
                    <div className="font-medium">Doctor and Nurses</div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Up to ₹ 600 off</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white px-12 py-6 text-lg rounded-full"
                onClick={handleSearch}
              >
                SEARCH
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="hotels">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Hotel Search</h3>
              <p className="text-gray-500 dark:text-gray-400">Hotel booking functionality would be implemented here</p>
              <HotelSearch />
            </div>
          </TabsContent>

          <TabsContent value="homestays">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Homestays Search</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Homestays booking functionality would be implemented here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="holidays">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Holiday Packages</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Holiday packages functionality would be implemented here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ai-advisor">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">AI Trip Advisor</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get personalized travel recommendations from our AI assistant
              </p>
              <Link href="/ai-trip-advisor">
                <Button className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800">
                  <Bot className="mr-2 h-4 w-4" />
                  Open AI Trip Advisor
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="p-4">
              <Community />
            </div>
          </TabsContent>

          <TabsContent value="trains">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Train Search</h3>
              <p className="text-gray-500 dark:text-gray-400">Train booking functionality would be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="buses">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Bus Search</h3>
              <p className="text-gray-500 dark:text-gray-400">Bus booking functionality would be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="cabs">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Cab Search</h3>
              <p className="text-gray-500 dark:text-gray-400">Cab booking functionality would be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="forex">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Forex Card</h3>
              <p className="text-gray-500 dark:text-gray-400">Forex card functionality would be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="insurance">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Travel Insurance</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Travel insurance functionality would be implemented here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

