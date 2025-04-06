"use client"

import { useState } from "react"
import { Star, Send, MapPin, Hotel, Utensils, Landmark, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer" // Assuming the existing footer component

export default function FeedbackPage() {
  const [accommodationRating, setAccommodationRating] = useState(0)
  const [diningRating, setDiningRating] = useState(0)
  const [attractionsRating, setAttractionsRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [destination, setDestination] = useState("")
  const [travelDate, setTravelDate] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setAccommodationRating(0)
      setDiningRating(0)
      setAttractionsRating(0)
      setFeedback("")
      setDestination("")
      setTravelDate("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Travelease</h1>
          <p className="mt-2 text-red-100">Share Your Travel Experience</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-red-600">Your Feedback Matters</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Help us improve our services by sharing your travel experiences. Your insights enable us to create better journeys for future travelers.
            </p>
          </div>

          <Tabs defaultValue="leave-feedback" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="leave-feedback" className="text-lg">Leave Feedback</TabsTrigger>
              <TabsTrigger value="testimonials" className="text-lg">Traveler Testimonials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leave-feedback">
              <Card className="border-red-100 shadow-md">
                <CardHeader className="bg-red-50 border-b border-red-100">
                  <CardTitle className="text-2xl text-red-600">Rate Your Experience</CardTitle>
                  <CardDescription>
                    Tell us about your recent trip booked through Travelease
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {submitted ? (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You For Your Feedback!</h3>
                      <p className="text-gray-600">Your insights help us improve the Travelease experience for everyone.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block font-medium text-gray-700">Destination</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <MapPin className="h-5 w-5 text-red-500" />
                            </span>
                            <input
                              type="text"
                              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                              placeholder="Where did you travel?"
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block font-medium text-gray-700">Travel Date</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                              <Calendar className="h-5 w-5 text-red-500" />
                            </span>
                            <input
                              type="text"
                              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                              placeholder="When did you travel? (MM/YYYY)"
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />
                      
                      <div className="space-y-6">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="flex items-center mb-3">
                            <Hotel className="mr-2 h-6 w-6 text-red-600" />
                            <h3 className="font-semibold text-lg text-gray-800">Accommodation Quality</h3>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setAccommodationRating(star)}
                                className="focus:outline-none mr-1"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= accommodationRating ? "fill-red-500 text-red-500" : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-gray-600">
                              {accommodationRating > 0 ? 
                                accommodationRating === 5 ? "Excellent" : 
                                accommodationRating === 4 ? "Very Good" : 
                                accommodationRating === 3 ? "Good" : 
                                accommodationRating === 2 ? "Fair" : "Poor"
                              : ""}
                            </span>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="flex items-center mb-3">
                            <Utensils className="mr-2 h-6 w-6 text-red-600" />
                            <h3 className="font-semibold text-lg text-gray-800">Dining Options</h3>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setDiningRating(star)}
                                className="focus:outline-none mr-1"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= diningRating ? "fill-red-500 text-red-500" : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-gray-600">
                              {diningRating > 0 ? 
                                diningRating === 5 ? "Excellent" : 
                                diningRating === 4 ? "Very Good" : 
                                diningRating === 3 ? "Good" : 
                                diningRating === 2 ? "Fair" : "Poor"
                              : ""}
                            </span>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                          <div className="flex items-center mb-3">
                            <Landmark className="mr-2 h-6 w-6 text-red-600" />
                            <h3 className="font-semibold text-lg text-gray-800">Attraction Relevance</h3>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setAttractionsRating(star)}
                                className="focus:outline-none mr-1"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= attractionsRating ? "fill-red-500 text-red-500" : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-gray-600">
                              {attractionsRating > 0 ? 
                                attractionsRating === 5 ? "Excellent" : 
                                attractionsRating === 4 ? "Very Good" : 
                                attractionsRating === 3 ? "Good" : 
                                attractionsRating === 2 ? "Fair" : "Poor"
                              : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-gray-700 mb-2">Tell us more about your experience</label>
                        <Textarea
                          placeholder="What did you enjoy most? What could we improve? Any specific highlights or challenges?"
                          className="min-h-[150px] border-gray-300 focus:border-red-500 focus:ring-red-500"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
                      >
                        <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="testimonials">
              <div className="space-y-6">
                <Card className="border-red-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Emily Parker" />
                        <AvatarFallback className="bg-white text-red-600">EP</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">Emily Parker</h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm text-red-100">Santorini, Greece</span>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-white text-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      "Our honeymoon in Santorini was absolutely magical! Travelease arranged everything perfectly - from our cliffside hotel with breathtaking sunset views to the private yacht tour around the caldera. The restaurant recommendations were exceptional, especially the seafood taverna in Amoudi Bay. Every attraction was well-timed to avoid crowds. This was truly the trip of a lifetime!"
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Traveled: June 2024</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-400 p-4 text-white">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="James Wilson" />
                        <AvatarFallback className="bg-white text-red-600">JW</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">James Wilson</h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm text-red-100">Kyoto, Japan</span>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-white text-white" />
                        ))}
                        <Star className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      "My cultural tour of Kyoto was incredibly well-organized. The traditional ryokan accommodation was authentic and comfortable, though slightly more basic than I expected. The guided tours of temples and gardens were outstanding - our guide was knowledgeable and spoke excellent English. The food recommendations were spot on, especially the kaiseki dinner experience. My only suggestion would be to include more free time for personal exploration."
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Traveled: April 2024</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Maria Rodriguez" />
                        <AvatarFallback className="bg-white text-red-600">MR</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">Maria Rodriguez</h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm text-red-100">Costa Rica</span>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        {[1, 2, 3].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-white text-white" />
                        ))}
                        {[4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      "Our family adventure in Costa Rica had mixed results. The rainforest lodge was beautiful but quite remote, making it difficult to access other attractions. The wildlife tours were amazing - we saw sloths, toucans, and monkeys! However, some of the recommended restaurants were closed during our visit, and we had to find alternatives. The zip-lining and hot springs excursions were fantastic and very well-organized. Overall a good trip, but some aspects could be improved."
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Traveled: March 2024</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-400 p-4 text-white">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt="David Chen" />
                        <AvatarFallback className="bg-white text-red-600">DC</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg">David Chen</h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm text-red-100">Barcelona, Spain</span>
                        </div>
                      </div>
                      <div className="flex ml-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-white text-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      "My solo trip to Barcelona exceeded all expectations! The boutique hotel in the Gothic Quarter was perfectly located and had amazing staff. The tapas tour introduced me to incredible local cuisine I would never have found on my own. The skip-the-line tickets for Sagrada Familia and Park Güell saved me hours of waiting. The day trip to Montserrat was breathtaking. Travelease thought of everything - even providing a local SIM card and detailed neighborhood maps. Absolutely flawless experience!"
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Traveled: May 2024</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-white p-8 rounded-lg border border-red-100 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="h-10 w-1 bg-red-600 mr-4"></div>
              <h3 className="text-xl font-bold text-gray-800">How We Use Your Feedback</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <Hotel className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Accommodation Improvements</h4>
                <p className="text-gray-600 text-sm">
                  We partner with hotels and accommodations that consistently meet our travelers' expectations for comfort, location, and value.
                </p>
              </div>
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <Utensils className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Dining Recommendations</h4>
                <p className="text-gray-600 text-sm">
                  Your culinary feedback helps us curate authentic dining experiences that showcase local flavors and meet dietary preferences.
                </p>
              </div>
              <div className="bg-red-50 p-5 rounded-lg border border-red-100">
                <Landmark className="h-8 w-8 text-red-600 mb-3" />
                <h4 className="font-semibold text-gray-800 mb-2">Attraction Curation</h4>
                <p className="text-gray-600 text-sm">
                  We refine our attraction recommendations based on your experiences to ensure meaningful and memorable travel moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
