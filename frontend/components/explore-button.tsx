"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, Sparkles } from "lucide-react"
import Image from "next/image"

export function ExploreButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white">
          <Sparkles className="mr-2 h-4 w-4" />
          Explore
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Compass className="mr-2 h-6 w-6" />
            Explore Amazing Destinations
          </DialogTitle>
          <DialogDescription>
            Discover trending destinations and special experiences for your next adventure
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="trending">
          <TabsList className="mb-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="deals">Best Deals</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DestinationCard
              title="Santorini, Greece"
              image="/placeholder.svg?height=200&width=300"
              description="Iconic white buildings with blue domes overlooking the Aegean Sea"
              price="$1,299"
            />
            <DestinationCard
              title="Bali, Indonesia"
              image="/placeholder.svg?height=200&width=300"
              description="Tropical paradise with beaches, temples, and lush rice terraces"
              price="$899"
            />
            <DestinationCard
              title="Kyoto, Japan"
              image="/placeholder.svg?height=200&width=300"
              description="Ancient temples, traditional gardens, and cherry blossoms"
              price="$1,499"
            />
          </TabsContent>

          <TabsContent value="experiences" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DestinationCard
              title="Northern Lights Tour"
              image="/placeholder.svg?height=200&width=300"
              description="Witness the magical aurora borealis in Iceland or Norway"
              price="$1,899"
            />
            <DestinationCard
              title="Safari Adventure"
              image="/placeholder.svg?height=200&width=300"
              description="Experience wildlife up close in Kenya's Maasai Mara"
              price="$2,499"
            />
            <DestinationCard
              title="Cooking in Tuscany"
              image="/placeholder.svg?height=200&width=300"
              description="Learn authentic Italian cooking in the heart of Tuscany"
              price="$1,299"
            />
          </TabsContent>

          <TabsContent value="deals" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DestinationCard
              title="Phuket, Thailand"
              image="/placeholder.svg?height=200&width=300"
              description="Beautiful beaches and vibrant nightlife at a great value"
              price="$699"
              discount="30% OFF"
            />
            <DestinationCard
              title="Cancun, Mexico"
              image="/placeholder.svg?height=200&width=300"
              description="All-inclusive resorts and Caribbean beaches"
              price="$799"
              discount="25% OFF"
            />
            <DestinationCard
              title="Istanbul, Turkey"
              image="/placeholder.svg?height=200&width=300"
              description="Where East meets West - explore bazaars and historic sites"
              price="$599"
              discount="40% OFF"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface DestinationCardProps {
  title: string
  image: string
  description: string
  price: string
  discount?: string
}

function DestinationCard({ title, image, description, price, discount }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {discount && (
          <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="font-bold text-rose-600 dark:text-rose-400">{price}</div>
        <Button size="sm" className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

