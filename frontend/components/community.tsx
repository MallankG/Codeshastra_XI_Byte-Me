"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Globe, MessageSquare, MapPin, Camera, Compass, Heart, X, Check, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Community = {
  id: string
  title: string
  description: string
  members: number
  icon: React.ReactNode
  category: string
  isEvent?: boolean
  eventDate?: string
  joined: boolean
}

export function Community() {
  const [activeTab, setActiveTab] = useState("forums")
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null)
  const [showJoinedTab, setShowJoinedTab] = useState(false)
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: "backpackers",
      title: "Backpackers Hub",
      description: "Connect with budget travelers and share tips for backpacking around the world.",
      members: 12453,
      icon: <Globe className="h-5 w-5" />,
      category: "forums",
      joined: false,
    },
    {
      id: "luxury",
      title: "Luxury Travel Enthusiasts",
      description: "Discuss premium travel experiences, high-end resorts, and exclusive destinations.",
      members: 8765,
      icon: <Heart className="h-5 w-5" />,
      category: "forums",
      joined: false,
    },
    {
      id: "adventure",
      title: "Adventure Seekers",
      description: "For those who love hiking, trekking, and outdoor adventures around the globe.",
      members: 15234,
      icon: <Compass className="h-5 w-5" />,
      category: "forums",
      joined: false,
    },
    {
      id: "solo",
      title: "Solo Travelers",
      description: "A supportive community for those who travel alone and want to connect with others.",
      members: 9876,
      icon: <Users className="h-5 w-5" />,
      category: "groups",
      joined: false,
    },
    {
      id: "family",
      title: "Family Vacations",
      description: "Share tips and experiences for traveling with children of all ages.",
      members: 7654,
      icon: <Users className="h-5 w-5" />,
      category: "groups",
      joined: false,
    },
    {
      id: "digital",
      title: "Digital Nomads",
      description: "For remote workers who travel while working and want to share advice.",
      members: 11234,
      icon: <Users className="h-5 w-5" />,
      category: "groups",
      joined: false,
    },
    {
      id: "nyc",
      title: "Travel Meetup - New York",
      description: "Monthly gathering of travel enthusiasts in NYC to share stories and tips.",
      members: 345,
      icon: <MapPin className="h-5 w-5" />,
      category: "events",
      isEvent: true,
      eventDate: "May 15, 2025",
      joined: false,
    },
    {
      id: "bali",
      title: "Photography Workshop - Bali",
      description: "Learn travel photography skills in one of the most beautiful destinations.",
      members: 123,
      icon: <MapPin className="h-5 w-5" />,
      category: "events",
      isEvent: true,
      eventDate: "June 10-15, 2025",
      joined: false,
    },
    {
      id: "tokyo",
      title: "Foodie Tour - Tokyo",
      description: "Explore the culinary delights of Tokyo with fellow food lovers.",
      members: 234,
      icon: <MapPin className="h-5 w-5" />,
      category: "events",
      isEvent: true,
      eventDate: "July 5-10, 2025",
      joined: false,
    },
    {
      id: "landscape",
      title: "Landscape Photography",
      description: "Share your best landscape photos from around the world.",
      members: 8765,
      icon: <Camera className="h-5 w-5" />,
      category: "photos",
      joined: false,
    },
    {
      id: "street",
      title: "Street Photography",
      description: "Capture the essence of cities and cultures through street photography.",
      members: 6543,
      icon: <Camera className="h-5 w-5" />,
      category: "photos",
      joined: false,
    },
    {
      id: "wildlife",
      title: "Wildlife Photography",
      description: "Share photos of animals and wildlife from your travels.",
      members: 5432,
      icon: <Camera className="h-5 w-5" />,
      category: "photos",
      joined: false,
    },
  ])

  // Check if any communities are joined
  useEffect(() => {
    const hasJoinedCommunities = communities.some((community) => community.joined)
    setShowJoinedTab(hasJoinedCommunities)
  }, [communities])

  const handleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, joined: true, members: community.members + 1 } : community,
      ),
    )

    const community = communities.find((c) => c.id === communityId)
    if (community) {
      setJoinSuccess(community.title)
      setTimeout(() => setJoinSuccess(null), 3000)
    }
  }

  const handleLeaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId ? { ...community, joined: false, members: community.members - 1 } : community,
      ),
    )
  }

  const getFilteredCommunities = (category: string) => {
    return communities.filter((community) => community.category === category)
  }

  const getJoinedCommunities = () => {
    return communities.filter((community) => community.joined)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Travel Community
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect with fellow travelers, share experiences, and get inspired
          </p>
        </div>
      </div>

      <Tabs defaultValue="forums" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {showJoinedTab && (
            <TabsTrigger value="joined" className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              My Communities
              <Badge className="ml-2 bg-rose-600 hover:bg-rose-700">{getJoinedCommunities().length}</Badge>
            </TabsTrigger>
          )}
          <TabsTrigger value="forums" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Forums
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>

        {showJoinedTab && (
          <TabsContent value="joined" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getJoinedCommunities().length > 0 ? (
              getJoinedCommunities().map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onJoin={() => handleJoinCommunity(community.id)}
                  onLeave={() => handleLeaveCommunity(community.id)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No communities joined yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Join communities to see them listed here</p>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="forums" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getFilteredCommunities("forums").map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={() => handleJoinCommunity(community.id)}
              onLeave={() => handleLeaveCommunity(community.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="groups" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getFilteredCommunities("groups").map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={() => handleJoinCommunity(community.id)}
              onLeave={() => handleLeaveCommunity(community.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="events" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getFilteredCommunities("events").map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={() => handleJoinCommunity(community.id)}
              onLeave={() => handleLeaveCommunity(community.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="photos" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getFilteredCommunities("photos").map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={() => handleJoinCommunity(community.id)}
              onLeave={() => handleLeaveCommunity(community.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {joinSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg animate-in slide-in-from-right">
          Successfully joined {joinSuccess}!
        </div>
      )}
    </div>
  )
}

interface CommunityCardProps {
  community: Community
  onJoin: () => void
  onLeave: () => void
}

function CommunityCard({ community, onJoin, onLeave }: CommunityCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onJoin()
    setIsOpen(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-rose-100 dark:bg-rose-900 p-2 rounded-full text-rose-600 dark:text-rose-300">
              {community.icon}
            </div>
            <CardTitle>{community.title}</CardTitle>
          </div>
          {community.joined && <Badge className="bg-green-600 hover:bg-green-700">Joined</Badge>}
        </div>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users className="h-4 w-4 mr-1" />
          {community.members.toLocaleString()} members
          {community.isEvent && community.eventDate && (
            <div className="ml-4 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {community.eventDate}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {community.joined ? (
          <Button
            variant="outline"
            className="w-full border-rose-600 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:text-rose-500 dark:hover:bg-rose-950"
            onClick={onLeave}
          >
            <X className="h-4 w-4 mr-2" />
            Leave Community
          </Button>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800">
                <UserPlus className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join {community.title}</DialogTitle>
                <DialogDescription>
                  Fill out the form below to join this community and connect with fellow travelers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                  >
                    Join Now
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}

