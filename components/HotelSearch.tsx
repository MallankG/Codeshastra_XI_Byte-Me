'use client';

import { useState } from 'react';
import hotelData from '@/fake_hotel_data.json';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  const handleSearch = () => {
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

    setFilteredHotels(results);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hotel Search</h1>
      <div className="flex flex-col gap-4 mb-6">
        <Input
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <div className="flex gap-4 items-center">
          <Input
            type="number"
            placeholder="Min Price"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {filteredHotels.length > 0 ? (
        <div className="grid gap-6">
          {filteredHotels.map(([hotelInfo, vendors], index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{hotelInfo.hotelName}</h2>
                <p className="text-sm text-gray-600">
                  {hotelInfo.city} | ⭐ {hotelInfo.rating} | Rooms: {hotelInfo.numRooms}
                </p>
                <p className="mt-2 text-sm">{hotelInfo.roomDetails}</p>
                <p className="text-sm mt-1">{hotelInfo.hotelDescription}</p>
                <p className="text-sm mt-2 font-medium">
                  Amenities: {hotelInfo.amenities.join(', ')}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {vendors.map((vendor, i) => {
                    const price = vendor[`price${i + 1}`];
                    const tax = vendor[`tax${i + 1}`];
                    const vendorName = vendor[`vendor${i + 1}`];

                    return price && vendorName ? (
                      <div key={i} className="bg-gray-100 p-2 rounded">
                        <p className="text-sm font-medium">{vendorName}</p>
                        <p className="text-sm">Price: ₹{price}</p>
                        <p className="text-sm">Tax: ₹{tax}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hotels found for the selected criteria.</p>
      )}
    </div>
  );
}
