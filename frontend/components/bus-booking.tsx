"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Bus, Clock, ArrowRight, Search, Loader2, Check, Moon, Sunrise } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface BusSearchFormData {
  from: string
  to: string
  date: Date | undefined
  passengers: number
  busType: string
}

interface BusType {
  id: string
  name: string
  operator: string
  departureTime: string
  arrivalTime: string
  duration: string
  from: string
  to: string
  price: number
  busType: string
  amenities: string[]
  seatsAvailable: number
  rating: number
}

interface BookingDetails {
  bus: BusType
  passengers: number
  date: Date | undefined
  totalPrice: number
  bookingId: string
  seatNumbers: string[]
}

export function BusBooking() {
  // States
  const [searchFormData, setSearchFormData] = useState<BusSearchFormData>({
    from: "",
    to: "",
    date: undefined,
    passengers: 1,
    busType: "all",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [availableBuses, setAvailableBuses] = useState<BusType[]>([])
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [activeTab, setActiveTab] = useState<string>("search")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [showSeatSelection, setShowSeatSelection] = useState(false)

  // Popular routes
  const popularRoutes = [
    { from: "Delhi", to: "Jaipur" },
    { from: "Mumbai", to: "Pune" },
    { from: "Bangalore", to: "Chennai" },
    { from: "Hyderabad", to: "Bangalore" },
    { from: "Ahmedabad", to: "Mumbai" },
  ]

  // Sample bus data
  const sampleBuses: BusType[] = [
    {
      id: "1",
      name: "Volvo A/C Sleeper",
      operator: "Sharma Travels",
      departureTime: "21:30",
      arrivalTime: "06:15",
      duration: "8h 45m",
      from: "Delhi",
      to: "Jaipur",
      price: 1200,
      busType: "AC Sleeper",
      amenities: ["Charging Point", "Blanket", "Water Bottle", "Reading Light"],
      seatsAvailable: 14,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Mercedes Multi-Axle",
      operator: "Patel Tours & Travels",
      departureTime: "22:00",
      arrivalTime: "07:30",
      duration: "9h 30m",
      from: "Delhi",
      to: "Jaipur",
      price: 1450,
      busType: "AC Sleeper",
      amenities: ["WiFi", "Charging Point", "Blanket", "Water Bottle", "Snacks"],
      seatsAvailable: 8,
      rating: 4.8,
    },
    {
      id: "3",
      name: "Regular Non-AC",
      operator: "Rajasthan Roadways",
      departureTime: "20:15",
      arrivalTime: "05:45",
      duration: "9h 30m",
      from: "Delhi",
      to: "Jaipur",
      price: 650,
      busType: "Non-AC Seater",
      amenities: ["Water Bottle"],
      seatsAvailable: 22,
      rating: 3.7,
    },
    {
      id: "4",
      name: "Volvo A/C Semi-Sleeper",
      operator: "Hans Travels",
      departureTime: "19:45",
      arrivalTime: "04:30",
      duration: "8h 45m",
      from: "Delhi",
      to: "Jaipur",
      price: 950,
      busType: "AC Semi-Sleeper",
      amenities: ["Charging Point", "Water Bottle", "Reading Light"],
      seatsAvailable: 18,
      rating: 4.2,
    },
    {
      id: "5",
      name: "Luxury A/C Sleeper",
      operator: "Royal Cruiser",
      departureTime: "23:00",
      arrivalTime: "07:15",
      duration: "8h 15m",
      from: "Delhi",
      to: "Jaipur",
      price: 1650,
      busType: "AC Sleeper",
      amenities: ["WiFi", "Charging Point", "Blanket", "Water Bottle", "Snacks", "Personal TV"],
      seatsAvailable: 6,
      rating: 4.9,
    },
  ]

  // Handle form input changes
  const handleInputChange = (field: keyof BusSearchFormData, value: any) => {
    setSearchFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle popular route selection
  const handlePopularRouteSelect = (from: string, to: string) => {
    setSearchFormData((prev) => ({
      ...prev,
      from,
      to,
    }))
  }

  // Handle search submission
  const handleSearch = () => {
    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      // Filter buses based on search criteria
      let filteredBuses = sampleBuses.filter(
        (bus) =>
          (searchFormData.from === "" || bus.from.toLowerCase().includes(searchFormData.from.toLowerCase())) &&
          (searchFormData.to === "" || bus.to.toLowerCase().includes(searchFormData.to.toLowerCase())),
      )

      // Filter by bus type if specified
      if (searchFormData.busType !== "all") {
        filteredBuses = filteredBuses.filter((bus) =>
          bus.busType.toLowerCase().includes(searchFormData.busType.toLowerCase()),
        )
      }

      setAvailableBuses(filteredBuses)
      setIsSearching(false)
      setSearchPerformed(true)
      setActiveTab("results")
    }, 1500)
  }

  // Handle bus selection
  const handleSelectBus = (bus: BusType) => {
    setSelectedBus(bus)
    setSelectedSeats([])
  }

  // Handle seat selection
  const handleSeatSelection = () => {
    if (!selectedBus) return
    setShowSeatSelection(true)
  }

  // Toggle seat selection
  const toggleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber))
    } else {
      if (selectedSeats.length < searchFormData.passengers) {
        setSelectedSeats([...selectedSeats, seatNumber])
      }
    }
  }

  // Handle booking
  const handleBooking = () => {
    if (!selectedBus || !searchFormData.date || selectedSeats.length !== searchFormData.passengers) return

    setIsBooking(true)

    // Simulate booking process
    setTimeout(() => {
      const totalPrice = selectedBus.price * searchFormData.passengers

      // Generate random booking ID
      const bookingId = `BS${Math.floor(100000 + Math.random() * 900000)}`

      setBookingDetails({
        bus: selectedBus,
        passengers: searchFormData.passengers,
        date: searchFormData.date,
        totalPrice,
        bookingId,
        seatNumbers: selectedSeats,
      })

      setIsBooking(false)
      setBookingConfirmed(true)
      setShowSeatSelection(false)
      setActiveTab("booking")
    }, 2000)
  }

  // Reset booking
  const handleNewBooking = () => {
    setSearchFormData({
      from: "",
      to: "",
      date: undefined,
      passengers: 1,
      busType: "all",
    })
    setSelectedBus(null)
    setBookingConfirmed(false)
    setBookingDetails(null)
    setSearchPerformed(false)
    setAvailableBuses([])
    setSelectedSeats([])
    setActiveTab("search")
  }

  // Swap origin and destination
  const swapLocations = () => {
    setSearchFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
  }

  // Generate seat layout
  const generateSeatLayout = () => {
    if (!selectedBus) return null

    // Create a 4x8 grid for sleeper buses or 5x8 for seater buses
    const rows = selectedBus.busType.includes("Sleeper") ? 4 : 5
    const cols = 8

    const seatGrid = []

    for (let i = 0; i < rows; i++) {
      const rowSeats = []
      for (let j = 0; j < cols; j++) {
        // Skip some seats to create aisle
        if ((rows === 4 && j === 2) || (rows === 5 && j === 2)) {
          rowSeats.push(null) // aisle
          continue
        }

        const seatNumber = `${String.fromCharCode(65 + i)}${j + 1}`

        // Randomly mark some seats as unavailable
        const isAvailable = Math.random() > 0.3

        rowSeats.push({
          seatNumber,
          isAvailable,
          isSelected: selectedSeats.includes(seatNumber),
        })
      }
      seatGrid.push(rowSeats)
    }

    return seatGrid
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center">
          <Bus className="mr-2 h-6 w-6" />
          Bus Booking
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Book bus tickets for your journey across India</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="results" disabled={!searchPerformed}>
            Results
          </TabsTrigger>
          <TabsTrigger value="booking" disabled={!bookingConfirmed}>
            Booking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search for Buses</CardTitle>
              <CardDescription>Enter your journey details to find available buses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="Enter origin city"
                    value={searchFormData.from}
                    onChange={(e) => handleInputChange("from", e.target.value)}
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Enter destination city"
                    value={searchFormData.to}
                    onChange={(e) => handleInputChange("to", e.target.value)}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 rounded-full h-8 w-8"
                    onClick={swapLocations}
                  >
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Journey Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchFormData.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchFormData.date ? format(searchFormData.date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={searchFormData.date}
                        onSelect={(date) => handleInputChange("date", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Passengers</Label>
                  <Select
                    value={searchFormData.passengers.toString()}
                    onValueChange={(value) => handleInputChange("passengers", Number.parseInt(value))}
                  >
                    <SelectTrigger id="passengers">
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bus Type</Label>
                  <Select value={searchFormData.busType} onValueChange={(value) => handleInputChange("busType", value)}>
                    <SelectTrigger id="busType">
                      <SelectValue placeholder="Select bus type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="AC Sleeper">AC Sleeper</SelectItem>
                      <SelectItem value="AC Semi-Sleeper">AC Semi-Sleeper</SelectItem>
                      <SelectItem value="Non-AC Sleeper">Non-AC Sleeper</SelectItem>
                      <SelectItem value="Non-AC Seater">Non-AC Seater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Popular Routes</h4>
                <div className="flex flex-wrap gap-2">
                  {popularRoutes.map((route, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularRouteSelect(route.from, route.to)}
                      className="text-xs"
                    >
                      {route.from} to {route.to}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchFormData.from || !searchFormData.to || !searchFormData.date}
                className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Buses
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Available Buses</CardTitle>
              <CardDescription>
                {searchFormData.from} to {searchFormData.to} on{" "}
                {searchFormData.date ? format(searchFormData.date, "PPP") : "selected date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableBuses.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                      {availableBuses.length} buses found
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 flex items-center">
                      <Sunrise className="h-3 w-3 mr-1" /> Morning
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 flex items-center">
                      <Moon className="h-3 w-3 mr-1" /> Night
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {availableBuses.map((bus) => (
                      <Card
                        key={bus.id}
                        className={cn(
                          "overflow-hidden transition-all",
                          selectedBus?.id === bus.id && "border-rose-500 dark:border-rose-700",
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                          <div>
                            <h3 className="font-bold text-lg">{bus.name}</h3>
                            <p className="text-sm text-gray-500">{bus.operator}</p>
                            <div className="flex items-center mt-2">
                              <Badge variant="outline" className="mr-2">
                                {bus.busType}
                              </Badge>
                              <div className="flex items-center text-amber-500">
                                <span className="font-medium mr-1">{bus.rating}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="text-center">
                              <div className="font-bold text-lg">{bus.departureTime}</div>
                              <div className="text-sm text-gray-500">{bus.from}</div>
                            </div>
                            <div className="mx-4 flex-1 flex flex-col items-center">
                              <div className="text-xs text-gray-500">{bus.duration}</div>
                              <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 relative my-1">
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gray-500"></div>
                                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-gray-500"></div>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {Number.parseInt(bus.duration.split("h")[0])}h {bus.duration.split(" ")[1]}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg">{bus.arrivalTime}</div>
                              <div className="text-sm text-gray-500">{bus.to}</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm mb-2">Amenities</div>
                            <div className="flex flex-wrap gap-1">
                              {bus.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {bus.seatsAvailable} seats available
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">₹{bus.price}</div>
                              <div className="text-xs text-gray-500">per seat</div>
                            </div>
                            <Button
                              variant={selectedBus?.id === bus.id ? "default" : "outline"}
                              onClick={() => handleSelectBus(bus)}
                              className={
                                selectedBus?.id === bus.id
                                  ? "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                                  : ""
                              }
                            >
                              {selectedBus?.id === bus.id ? "Selected" : "Select Bus"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No buses found for the selected route and date.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("search")}>
                Back to Search
              </Button>
              <Button
                onClick={handleSeatSelection}
                disabled={!selectedBus}
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
              >
                Select Seats
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          {bookingDetails && (
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-950/20 border-b">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-2">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-green-600 dark:text-green-400">Booking Confirmed!</CardTitle>
                    <CardDescription>
                      Your booking has been confirmed with ID: {bookingDetails.bookingId}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Bus Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Bus Name:</span>
                          <span className="font-medium">{bookingDetails.bus.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Operator:</span>
                          <span className="font-medium">{bookingDetails.bus.operator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Bus Type:</span>
                          <span className="font-medium">{bookingDetails.bus.busType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Journey Date:</span>
                          <span className="font-medium">
                            {bookingDetails.date ? format(bookingDetails.date, "PPP") : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Journey Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">From:</span>
                          <span className="font-medium">{bookingDetails.bus.from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">To:</span>
                          <span className="font-medium">{bookingDetails.bus.to}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Departure:</span>
                          <span className="font-medium">{bookingDetails.bus.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Arrival:</span>
                          <span className="font-medium">{bookingDetails.bus.arrivalTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="font-medium">{bookingDetails.bus.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Passenger & Seat Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Passengers:</span>
                          <span className="font-medium">
                            {bookingDetails.passengers} {bookingDetails.passengers === 1 ? "Person" : "People"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Seat Numbers:</span>
                          <span className="font-medium">{bookingDetails.seatNumbers.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Boarding Point:</span>
                          <span className="font-medium">{bookingDetails.bus.from} Central Bus Stand</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
                          <span className="font-medium">Credit Card</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Payment Status:</span>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            Paid
                          </Badge>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Amount:</span>
                          <span className="text-rose-600 dark:text-rose-400">₹{bookingDetails.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Important Information</h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                      <li>• Please arrive at the boarding point 30 minutes before departure.</li>
                      <li>• Carry a valid ID proof for all passengers during the journey.</li>
                      <li>• E-ticket along with ID proof is valid for the journey, no need to print.</li>
                      <li>• Cancellation is available up to 6 hours before the scheduled departure.</li>
                      <li>• No refund for no-show or cancellation after departure.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleNewBooking}>
                  Book Another Ticket
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                  onClick={() => alert("Your ticket has been sent to your email!")}
                >
                  Download E-Ticket
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Your Seats</DialogTitle>
            <DialogDescription>
              Please select {searchFormData.passengers} {searchFormData.passengers === 1 ? "seat" : "seats"} for your
              journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">{selectedBus?.name}</span> - {selectedBus?.busType}
              </div>
              <div className="text-sm">
                Selected: {selectedSeats.length}/{searchFormData.passengers} seats
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <div className="flex gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-1"></div>
                  Available
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-rose-500 rounded mr-1"></div>
                  Selected
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded mr-1"></div>
                  Booked
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              {/* Bus front */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-10 border-2 border-gray-400 rounded-t-3xl flex items-center justify-center text-xs font-medium">
                  FRONT
                </div>
              </div>

              {/* Seat layout */}
              <div className="grid grid-cols-1 gap-6">
                {generateSeatLayout()?.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-2">
                    {row.map((seat, seatIndex) =>
                      seat === null ? (
                        <div key={`aisle-${rowIndex}-${seatIndex}`} className="w-8 h-8"></div>
                      ) : (
                        <button
                          key={`seat-${rowIndex}-${seatIndex}`}
                          className={cn(
                            "w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-colors",
                            !seat.isAvailable && "bg-gray-400 dark:bg-gray-600 cursor-not-allowed",
                            seat.isAvailable &&
                              !seat.isSelected &&
                              "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600",
                            seat.isSelected && "bg-rose-500 text-white",
                          )}
                          disabled={
                            !seat.isAvailable || (selectedSeats.length >= searchFormData.passengers && !seat.isSelected)
                          }
                          onClick={() => seat.isAvailable && toggleSeatSelection(seat.seatNumber)}
                        >
                          {seat.seatNumber}
                        </button>
                      ),
                    )}
                  </div>
                ))}
              </div>

              {/* Bus rear */}
              <div className="flex justify-center mt-6">
                <div className="w-24 h-10 border-2 border-gray-400 rounded-b-3xl flex items-center justify-center text-xs font-medium">
                  REAR
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <div className="text-sm font-medium">Price Details:</div>
                <div className="text-xs text-gray-500">
                  {selectedBus?.price} × {selectedSeats.length} = ₹{(selectedBus?.price || 0) * selectedSeats.length}
                </div>
              </div>
              <Button
                onClick={handleBooking}
                disabled={selectedSeats.length !== searchFormData.passengers || isBooking}
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

