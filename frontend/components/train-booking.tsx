"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Train, Clock, ArrowRight, Search, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface TrainSearchFormData {
  from: string
  to: string
  date: Date | undefined
  passengers: number
  class: string
}

interface TrainType {
  id: string
  name: string
  number: string
  departureTime: string
  arrivalTime: string
  duration: string
  from: string
  to: string
  price: {
    ordinary: number
    firstClass: number
  }
  seatsAvailable: {
    ordinary: number
    firstClass: number
  }
}

interface BookingDetails {
  train: TrainType
  passengers: number
  class: string
  date: Date | undefined
  totalPrice: number
  bookingId: string
}

export function TrainBooking() {
  // States
  const [searchFormData, setSearchFormData] = useState<TrainSearchFormData>({
    from: "",
    to: "",
    date: undefined,
    passengers: 1,
    class: "ordinary",
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [availableTrains, setAvailableTrains] = useState<TrainType[]>([])
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [activeTab, setActiveTab] = useState<string>("search")

  // Popular destinations
  const popularDestinations = [
    { from: "Delhi", to: "Mumbai" },
    { from: "Bangalore", to: "Chennai" },
    { from: "Kolkata", to: "Delhi" },
    { from: "Mumbai", to: "Ahmedabad" },
    { from: "Chennai", to: "Hyderabad" },
  ]

  // Sample train data
  const sampleTrains: TrainType[] = [
    {
      id: "1",
      name: "Rajdhani Express",
      number: "12951",
      departureTime: "16:25",
      arrivalTime: "08:15",
      duration: "15h 50m",
      from: "Delhi",
      to: "Mumbai",
      price: {
        ordinary: 1245,
        firstClass: 2450,
      },
      seatsAvailable: {
        ordinary: 42,
        firstClass: 18,
      },
    },
    {
      id: "2",
      name: "Duronto Express",
      number: "12223",
      departureTime: "22:30",
      arrivalTime: "13:45",
      duration: "15h 15m",
      from: "Delhi",
      to: "Mumbai",
      price: {
        ordinary: 1190,
        firstClass: 2350,
      },
      seatsAvailable: {
        ordinary: 56,
        firstClass: 12,
      },
    },
    {
      id: "3",
      name: "Tejas Express",
      number: "22119",
      departureTime: "06:10",
      arrivalTime: "19:55",
      duration: "13h 45m",
      from: "Delhi",
      to: "Mumbai",
      price: {
        ordinary: 1345,
        firstClass: 2650,
      },
      seatsAvailable: {
        ordinary: 28,
        firstClass: 22,
      },
    },
    {
      id: "4",
      name: "Garib Rath Express",
      number: "12909",
      departureTime: "15:35",
      arrivalTime: "07:45",
      duration: "16h 10m",
      from: "Delhi",
      to: "Mumbai",
      price: {
        ordinary: 895,
        firstClass: 1950,
      },
      seatsAvailable: {
        ordinary: 84,
        firstClass: 26,
      },
    },
    {
      id: "5",
      name: "Sampark Kranti Express",
      number: "12907",
      departureTime: "11:25",
      arrivalTime: "04:10",
      duration: "16h 45m",
      from: "Delhi",
      to: "Mumbai",
      price: {
        ordinary: 1050,
        firstClass: 2150,
      },
      seatsAvailable: {
        ordinary: 62,
        firstClass: 14,
      },
    },
  ]

  // Handle form input changes
  const handleInputChange = (field: keyof TrainSearchFormData, value: any) => {
    setSearchFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle popular destination selection
  const handlePopularDestinationSelect = (from: string, to: string) => {
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
      // Filter trains based on search criteria
      const filteredTrains = sampleTrains.filter(
        (train) =>
          (searchFormData.from === "" || train.from.toLowerCase().includes(searchFormData.from.toLowerCase())) &&
          (searchFormData.to === "" || train.to.toLowerCase().includes(searchFormData.to.toLowerCase())),
      )

      setAvailableTrains(filteredTrains)
      setIsSearching(false)
      setSearchPerformed(true)
      setActiveTab("results")
    }, 1500)
  }

  // Handle train selection
  const handleSelectTrain = (train: TrainType) => {
    setSelectedTrain(train)
  }

  // Handle booking
  const handleBooking = () => {
    if (!selectedTrain || !searchFormData.date) return

    setIsBooking(true)

    // Simulate booking process
    setTimeout(() => {
      const price = searchFormData.class === "ordinary" ? selectedTrain.price.ordinary : selectedTrain.price.firstClass

      const totalPrice = price * searchFormData.passengers

      // Generate random booking ID
      const bookingId = `TR${Math.floor(100000 + Math.random() * 900000)}`

      setBookingDetails({
        train: selectedTrain,
        passengers: searchFormData.passengers,
        class: searchFormData.class,
        date: searchFormData.date,
        totalPrice,
        bookingId,
      })

      setIsBooking(false)
      setBookingConfirmed(true)
    }, 2000)
  }

  // Reset booking
  const handleNewBooking = () => {
    setSearchFormData({
      from: "",
      to: "",
      date: undefined,
      passengers: 1,
      class: "ordinary",
    })
    setSelectedTrain(null)
    setBookingConfirmed(false)
    setBookingDetails(null)
    setSearchPerformed(false)
    setAvailableTrains([])
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center">
          <Train className="mr-2 h-6 w-6" />
          Train Booking
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Book train tickets for your journey across India</p>
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
              <CardTitle>Search for Trains</CardTitle>
              <CardDescription>Enter your journey details to find available trains</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="Enter origin station"
                    value={searchFormData.from}
                    onChange={(e) => handleInputChange("from", e.target.value)}
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Enter destination station"
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
                  <Label>Travel Class</Label>
                  <RadioGroup
                    value={searchFormData.class}
                    onValueChange={(value) => handleInputChange("class", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ordinary" id="ordinary" />
                      <Label htmlFor="ordinary">Ordinary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="firstClass" id="firstClass" />
                      <Label htmlFor="firstClass">First Class</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Popular Routes</h4>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((dest, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePopularDestinationSelect(dest.from, dest.to)}
                      className="text-xs"
                    >
                      {dest.from} to {dest.to}
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
                    Search Trains
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Available Trains</CardTitle>
              <CardDescription>
                {searchFormData.from} to {searchFormData.to} on{" "}
                {searchFormData.date ? format(searchFormData.date, "PPP") : "selected date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableTrains.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Train</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableTrains.map((train) => (
                        <TableRow
                          key={train.id}
                          className={cn(selectedTrain?.id === train.id && "bg-rose-50 dark:bg-rose-950/20")}
                        >
                          <TableCell className="font-medium">
                            <div>{train.name}</div>
                            <div className="text-xs text-gray-500">{train.number}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{train.departureTime}</div>
                            <div className="text-xs text-gray-500">{train.from}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{train.arrivalTime}</div>
                            <div className="text-xs text-gray-500">{train.to}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {train.duration}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ₹{searchFormData.class === "ordinary" ? train.price.ordinary : train.price.firstClass}
                            </div>
                            <div className="text-xs text-gray-500">
                              {searchFormData.class === "ordinary" ? "Ordinary" : "First Class"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                searchFormData.class === "ordinary"
                                  ? train.seatsAvailable.ordinary > 20
                                    ? "outline"
                                    : "secondary"
                                  : train.seatsAvailable.firstClass > 10
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {searchFormData.class === "ordinary"
                                ? train.seatsAvailable.ordinary
                                : train.seatsAvailable.firstClass}{" "}
                              seats
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={selectedTrain?.id === train.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSelectTrain(train)}
                              className={
                                selectedTrain?.id === train.id
                                  ? "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                                  : ""
                              }
                            >
                              {selectedTrain?.id === train.id ? "Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No trains found for the selected route and date.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("search")}>
                Back to Search
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!selectedTrain}
                className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Book Now"
                )}
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
                      <h3 className="text-lg font-semibold mb-4">Train Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Train Name:</span>
                          <span className="font-medium">{bookingDetails.train.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Train Number:</span>
                          <span className="font-medium">{bookingDetails.train.number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Journey Date:</span>
                          <span className="font-medium">
                            {bookingDetails.date ? format(bookingDetails.date, "PPP") : ""}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Class:</span>
                          <span className="font-medium">
                            {bookingDetails.class === "ordinary" ? "Ordinary" : "First Class"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Journey Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">From:</span>
                          <span className="font-medium">{bookingDetails.train.from}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">To:</span>
                          <span className="font-medium">{bookingDetails.train.to}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Departure:</span>
                          <span className="font-medium">{bookingDetails.train.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Arrival:</span>
                          <span className="font-medium">{bookingDetails.train.arrivalTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="font-medium">{bookingDetails.train.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Passenger & Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Passengers:</span>
                          <span className="font-medium">
                            {bookingDetails.passengers} {bookingDetails.passengers === 1 ? "Person" : "People"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Price per ticket:</span>
                          <span className="font-medium">
                            ₹
                            {bookingDetails.class === "ordinary"
                              ? bookingDetails.train.price.ordinary
                              : bookingDetails.train.price.firstClass}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Convenience Fee:</span>
                          <span className="font-medium">₹25</span>
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
                          <span className="text-rose-600 dark:text-rose-400">₹{bookingDetails.totalPrice + 25}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Important Information</h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                      <li>• Please arrive at the station at least 30 minutes before departure.</li>
                      <li>• Carry a valid ID proof for all passengers during the journey.</li>
                      <li>• E-ticket along with ID proof is valid for the journey, no need to print.</li>
                      <li>• Cancellation is available up to 4 hours before the scheduled departure.</li>
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
    </div>
  )
}

