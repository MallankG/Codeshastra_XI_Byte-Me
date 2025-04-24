"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import io, { type Socket } from "socket.io-client"
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

// Add these animation styles
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  .pulse-dot {
    animation: pulse 2s infinite;
  }
  
  .hover-scale {
    transition: transform 0.3s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .hover-rotate:hover {
    transform: rotate(5deg);
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(236, 72, 153, 0.5);
    border-radius: 10px;
  }
`

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

interface MessageData {
  message: string
  name: string
}

export function Community() {
  const [activeTab, setActiveTab] = useState("forums")
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null)
  const [showJoinedTab, setShowJoinedTab] = useState(false)
  const [communities, setCommunities] = useState<Community[]>([
    // ... (keeping the original communities array unchanged)
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

  // Chat-related states
  const [socket, setSocket] = useState<Socket | null>(null)
  const [name, setName] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if any communities are joined
  useEffect(() => {
    const hasJoinedCommunities = communities.some((community) => community.joined)
    setShowJoinedTab(hasJoinedCommunities)
  }, [communities])

  // Chat socket setup
  const didInitRef = useRef(false)

// Replace your current Socket.IO initialization in community.tsx (around line 255)
useEffect(() => {
  if (didInitRef.current) return
  didInitRef.current = true

  const socketInstance = io("http://localhost:3500", {
    withCredentials: true,
    transports: ['polling', 'websocket']
  })
  
  socketInstance.on("connect", () => {
    console.log("Connected to chat server")
  })
  
  socketInstance.on("connect_error", (err) => {
    console.error("Connection error:", err.message)
  })
  
  setSocket(socketInstance)

  const userName = prompt("What is your name?")?.trim() || "Anonymous"
  setName(userName)
  socketInstance.emit("new-user", userName)
  setMessages((prev) => [...prev, "You joined"])

  socketInstance.on("chat-message", (data: MessageData) => {
    setMessages((prev) => [...prev, `${data.name}: ${data.message}`])
  })

  socketInstance.on("user-connected", (newUser: string) => {
    setMessages((prev) => [...prev, `${newUser} connected`])
  })

  socketInstance.on("user-disconnected", (oldUser: string) => {
    setMessages((prev) => [...prev, `${oldUser} disconnected`])
  })

  return () => {
    socketInstance.disconnect()
  }
}, [])


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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && socket) {
      setMessages((prev) => [...prev, `You: ${message}`])
      socket.emit("send-chat-message", message)
      setMessage("")
      // Focus the input after sending
      const inputElement = document.querySelector('input[placeholder="Share your travel ideas..."]') as HTMLInputElement
      if (inputElement) inputElement.focus()
    }
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

      {/* Chat Container */}
      <div className="mt-8">
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-rose-600 to-rose-500 text-white p-4 flex items-center justify-between shadow-md rounded-t-lg">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold">Community Chat</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-green-300 rounded-full pulse-dot"></span>
                <span className="bg-white/20 text-xs font-medium px-2.5 py-1 rounded-full">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shadow-inner hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-bold">{name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute right-0 top-full mt-2 bg-slate-800 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm z-10 border border-slate-700/50 min-w-[140px]">
                  <p className="whitespace-nowrap font-medium">Logged in as:</p>
                  <p className="text-rose-400 font-bold mt-1">{name}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100 dark:bg-slate-800/30 space-y-4 scrollbar-thin h-64">
              {messages.map((msg, index) => {
                if (msg.includes("connected") || msg.includes("disconnected") || msg === "You joined") {
                  return (
                    <div key={index} className="flex items-center justify-center space-x-2 my-5 animate-fade-in">
                      <div className="h-px bg-slate-300 dark:bg-slate-700/70 flex-1"></div>
                      <span className="text-rose-500 text-xs px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 shadow-sm">
                        {msg}
                      </span>
                      <div className="h-px bg-slate-300 dark:bg-slate-700/70 flex-1"></div>
                    </div>
                  )
                }

                const isYourMessage = msg.startsWith("You:")
                return (
                  <div
                    key={index}
                    className={`flex ${isYourMessage ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`p-4 rounded-2xl max-w-[80%] shadow-md ${
                        isYourMessage
                          ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-br-none"
                          : "bg-slate-200 dark:bg-slate-700/90 text-slate-900 dark:text-white rounded-bl-none border border-slate-300 dark:border-slate-600/30"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          {!isYourMessage && (
                            <span className="text-xs text-slate-500 dark:text-slate-300 font-medium">
                              {msg.split(":")[0]}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 dark:text-slate-400/70">
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="leading-relaxed">
                          {isYourMessage ? msg.substring(5) : msg.substring(msg.indexOf(":") + 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-5 py-3 bg-slate-200 dark:bg-slate-900/80 border-t border-slate-300 dark:border-slate-700/50 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setMessage("I'm planning a trip to Barcelona next month!")}
                className="whitespace-nowrap px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-full border border-slate-300 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600 flex items-center gap-1.5 transform hover:scale-105"
              >
                <Globe className="h-3.5 w-3.5 text-rose-500" />
                Trip planning
              </button>
              <button
                onClick={() => setMessage("Has anyone visited the Sagrada Familia? Is it worth it?")}
                className="whitespace-nowrap px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-full border border-slate-300 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600 flex items-center gap-1.5 transform hover:scale-105"
              >
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                Attraction question
              </button>
              <button
                onClick={() => setMessage("I found a great restaurant called El Nacional for dinner.")}
                className="whitespace-nowrap px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs rounded-full border border-slate-300 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-slate-400 dark:hover:border-slate-600 flex items-center gap-1.5 transform hover:scale-105"
              >
                <MessageSquare className="h-3.5 w-3.5 text-rose-500" />
                Restaurant idea
              </button>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-slate-100 dark:bg-slate-900/90 border-t border-slate-300 dark:border-slate-700/50">
            <form onSubmit={handleChatSubmit} className="w-full flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your travel ideas..."
                  className="w-full p-4 pl-5 pr-12 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/50 rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-inner"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs">
                  {message.length > 0 && "typing..."}
                </div>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:rotate-3"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

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

