"use client";

import { useState, useEffect } from "react";
import hotelData from "@/fake_hotel_data.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
} from "lucide-react";
import { Slider } from "./ui/slider";

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
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [filteredHotels, setFilteredHotels] = useState<HotelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    if (!priceRange) return;

    setIsLoading(true);
    setSearchPerformed(true);

    setTimeout(() => {
      const [maxSelectedPrice] = priceRange;

      const results = (hotelData as HotelEntry[])
        .filter(([hotelInfo]) =>
          hotelInfo.city.toLowerCase().includes(city.toLowerCase())
        )
        .filter(([_, vendors]) =>
          vendors.some((vendor, i) => {
            const price = vendor[`price${i + 1}`];
            return price && Number(price) <= maxSelectedPrice;
          })
        );

      const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "rating") {
          return b[0].rating - a[0].rating;
        } else {
          const lowestPriceA = Math.min(
            ...a[1].map((vendor, i) => {
              const price = vendor[`price${i + 1}`];
              return price ? Number(price) : Infinity;
            })
          );
          const lowestPriceB = Math.min(
            ...b[1].map((vendor, i) => {
              const price = vendor[`price${i + 1}`];
              return price ? Number(price) : Infinity;
            })
          );
          return lowestPriceA - lowestPriceB;
        }
      });

      setFilteredHotels(sortedResults);
      setIsLoading(false);
    }, 600);
  };

  // Get min and max price from data for slider
  useEffect(() => {
    let min = Infinity;
    let max = 0;

    (hotelData as HotelEntry[]).forEach(([_, vendors]) => {
      vendors.forEach((vendor, i) => {
        const price = vendor[`price${i + 1}`];
        if (price !== null) {
          const numPrice = Number(price);
          min = Math.min(min, numPrice);
          max = Math.max(max, numPrice);
        }
      });
    });

    min = Math.floor(min / 100) * 100;
    max = Math.ceil(max / 100) * 100;

    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
  }, []);

  const renderAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes("coffee") || lowerAmenity.includes("breakfast"))
      return <Coffee className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="bg-rose-600 dark:bg-rose-500 text-white p-6 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Find Your Perfect Stay
        </h1>
        <p className="opacity-90">
          Search and compare the best hotel deals across vendors
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium mb-1 block">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {minPrice !== null && maxPrice !== null && (
              <div className="col-span-1 md:col-span-3">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm md:text-md xl:text-xl font-medium">
                      Maximum Price: ₹{priceRange ? priceRange[0] : maxPrice}
                    </label>
                  </div>
                  <Slider
                    className="py-4"
                    min={minPrice}
                    max={maxPrice}
                    step={100}
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
              className="w-full sm:w-auto"
              disabled={isLoading || !priceRange}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Hotels
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ... rest of your hotel list rendering remains unchanged */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHotels.map(([hotelInfo, vendors], index) => {
            // Find best price
            const bestPrice = Math.min(
              ...vendors.map((vendor, i) => {
                const price = vendor[`price${i + 1}`];
                return price ? Number(price) : Infinity;
              })
            );

            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="bg-gray-100 md:w-1/3 h-48 md:h-auto flex items-center justify-center">
                    <Hotel className="w-20 h-20 text-gray-400" />                   
                  </div>

                  <div className="p-4 md:p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {hotelInfo.hotelName}
                        </h2>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{hotelInfo.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{hotelInfo.rating}</span>
                      </div>
                    </div>

                    <Tabs defaultValue="details" className="mt-4">
                      <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                        <TabsTrigger value="prices">Prices</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="text-sm mt-2">
                        <p>{hotelInfo.hotelDescription}</p>
                        <p className="mt-2 font-medium">
                          Room Details: {hotelInfo.roomDetails}
                        </p>
                        <p className="mt-1">
                          Number of Rooms: {hotelInfo.numRooms}
                        </p>
                      </TabsContent>

                      <TabsContent value="amenities" className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {hotelInfo.amenities.map((amenity, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {renderAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="prices" className="mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {vendors.map((vendor, i) => {
                            const price = vendor[`price${i + 1}`];
                            const tax = vendor[`tax${i + 1}`];
                            const vendorName = vendor[`vendor${i + 1}`];

                            return price && vendorName ? (
                              <div
                                key={i}
                                className={`p-3 rounded border ${
                                  Number(price) === bestPrice
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between">
                                  <p className="font-medium">{vendorName}</p>
                                  {Number(price) === bestPrice && (
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-600"
                                    >
                                      Best Deal
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <p className="text-xl font-bold">
                                    ₹{Number(price).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    +₹{tax} tax
                                  </p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                <CardFooter className="bg-gray-50 p-4 flex justify-end">
                  <Button>Book Now</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : searchPerformed ? (
        <Card className="p-8 text-center shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Search className="h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-medium">No hotels found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or price range
            </p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}