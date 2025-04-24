"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Search,
  RefreshCw,
  Hotel,
  Coffee,
  Wifi,
  Check,
  Calendar,
  User,
  Bed,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Slider } from "./ui/slider";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
type VendorInfo = {
  [key: string]: string | null;
};

type HotelInfo = {
  hotelName: string;
  hotelId: string;
  city: string;
  rating: number;
  numRooms: number;
  roomDetails: string;
  hotelDescription: string;
  amenities: string[];
};

type HotelEntry = [HotelInfo, VendorInfo[]];

export default function HotelSearch() {
  const [city, setCity] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Hard-coded city codes for common cities
  const cityCodes: {[key: string]: string} = {
    "paris": "PAR",
    "london": "LON",
    "new york": "NYC",
    "tokyo": "TYO",
    "delhi": "DEL",
    "mumbai": "BOM"
  };

  useEffect(() => {
    const min = 1000;
    const max = 70000;
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
  }, []);

  useEffect(() => {
    // Set city code based on city name
    const cityLower = city.toLowerCase();
    if (cityCodes[cityLower]) {
      setCityCode(cityCodes[cityLower]);
    } else {
      // Default to empty or prompt user to select a valid city
      setCityCode("");
    }
  }, [city]);

  const handleSearch = async () => {
    if (!priceRange || !cityCode) {
      setErrorMessage(cityCode ? "Please set a price range." : "Please enter a valid city name.");
      return;
    }
    
    setIsLoading(true);
    setSearchPerformed(true);
    setErrorMessage("");

    try {
      // First, get the hotel list by city
      const hotelListUrl = `/api/amadeus/hotel-list?cityCode=${cityCode}`;
      
      const hotelsResponse = await fetch(hotelListUrl);
      
      if (!hotelsResponse.ok) {
        throw new Error(`Hotel search failed with status: ${hotelsResponse.status}`);
      }
      
      const hotelsData = await hotelsResponse.json();
      
      if (!hotelsData.data || !Array.isArray(hotelsData.data)) {
        setFilteredHotels([]);
        setErrorMessage("No hotels found for this city");
        setIsLoading(false);
        return;
      }
      
      // Get hotel IDs from the response
      const hotelIds = hotelsData.data.slice(0, 5).map((hotel: any) => hotel.hotelId).join(",");
      
      // Now get offers for these hotels using the selected dates and occupancy
      const formattedCheckInDate = format(checkInDate, 'yyyy-MM-dd');
      const formattedCheckOutDate = format(checkOutDate, 'yyyy-MM-dd');
      
      const offersRequestBody = {
        hotelIds,
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        adults,
        children
      };
      
      const offersResponse = await fetch('/api/amadeus/hotel-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offersRequestBody),
      });
      
      if (!offersResponse.ok) {
        throw new Error(`Hotel offers fetch failed with status: ${offersResponse.status}`);
      }
      
      const offersData = await offersResponse.json();
      
      // Process and display hotel offers
      if (offersData.data && Array.isArray(offersData.data)) {
        const processedHotels = offersData.data.map((hotel: any) => {
          // Extract relevant hotel information
          return {
            name: hotel.hotel?.name || "Unknown Hotel",
            id: hotel.hotel?.hotelId,
            cityCode: cityCode,
            offers: hotel.offers || [],
            // Add more fields as needed
          };
        });
        
        setFilteredHotels(processedHotels);
      } else {
        setFilteredHotels([]);
        setErrorMessage("No offers available for hotels in this city");
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Failed to fetch data'}`);
      setFilteredHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate nights between two dates
  const calculateNights = () => {
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to handle adult count changes
  const handleAdultChange = (value: string) => {
    setAdults(parseInt(value));
  };

  // Function to handle children count changes
  const handleChildrenChange = (value: string) => {
    setChildren(parseInt(value));
  };

  // Total occupants
  const totalOccupants = adults + children;

  // Sort hotels based on selected criteria
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "price") {
      const priceA = a.offers[0]?.price?.total || 0;
      const priceB = b.offers[0]?.price?.total || 0;
      return parseFloat(priceA) - parseFloat(priceB);
    } else {
      // Rating sorting (if available in your data)
      return 0; // Placeholder
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white p-6 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Find Your Perfect Stay
        </h1>
        <p className="opacity-90">
          Search and compare the best hotel deals across vendors
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="col-span-1 md:col-span-6">
              <label className="text-sm font-medium mb-1 block">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Enter city name (Paris, London, New York, Tokyo, Delhi, Mumbai)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              {cityCode && <p className="text-xs text-gray-500 mt-1">City code: {cityCode}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Check-in Date</label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(checkInDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => date && setCheckInDate(date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Check-out Date</label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(checkOutDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => date && setCheckOutDate(date)}
                      initialFocus
                      disabled={(date) => date <= checkInDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Guests</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Adults</label>
                  <Select value={adults.toString()} onValueChange={handleAdultChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Adults" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={`adult-${num}`} value={num.toString()}>
                          {num} {num === 1 ? 'Adult' : 'Adults'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Children</label>
                  <Select value={children.toString()} onValueChange={handleChildrenChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Children" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={`child-${num}`} value={num.toString()}>
                          {num} {num === 1 ? 'Child' : 'Children'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {minPrice !== null && maxPrice !== null && (
              <div className="col-span-1 md:col-span-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm md:text-md font-medium">
                      Maximum Price per Night: ₹{priceRange ? priceRange[0] : maxPrice}
                    </label>
                  </div>
                  <Slider
                    className="py-4"
                    min={minPrice}
                    max={maxPrice}
                    step={500}
                    value={priceRange ? [priceRange[0]] : [maxPrice]}
                    onValueChange={(value) =>
                      setPriceRange([value[0], maxPrice])
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹{minPrice}</span>
                    <span>₹{maxPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="inline-flex rounded-md border border-gray-200 shadow-sm">
                <Button
                  variant={sortBy === "price" ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setSortBy("price")}
                >
                  Price
                </Button>
                <Button
                  variant={sortBy === "rating" ? "default" : "outline"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setSortBy("rating")}
                >
                  Rating
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700"
              disabled={isLoading || !priceRange || !cityCode}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Hotels
            </Button>
          </div>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Display hotel results */}
      {searchPerformed && !isLoading && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center">
            <Hotel className="mr-2 h-5 w-5 text-rose-600" />
            {filteredHotels.length > 0 
              ? `${filteredHotels.length} Hotels Found` 
              : "No hotels found matching your criteria"}
          </h2>
          
          {sortedHotels.map((hotel, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <img 
                src="https://tse2.mm.bing.net/th?id=OIP.hZnAYhbuwZqXD2SWMIX-MAHaEm&pid=Api&P=0&h=180" 
                alt="Hotel" 
                className="w-full h-full object-cover"
          />
                <div className="md:col-span-1 h-48 overflow-hidden">
                  <img 
                    src={`/api/placeholder/400/320?text=${encodeURIComponent(hotel.name)}`} 
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hotel Details */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{hotel.cityCode}</span>
                        <div className="ml-3 flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star 
                              key={star} 
                              className="w-4 h-4" 
                              fill="#FFD700" 
                              color="#FFD700" 
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Amenities - placeholders */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Wifi className="w-3 h-3" /> WiFi
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Coffee className="w-3 h-3" /> Breakfast
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Bed className="w-3 h-3" /> King Size Bed
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Price and Booking */}
                    {hotel.offers && hotel.offers.length > 0 && (
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-500">Per night</span>
                          <p className="font-bold text-2xl text-rose-600">
                            {hotel.offers[0].price?.currency || '₹'} {hotel.offers[0].price?.total || 'N/A'}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {hotel.offers[0].room?.typeEstimated?.category || 'Standard Room'}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" /> {totalOccupants} guest{totalOccupants !== 1 ? 's' : ''} • {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                          </span>
                        </p>
                        <Button className="bg-rose-600 hover:bg-rose-700">View Details</Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Room Details */}
                  {hotel.offers && hotel.offers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Room Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <span className="font-medium">{hotel.offers[0].room?.typeEstimated?.category || 'Standard Room'}</span>
                            <span className="text-rose-600 font-bold">{hotel.offers[0].price?.currency || '₹'} {hotel.offers[0].price?.total || 'N/A'}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" /> 
                              <span>{adults} Adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children !== 1 ? 'ren' : ''}` : ''}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" /> 
                              <span>{format(checkInDate, 'dd MMM')} - {format(checkOutDate, 'dd MMM')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}