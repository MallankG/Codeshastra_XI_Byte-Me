// 'use client';

// import { useState } from 'react';
// import hotelData from '@/fake_hotel_data.json';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// // Types
// type VendorInfo = {
//   [key: string]: string | null;
// };

// type HotelInfo = {
//   hotelName: string;
//   hotelId: string;
//   city: string;
//   rating: number;
//   numRooms: number;
//   roomDetails: string;
//   hotelDescription: string;
//   amenities: string[];
// };

// type HotelEntry = [HotelInfo, VendorInfo[]];

// export default function HotelSearch() {
//   const [city, setCity] = useState('');
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
//   const [filteredHotels, setFilteredHotels] = useState<HotelEntry[]>([]);

//   const handleSearch = () => {
//     const results = (hotelData as HotelEntry[])
//       .filter(([hotelInfo]) =>
//         hotelInfo.city.toLowerCase().includes(city.toLowerCase())
//       )
//       .filter(([_, vendors]) =>
//         vendors.some((vendor, i) => {
//           const price = vendor[`price${i + 1}`];
//           return (
//             price !== null &&
//             Number(price) >= priceRange[0] &&
//             Number(price) <= priceRange[1]
//           );
//         })
//       );

//     setFilteredHotels(results);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Hotel Search</h1>
//       <div className="flex flex-col gap-4 mb-6">
//         <Input
//           placeholder="Enter city name"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//         />
//         <div className="flex gap-4 items-center">
//           <Input
//             type="number"
//             placeholder="Min Price"
//             value={priceRange[0]}
//             onChange={(e) =>
//               setPriceRange([Number(e.target.value), priceRange[1]])
//             }
//           />
//           <Input
//             type="number"
//             placeholder="Max Price"
//             value={priceRange[1]}
//             onChange={(e) =>
//               setPriceRange([priceRange[0], Number(e.target.value)])
//             }
//           />
//         </div>
//         <Button onClick={handleSearch}>Search</Button>
//       </div>

//       {filteredHotels.length > 0 ? (
//         <div className="grid gap-6">
//           {filteredHotels.map(([hotelInfo, vendors], index) => (
//             <Card key={index} className="shadow-md">
//               <CardContent className="p-4">
//                 <h2 className="text-xl font-semibold">{hotelInfo.hotelName}</h2>
//                 <p className="text-sm text-gray-600">
//                   {hotelInfo.city} | ⭐ {hotelInfo.rating} | Rooms: {hotelInfo.numRooms}
//                 </p>
//                 <p className="mt-2 text-sm">{hotelInfo.roomDetails}</p>
//                 <p className="text-sm mt-1">{hotelInfo.hotelDescription}</p>
//                 <p className="text-sm mt-2 font-medium">
//                   Amenities: {hotelInfo.amenities.join(', ')}
//                 </p>
//                 <div className="mt-4 grid grid-cols-2 gap-2">
//                   {vendors.map((vendor, i) => {
//                     const price = vendor[`price${i + 1}`];
//                     const tax = vendor[`tax${i + 1}`];
//                     const vendorName = vendor[`vendor${i + 1}`];

//                     return price && vendorName ? (
//                       <div key={i} className="bg-gray-100 p-2 rounded">
//                         <p className="text-sm font-medium">{vendorName}</p>
//                         <p className="text-sm">Price: ₹{price}</p>
//                         <p className="text-sm">Tax: ₹{tax}</p>
//                       </div>
//                     ) : null;
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-600">No hotels found for the selected criteria.</p>
//       )}
//     </div>
//   );
// }





'use client';

import { useState, useEffect } from 'react';
import hotelData from '@/fake_hotel_data.json';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Search, RefreshCw, Hotel, Coffee, Wifi, Check } from "lucide-react";

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
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [filteredHotels, setFilteredHotels] = useState<HotelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setSearchPerformed(true);

    // Simulate loading for better UX
    setTimeout(() => {
      const results = (hotelData as HotelEntry[])
        .filter(([hotelInfo]) =>
          hotelInfo.city.toLowerCase().includes(city.toLowerCase())
        )
        .filter(([_, vendors]) =>
          vendors.some((vendor, i) => {
            const price = vendor[`price${i + 1}`];
            return (
              price !== null &&
              Number(price) >= priceRange[0] &&
              Number(price) <= priceRange[1]
            );
          })
        );

      // Sort results
      const sortedResults = [...results].sort((a, b) => {
        if (sortBy === 'rating') {
          return b[0].rating - a[0].rating;
        } else {
          // Get lowest price for each hotel
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
    let minPrice = Infinity;
    let maxPrice = 0;

    (hotelData as HotelEntry[]).forEach(([_, vendors]) => {
      vendors.forEach((vendor, i) => {
        const price = vendor[`price${i + 1}`];
        if (price !== null) {
          const numPrice = Number(price);
          minPrice = Math.min(minPrice, numPrice);
          maxPrice = Math.max(maxPrice, numPrice);
        }
      });
    });

    // Round for nicer values
    minPrice = Math.floor(minPrice / 100) * 100;
    maxPrice = Math.ceil(maxPrice / 100) * 100;

    setPriceRange([minPrice, maxPrice]);
  }, []);

  // Render amenity icon based on name
  const renderAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes('coffee') || lowerAmenity.includes('breakfast')) return <Coffee className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Stay</h1>
        <p className="opacity-90">Search and compare the best hotel deals across vendors</p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium mb-1 block">Destination</label>
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
            
            <div className="col-span-1 md:col-span-3">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Price Range (₹{priceRange[0]} - ₹{priceRange[1]})</label>
                </div>
                <Slider
                  className="py-4"
                  defaultValue={priceRange}
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹10,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="inline-flex rounded-md border border-gray-200 shadow-sm">
                <Button 
                  variant={sortBy === 'price' ? "default" : "outline"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setSortBy('price')}
                >
                  Price
                </Button>
                <Button 
                  variant={sortBy === 'rating' ? "default" : "outline"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setSortBy('rating')}
                >
                  Rating
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="w-full sm:w-auto"
              disabled={isLoading}
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

      {searchPerformed && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {isLoading ? 'Searching...' : 
              filteredHotels.length > 0 ? 
                `Found ${filteredHotels.length} hotels in ${city || 'all cities'}` : 
                'No hotels found for the selected criteria.'
            }
          </h2>
        </div>
      )}

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
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="bg-gray-100 md:w-1/3 h-48 md:h-auto flex items-center justify-center">
                    <Hotel className="w-20 h-20 text-gray-400" />
                  </div>
                  
                  <div className="p-4 md:p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{hotelInfo.hotelName}</h2>
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
                        <p className="mt-2 font-medium">Room Details: {hotelInfo.roomDetails}</p>
                        <p className="mt-1">Number of Rooms: {hotelInfo.numRooms}</p>
                      </TabsContent>
                      
                      <TabsContent value="amenities" className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {hotelInfo.amenities.map((amenity, i) => (
                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
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
                                  Number(price) === bestPrice ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <div className="flex justify-between">
                                  <p className="font-medium">{vendorName}</p>
                                  {Number(price) === bestPrice && (
                                    <Badge variant="outline" className="text-green-600 border-green-600">Best Deal</Badge>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <p className="text-xl font-bold">₹{Number(price).toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">+₹{tax} tax</p>
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
            <p className="text-gray-500">Try adjusting your search criteria or price range</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}