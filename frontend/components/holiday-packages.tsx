"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronDown, Filter, MapPin, Search, SlidersHorizontal, Star } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface HolidayPackage {
  id: string
  destination: string
  hotel: string
  duration: string
  pricePerPerson: string
  numericPrice: number
  rating: number
  features: string[]
  images: string[]
  tag?: string
  category: string
}

export function HolidayPackages() {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [sortBy, setSortBy] = useState("recommended")
  const [filteredPackages, setFilteredPackages] = useState<HolidayPackage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [packagesPerPage] = useState(6)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<HolidayPackage | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Memoize the holiday packages data to prevent recreation on each render
  const holidayPackages = useMemo(
    () => [
      {
        id: "1",
        destination: "Bali, Indonesia",
        hotel: "Ubud Tropical Resort",
        duration: "5 Nights / 6 Days",
        pricePerPerson: "₹45,999",
        numericPrice: 45999,
        rating: 4.8,
        features: ["All meals included", "Private pool villa", "Airport transfers", "Spa treatment"],
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tag: "Most Popular",
        category: "Beach",
      },
      {
        id: "2",
        destination: "Manali, India",
        hotel: "Snow Valley Resort",
        duration: "3 Nights / 4 Days",
        pricePerPerson: "₹17,999",
        numericPrice: 17999,
        rating: 4.5,
        features: ["Free breakfast", "Airport pickup", "Mountain view", "Adventure activities"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        tag: "Best Seller",
        category: "Mountain",
      },
      {
        id: "3",
        destination: "Paris, France",
        hotel: "Le Grand Hotel",
        duration: "4 Nights / 5 Days",
        pricePerPerson: "₹89,999",
        numericPrice: 89999,
        rating: 4.9,
        features: ["Eiffel Tower view", "Gourmet breakfast", "City tour included", "Luxury suite"],
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tag: "Luxury",
        category: "City",
      },
      {
        id: "4",
        destination: "Goa, India",
        hotel: "Beachside Paradise",
        duration: "4 Nights / 5 Days",
        pricePerPerson: "₹22,999",
        numericPrice: 22999,
        rating: 4.3,
        features: ["Beach access", "Breakfast included", "Water sports", "Evening entertainment"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        category: "Beach",
      },
      {
        id: "5",
        destination: "Bangkok, Thailand",
        hotel: "Urban Oasis Hotel",
        duration: "3 Nights / 4 Days",
        pricePerPerson: "₹29,999",
        numericPrice: 29999,
        rating: 4.4,
        features: ["Rooftop pool", "City tour", "Airport transfers", "Shopping discounts"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        tag: "Limited Offer",
        category: "City",
      },
      {
        id: "6",
        destination: "Shimla, India",
        hotel: "Pine View Resort",
        duration: "2 Nights / 3 Days",
        pricePerPerson: "₹14,999",
        numericPrice: 14999,
        rating: 4.2,
        features: ["Mountain views", "Bonfire nights", "Breakfast included", "Guided treks"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        category: "Mountain",
      },
      {
        id: "7",
        destination: "Maldives",
        hotel: "Ocean Paradise Resort",
        duration: "6 Nights / 7 Days",
        pricePerPerson: "₹1,25,999",
        numericPrice: 125999,
        rating: 4.9,
        features: ["Overwater villa", "All-inclusive", "Private beach", "Snorkeling trips"],
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tag: "Premium",
        category: "Beach",
      },
      {
        id: "8",
        destination: "Dubai, UAE",
        hotel: "Desert Rose Hotel",
        duration: "5 Nights / 6 Days",
        pricePerPerson: "₹75,999",
        numericPrice: 75999,
        rating: 4.7,
        features: ["Desert safari", "Burj Khalifa tickets", "Half-board meals", "City tour"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        tag: "Trending",
        category: "City",
      },
      {
        id: "9",
        destination: "Darjeeling, India",
        hotel: "Himalayan Retreat",
        duration: "3 Nights / 4 Days",
        pricePerPerson: "₹19,999",
        numericPrice: 19999,
        rating: 4.4,
        features: ["Tea garden tour", "Breakfast included", "Mountain views", "Toy train ride"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        category: "Mountain",
      },
      {
        id: "10",
        destination: "Singapore",
        hotel: "Marina Bay Resort",
        duration: "4 Nights / 5 Days",
        pricePerPerson: "₹65,999",
        numericPrice: 65999,
        rating: 4.6,
        features: ["Universal Studios tickets", "Airport transfers", "City tour", "Breakfast included"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        category: "City",
      },
      {
        id: "11",
        destination: "Phuket, Thailand",
        hotel: "Beachfront Luxury Resort",
        duration: "5 Nights / 6 Days",
        pricePerPerson: "₹55,999",
        numericPrice: 55999,
        rating: 4.7,
        features: ["Private beach access", "Island hopping tour", "All meals", "Spa treatment"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        tag: "Hot Deal",
        category: "Beach",
      },
      {
        id: "12",
        destination: "Munnar, India",
        hotel: "Green Valley Resort",
        duration: "3 Nights / 4 Days",
        pricePerPerson: "₹18,999",
        numericPrice: 18999,
        rating: 4.3,
        features: ["Tea plantation tour", "Breakfast included", "Nature walks", "Spice garden visit"],
        images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
        category: "Mountain",
      },
    ],
    [],
  )

  // Get unique destinations for filter
  const destinations = Array.from(new Set(holidayPackages.map((pkg) => pkg.destination)))

  // Filter and sort packages
  useEffect(() => {
    let result = [...holidayPackages]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (pkg) => pkg.destination.toLowerCase().includes(query) || pkg.hotel.toLowerCase().includes(query),
      )
    }

    // Filter by destination
    if (selectedDestination) {
      result = result.filter((pkg) => pkg.destination === selectedDestination)
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((pkg) => pkg.category === selectedCategory)
    }

    // Filter by price range
    result = result.filter((pkg) => pkg.numericPrice >= priceRange[0] && pkg.numericPrice <= priceRange[1])

    // Sort packages
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.numericPrice - b.numericPrice)
        break
      case "price-high":
        result.sort((a, b) => b.numericPrice - a.numericPrice)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "duration":
        result.sort((a, b) => {
          const daysA = Number.parseInt(a.duration.split(" / ")[1].split(" ")[0])
          const daysB = Number.parseInt(b.duration.split(" / ")[1].split(" ")[0])
          return daysB - daysA
        })
        break
      default:
        // Recommended - no specific sort, maybe prioritize tagged items
        result.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0))
    }

    setFilteredPackages(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedDestination, selectedCategory, priceRange, sortBy])

  // Pagination logic
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage)
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)

  // Format price range for display
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Holiday Packages</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover our curated selection of holiday packages for your next adventure
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search destinations or hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort by:{" "}
                  {sortBy === "recommended"
                    ? "Recommended"
                    : sortBy === "price-low"
                      ? "Price: Low to High"
                      : sortBy === "price-high"
                        ? "Price: High to Low"
                        : sortBy === "rating"
                          ? "Rating"
                          : "Duration"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("recommended")}>
                  Recommended
                  {sortBy === "recommended" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                  Price: Low to High
                  {sortBy === "price-low" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                  Price: High to Low
                  {sortBy === "price-high" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Rating
                  {sortBy === "rating" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("duration")}>
                  Duration
                  {sortBy === "duration" && <Check className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Destination</label>
                    <Select
                      value={selectedDestination || ""}
                      onValueChange={(value) => setSelectedDestination(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All destinations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All destinations</SelectItem>
                        {destinations.map((destination) => (
                          <SelectItem key={destination} value={destination}>
                            {destination}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="City">City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </label>
                    <Slider
                      defaultValue={[0, 150000]}
                      min={0}
                      max={150000}
                      step={5000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedDestination(null)
                      setSelectedCategory("all")
                      setPriceRange([0, 150000])
                      setSortBy("recommended")
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="Beach">Beach Getaways</TabsTrigger>
          <TabsTrigger value="Mountain">Mountain Escapes</TabsTrigger>
          <TabsTrigger value="City">City Breaks</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">Showing {filteredPackages.length} packages</div>

      {/* Package Cards Grid */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentPackages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} onViewDetails={() => setSelectedPackage(pkg)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg font-medium">No packages found matching your criteria</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your filters or search query</p>
          <Button
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setSelectedDestination(null)
              setSelectedCategory("all")
              setPriceRange([0, 150000])
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Package Details Dialog */}
      <Dialog
        open={!!selectedPackage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPackage(null)
            setActiveImageIndex(0)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedPackage && (
            <>
              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={selectedPackage.images[activeImageIndex] || "/placeholder.svg"}
                  alt={selectedPackage.hotel}
                  fill
                  className="object-cover"
                />

                {/* Image Navigation */}
                {selectedPackage.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {selectedPackage.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          activeImageIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Tag Badge */}
                {selectedPackage.tag && (
                  <Badge className="absolute top-4 left-4 bg-primary hover:bg-primary/90">{selectedPackage.tag}</Badge>
                )}
              </div>

              <ScrollArea className="flex-1 px-1">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedPackage.hotel}</h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{selectedPackage.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{selectedPackage.pricePerPerson}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">per person</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedPackage.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < selectedPackage.rating
                                  ? "text-yellow-400 fill-yellow-400 opacity-50"
                                  : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{selectedPackage.rating}</span>
                    </div>

                    <Badge variant="outline" className="text-sm">
                      {selectedPackage.duration}
                    </Badge>

                    <Badge variant="outline" className="text-sm">
                      {selectedPackage.category}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Package Highlights</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Package Description</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Experience an unforgettable holiday in {selectedPackage.destination} at the beautiful{" "}
                      {selectedPackage.hotel}. This {selectedPackage.duration.toLowerCase()} package includes
                      comfortable accommodation, delicious meals, and exciting activities to make your stay memorable.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">What's Included</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Accommodation</h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedPackage.duration.split(" / ")[0]} at {selectedPackage.hotel} in{" "}
                          {selectedPackage.destination}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Meals</h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedPackage.features.some((f) => f.includes("breakfast"))
                            ? "Breakfast included"
                            : "As per package selection"}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Transfers</h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedPackage.features.some((f) => f.includes("pickup") || f.includes("transfer"))
                            ? "Airport transfers included"
                            : "Available at additional cost"}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Activities</h5>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedPackage.features.some(
                            (f) => f.includes("tour") || f.includes("activities") || f.includes("sports"),
                          )
                            ? "Selected activities included"
                            : "Optional activities available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{selectedPackage.pricePerPerson}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">per person</div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setSelectedPackage(null)}>
                    Back to Packages
                  </Button>
                  <Button className="flex-1 sm:flex-initial">Book Now</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface PackageCardProps {
  package: HolidayPackage
  onViewDetails: () => void
}

function PackageCard({ package: pkg, onViewDetails }: PackageCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={pkg.images[0] || "/placeholder.svg"} alt={pkg.hotel} fill className="object-cover" />

        {/* Tag Badge */}
        {pkg.tag && <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90">{pkg.tag}</Badge>}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{pkg.hotel}</h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{pkg.destination}</span>
            </div>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(pkg.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < pkg.rating
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <Badge variant="outline" className="mb-2">
          {pkg.duration}
        </Badge>

        <div className="space-y-1 mt-2">
          {pkg.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <Check className="h-3 w-3 mr-2 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
          {pkg.features.length > 3 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">+{pkg.features.length - 3} more features</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-2">
        <div>
          <div className="text-xl font-bold text-primary">{pkg.pricePerPerson}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">per person</div>
        </div>
        <Button onClick={onViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  )
}

