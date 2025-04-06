
// "use client"

// import dynamic from "next/dynamic"
// import TripForm from "@/components/trip-form"
// import ItineraryDisplay from "@/components/itinerary-display"
// import ChatInterface from "@/components/chat-interface"
// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default function TravelDashboard({ itinerary, destination }: any) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [showItinerary, setShowItinerary] = useState(true)
//   const [showMap, setShowMap] = useState(true)

//   const handleFormSubmit = (formData: any) => {
//     // Process form & generate itinerary
//     setFormMinimized(true)
//   }

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       {
//         day: 1,
//         activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"],
//       },
//       {
//         day: 2,
//         activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
//       },
//       {
//         day: 3,
//         activities: [
//           "Versailles Day Trip",
//           "Explore Champs-Élysées",
//           "Dinner at local bistro",
//         ],
//       },
//     ],
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//   {/* Header */}
//   <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//     <div className="container mx-auto px-4 py-3 flex items-center">
//       <Link
//         href="/"
//         className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400"
//       >
//         <ArrowLeft className="h-5 w-5 mr-2" />
//         <span>Back to Home</span>
//       </Link>
//       <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//         AI Trip Advisor
//       </h1>
//       <div className="w-20"></div>
//     </div>
//   </header>

//   {/* Main */}
//   <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//     {/* Top: Form */}
//     <div className="relative">
//       <AnimatePresence>
//         {!formMinimized && (
//           <motion.div
//             key="form"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4">
//               <TripForm onSubmit={handleFormSubmit} />
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {formMinimized && (
//           <motion.div
//             key="fab"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed bottom-4 left-4 z-50"
//           >
//             <Button
//               onClick={() => setFormMinimized(false)}
//               className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//             >
//               +
//             </Button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>

//     {/* 2-column layout: Itinerary + Map */}
//     <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//       {/* Left: Itinerary + Bot */}
//       <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//         <Card className="flex-1 overflow-auto p-4">
//           <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//         </Card>
//         <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//           <ChatInterface destination={itinerary?.destination || dummyItinerary.destination} />
//         </Card>
//       </div>

//       {/* Right: Map */}
//       <Card className="flex-1 h-full overflow-hidden p-4">
//         <TripMap destination={destination || dummyItinerary.destination} />
//       </Card>
//     </div>
//   </main>
// </div>

//   )
// }







// "use client"

// import dynamic from "next/dynamic"
// import { format } from "date-fns"
// import { motion, AnimatePresence } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { CalendarIcon } from "lucide-react"
// import { ArrowLeft } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { cn } from "@/lib/utils"
// import ItineraryDisplay from "@/components/itinerary-display"
// import ChatInterface from "@/components/chat-interface"
// import Link from "next/link"
// import { useState } from "react"

// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// // Form schema for TripForm
// const formSchema = z.object({
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   origin: z.string().min(2, {
//     message: "Origin must be at least 2 characters.",
//   }),
//   departureDate: z.date().optional(),
//   budgetLevel: z.string().optional(),
//   interests: z.string().optional(),
//   specialRequests: z.string().optional(),
// })

// // TripForm component defined within the same file
// function TripForm({ onItineraryGenerated }: any) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   const handleSubmit = async (values: any) => {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
//       trip_length: 5,
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2,
//       interests: values.interests || "",
//       special_requests: values.specialRequests || "",
//     }
//     console.log("Sending request:", requestData)

//     try {
//       const response = await fetch("https://6v2nbjpq-5000.inc1.devtunnels.ms/api/itinerary", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         mode: "cors",
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const responseData = await response.json()
//       console.log("Response received:", responseData)
      
//       // Pass the itinerary and destination back to TravelDashboard
//       onItineraryGenerated(responseData.itinerary, values.destination)
//     } catch (error) {
//       console.error("Error fetching itinerary:", error)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <h2 className="text-2xl font-bold">Plan Your Trip</h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Fill out the form below to get a personalized itinerary
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter the city you want to visit</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="origin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Origin City (IATA Code)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter your departure city or airport code</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Departure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>When do you plan to start your trip?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="budgetLevel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget Level</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your budget level" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Budget">Budget</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="Luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="interests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Interests</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. nature, history, food, adventure" {...field} />
//                   </FormControl>
//                   <FormDescription>What activities are you interested in?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Special Requests</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requirements or preferences?"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Let us know if you have any specific requirements</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//             >
//               Generate Itinerary
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   )
// }

// // Main TravelDashboard component
// export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [itinerary, setItinerary] = useState(initialItinerary)
//   const [destination, setDestination] = useState(initialDestination)

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
//       { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
//       { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
//     ],
//   }

//   const handleItineraryGenerated = (newItinerary, newDestination) => {
//     setItinerary(newItinerary)
//     setDestination(newDestination)
//     setFormMinimized(true)
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             <span>Back to Home</span>
//           </Link>
//           <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//             AI Trip Advisor
//           </h1>
//           <div className="w-20"></div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//         {/* Top: Form */}
//         <div className="relative">
//           <AnimatePresence>
//             {!formMinimized && (
//               <motion.div
//                 key="form"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-4">
//                   <TripForm onItineraryGenerated={handleItineraryGenerated} />
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {formMinimized && (
//               <motion.div
//                 key="fab"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed bottom-4 left-4 z-50"
//               >
//                 <Button
//                   onClick={() => setFormMinimized(false)}
//                   className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//                 >
//                   +
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* 2-column layout: Itinerary + Map */}
//         <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//           {/* Left: Itinerary + Bot */}
//           <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//             <Card className="flex-1 overflow-auto p-4">
//               <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//             </Card>
//             <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//               <ChatInterface destination={destination || dummyItinerary.destination} />
//             </Card>
//           </div>

//           {/* Right: Map */}
//           <Card className="flex-1 h-full overflow-hidden p-4">
//             <TripMap destination={destination || dummyItinerary.destination} />
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }






// "use client"

// import dynamic from "next/dynamic"
// import { format } from "date-fns"
// import { motion, AnimatePresence } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { CalendarIcon } from "lucide-react"
// import { ArrowLeft } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { cn } from "@/lib/utils"
// import ItineraryDisplay from "@/components/itinerary-display"
// import ChatInterface from "@/components/chat-interface"
// import Link from "next/link"
// import { useState } from "react"

// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// // Form schema for TripForm
// const formSchema = z.object({
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   origin: z.string().min(2, {
//     message: "Origin must be at least 2 characters.",
//   }),
//   departureDate: z.date().optional(),
//   budgetLevel: z.string().optional(),
//   interests: z.string().optional(),
//   specialRequests: z.string().optional(),
// })

// // TripForm component defined within the same file
// function TripForm({ onItineraryGenerated }) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   const handleSubmit = async (values) => {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
//       trip_length: 5,
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2,
//       interests: values.interests || "",
//       special_requests: values.specialRequests || "",
//     }
//     console.log("Sending request:", requestData)

//     try {
//       const response = await fetch("https://6v2nbjpq-5000.inc1.devtunnels.ms/api/itinerary", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         mode: "cors",
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const responseData = await response.json()
//       console.log("Response received:", responseData)
      
//       // Pass the full response data and destination back to TravelDashboard
//       onItineraryGenerated(responseData, values.destination)
//     } catch (error) {
//       console.error("Error fetching itinerary:", error)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <h2 className="text-2xl font-bold">Plan Your Trip</h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Fill out the form below to get a personalized itinerary
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter the city you want to visit</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="origin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Origin City (IATA Code)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter your departure city or airport code</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Departure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>When do you plan to start your trip?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="budgetLevel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget Level</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your budget level" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Budget">Budget</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="Luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="interests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Interests</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. nature, history, food, adventure" {...field} />
//                   </FormControl>
//                   <FormDescription>What activities are you interested in?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Special Requests</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requirements or preferences?"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Let us know if you have any specific requirements</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
              
//             >
//               Generate Itinerary
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   )
// }

// // Main TravelDashboard component
// export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [itinerary, setItinerary] = useState(initialItinerary)
//   const [destination, setDestination] = useState(initialDestination)

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
//       { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
//       { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
//     ],
//   }
//   console.log(itinerary)

//   const handleItineraryGenerated = (newItinerary, newDestination) => {
//     setItinerary(newItinerary)  // Store the full response data in itinerary
//     setDestination(newDestination)
//     setFormMinimized(true)
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             <span>Back to Home</span>
//           </Link>
//           <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//             AI Trip Advisor
//           </h1>
//           <div className="w-20"></div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//         {/* Top: Form */}
//         <div className="relative">
//           <AnimatePresence>
//             {!formMinimized && (
//               <motion.div
//                 key="form"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-4">
//                   <TripForm onItineraryGenerated={handleItineraryGenerated} />
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {formMinimized && (
//               <motion.div
//                 key="fab"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed bottom-4 left-4 z-50"
//               >
//                 <Button
//                   onClick={() => setFormMinimized(false)}
//                   className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//                 >
//                   +
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* 2-column layout: Itinerary + Map */}
//         <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//           {/* Left: Itinerary + Bot */}
//           <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//             <Card className="flex-1 overflow-auto p-4">
//               <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//             </Card>
//             <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//               <ChatInterface destination={destination || dummyItinerary.destination} />
//             </Card>
//           </div>

//           {/* Right: Map */}
//           <Card className="flex-1 h-full overflow-hidden p-4">
//             <TripMap destination={destination || dummyItinerary.destination} />
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }




// "use client"

// import dynamic from "next/dynamic"
// import { format } from "date-fns"
// import { motion, AnimatePresence } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { CalendarIcon, Download, FileText, ArrowLeft } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import ReactMarkdown from "react-markdown"
// import ChatInterface from "@/components/chat-interface"
// import Link from "next/link"
// import { useState } from "react"
// import { cn } from "@/lib/utils"

// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// // Form schema for TripForm
// const formSchema = z.object({
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   origin: z.string().min(2, {
//     message: "Origin must be at least 2 characters.",
//   }),
//   departureDate: z.date().optional(),
//   budgetLevel: z.string().optional(),
//   interests: z.string().optional(),
//   specialRequests: z.string().optional(),
// })

// // TripForm component
// function TripForm({ onItineraryGenerated }) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   const handleSubmit = async (values) => {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
//       trip_length: 5,
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2,
//       interests: values.interests || "",
//       special_requests: values.specialRequests || "",
//     }
//     console.log("Sending request:", requestData)

//     try {
//       const response = await fetch("https://6v2nbjpq-5000.inc1.devtunnels.ms/api/itinerary", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         mode: "cors",
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const responseData = await response.json()
//       console.log("Response received:", responseData)
      
//       onItineraryGenerated(values, responseData)
//     } catch (error) {
//       console.error("Error fetching itinerary:", error)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <h2 className="text-2xl font-bold">Plan Your Trip</h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Fill out the form below to get a personalized itinerary
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter the city you want to visit</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="origin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Origin City (IATA Code)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter your departure city or airport code</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Departure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>When do you plan to start your trip?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="budgetLevel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget Level</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your budget level" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Budget">Budget</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="Luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="interests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Interests</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. nature, history, food, adventure" {...field} />
//                   </FormControl>
//                   <FormDescription>What activities are you interested in?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Special Requests</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requirements or preferences?"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Let us know if you have any specific requirements</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//             >
//               Generate Itinerary
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   )
// }

// // ItineraryDisplay component integrated directly
// function ItineraryDisplay({ itinerary }) {
//   const [downloading, setDownloading] = useState(false)

//   const downloadPDF = () => {
//     if (!itinerary) return

//     setDownloading(true)

//     // Simulate PDF download
//     setTimeout(() => {
//       setDownloading(false)
//       alert(`Itinerary for ${itinerary.destination || "your trip"} would be downloaded as PDF in a real implementation.`)
//     }, 1500)
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Your Itinerary</h2>
//         {itinerary && (
//           <Button
//             onClick={downloadPDF}
//             disabled={downloading}
//             className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//           >
//             {downloading ? "Generating..." : "Download PDF"}
//             <Download className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <div className="flex-1 overflow-auto">
//         <AnimatePresence mode="wait">
//           {itinerary ? (
//             <motion.div
//               key="itinerary"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="prose dark:prose-invert max-w-none"
//             >
//               <ReactMarkdown>{itinerary.itinerary || itinerary.content || "No itinerary content available"}</ReactMarkdown>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="placeholder"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8"
//             >
//               <FileText className="h-16 w-16 mb-4 opacity-30" />
//               <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
//               <p>Fill out the form on the left to generate a personalized travel itinerary for your next adventure.</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// // Main TravelDashboard component
// export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [itinerary, setItinerary] = useState(initialItinerary)
//   const [destination, setDestination] = useState(initialDestination)
//   const [formData, setFormData] = useState(null)

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
//       { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
//       { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
//     ],
//   }

//   const handleItineraryGenerated = (formValues, responseData) => {
//     setFormData(formValues)
//     setItinerary(responseData)
//     setDestination(formValues.destination)
//     setFormMinimized(true)
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             <span>Back to Home</span>
//           </Link>
//           <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//             AI Trip Advisor
//           </h1>
//           <div className="w-20"></div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//         {/* Top: Form */}
//         <div className="relative">
//           <AnimatePresence>
//             {!formMinimized && (
//               <motion.div
//                 key="form"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-4">
//                   <TripForm onItineraryGenerated={handleItineraryGenerated} />
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {formMinimized && (
//               <motion.div
//                 key="fab"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed bottom-4 left-4 z-50"
//               >
//                 <Button
//                   onClick={() => setFormMinimized(false)}
//                   className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//                 >
//                   +
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* 2-column layout: Itinerary + Map */}
//         <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//           {/* Left: Itinerary + Bot */}
//           <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//             <Card className="flex-1 overflow-auto p-4">
//               <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//             </Card>
//             <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//               <ChatInterface destination={destination || dummyItinerary.destination} />
//             </Card>
//           </div>

//           {/* Right: Map */}
//           <Card className="flex-1 h-full overflow-hidden p-4">
//             <TripMap destination={destination || dummyItinerary.destination} />
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }



// "use client"

// import dynamic from "next/dynamic"
// import { format } from "date-fns"
// import { motion, AnimatePresence } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { CalendarIcon, Download, FileText, ArrowLeft } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import ReactMarkdown from "react-markdown"
// import ChatInterface from "@/components/chat-interface"
// import Link from "next/link"
// import { useState } from "react"
// import { cn } from "@/lib/utils"

// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// // Form schema for TripForm
// const formSchema = z.object({
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   origin: z.string().min(2, {
//     message: "Origin must be at least 2 characters.",
//   }),
//   departureDate: z.date().optional(),
//   budgetLevel: z.string().optional(),
//   interests: z.string().optional(),
//   specialRequests: z.string().optional(),
// })

// // TripForm component
// function TripForm({ onItineraryGenerated }) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   const handleSubmit = async (values) => {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
//       trip_length: 5,
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2,
//       interests: values.interests || "",
//       special_requests: values.specialRequests || "",
//     }
//     console.log("Sending request:", requestData)

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/itinerary", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         mode: "cors",
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const responseData = await response.json()
//       console.log("Response received:", responseData)
      
//       onItineraryGenerated(values, responseData)
//     } catch (error) {
//       console.error("Error fetching itinerary:", error)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <h2 className="text-2xl font-bold">Plan Your Trip</h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Fill out the form below to get a personalized itinerary
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter the city you want to visit</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="origin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Origin City (IATA Code)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter your departure city or airport code</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Departure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>When do you plan to start your trip?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="budgetLevel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget Level</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your budget level" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Budget">Budget</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="Luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="interests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Interests</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. nature, history, food, adventure" {...field} />
//                   </FormControl>
//                   <FormDescription>What activities are you interested in?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Special Requests</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requirements or preferences?"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Let us know if you have any specific requirements</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//             >
//               Generate Itinerary
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   )
// }

// // ItineraryDisplay component with updated async downloadPDF
// function ItineraryDisplay({ itinerary }) {
//   const [downloading, setDownloading] = useState(false)

//   const downloadPDF = async () => {
//     if (!itinerary) return

//     setDownloading(true)

//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/itinerary/pdf', {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/pdf',
//         },
//       })

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('No PDF available')
//         }
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `${itinerary.destination || 'trip'}_itinerary.pdf`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error('Error downloading PDF:', error)
//       alert(`Failed to download PDF: ${error.message}`)
//     } finally {
//       setDownloading(false)
//     }
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Your Itinerary</h2>
//         {itinerary && (
//           <Button
//             onClick={downloadPDF}
//             disabled={downloading}
//             className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//           >
//             {downloading ? "Downloading..." : "Download PDF"}
//             <Download className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <div className="flex-1 overflow-auto">
//         <AnimatePresence mode="wait">
//           {itinerary ? (
//             <motion.div
//               key="itinerary"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="prose dark:prose-invert max-w-none"
//             >
//               <ReactMarkdown>{itinerary.itinerary || itinerary.content || "No itinerary content available"}</ReactMarkdown>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="placeholder"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8"
//             >
//               <FileText className="h-16 w-16 mb-4 opacity-30" />
//               <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
//               <p>Fill out the form on the left to generate a personalized travel itinerary for your next adventure.</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// // Main TravelDashboard component
// export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [itinerary, setItinerary] = useState(initialItinerary)
//   const [destination, setDestination] = useState(initialDestination)
//   const [formData, setFormData] = useState(null)

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
//       { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
//       { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
//     ],
//   }

//   const handleItineraryGenerated = (formValues, responseData) => {
//     setFormData(formValues)
//     setItinerary(responseData)
//     setDestination(formValues.destination)
//     setFormMinimized(true)
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             <span>Back to Home</span>
//           </Link>
//           <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//             AI Trip Advisor
//           </h1>
//           <div className="w-20"></div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//         {/* Top: Form */}
//         <div className="relative">
//           <AnimatePresence>
//             {!formMinimized && (
//               <motion.div
//                 key="form"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-4">
//                   <TripForm onItineraryGenerated={handleItineraryGenerated} />
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {formMinimized && (
//               <motion.div
//                 key="fab"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed bottom-4 left-4 z-50"
//               >
//                 <Button
//                   onClick={() => setFormMinimized(false)}
//                   className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//                 >
//                   +
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* 2-column layout: Itinerary + Map */}
//         <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//           {/* Left: Itinerary + Bot */}
//           <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//             <Card className="flex-1 overflow-auto p-4">
//               <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//             </Card>
//             <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//               <ChatInterface destination={destination || dummyItinerary.destination} />
//             </Card>
//           </div>

//           {/* Right: Map */}
//           <Card className="flex-1 h-full overflow-hidden p-4">
//             <TripMap destination={destination || dummyItinerary.destination} />
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }






// "use client"

// import dynamic from "next/dynamic"
// import { format } from "date-fns"
// import { motion, AnimatePresence } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { useState, useRef, useEffect } from "react"
// import { CalendarIcon, Download, FileText, ArrowLeft, Send, Bot, User, Mic, MicOff } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Avatar } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import ReactMarkdown from "react-markdown"
// import Link from "next/link"
// import { cn } from "@/lib/utils"

// const TripMap = dynamic(() => import("@/components/trip-map"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
//       <p>Loading map...</p>
//     </div>
//   ),
// })

// // Chat Message Type
// type Message = {
//   id: number
//   text: string
//   sender: "user" | "bot"
//   timestamp: Date
// }

// // Form schema for TripForm
// const formSchema = z.object({
//   destination: z.string().min(2, {
//     message: "Destination must be at least 2 characters.",
//   }),
//   origin: z.string().min(2, {
//     message: "Origin must be at least 2 characters.",
//   }),
//   departureDate: z.date().optional(),
//   budgetLevel: z.string().optional(),
//   interests: z.string().optional(),
//   specialRequests: z.string().optional(),
// })

// // TripForm component
// function TripForm({ onItineraryGenerated }) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   const handleSubmit = async (values) => {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
//       trip_length: 5,
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2,
//       interests: values.interests || "",
//       special_requests: values.specialRequests || "",
//     }
//     console.log("Sending request:", requestData)

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/itinerary", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//         },
//         body: JSON.stringify(requestData),
//         mode: "cors",
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const responseData = await response.json()
//       console.log("Response received:", responseData)
      
//       onItineraryGenerated(values, responseData)
//     } catch (error) {
//       console.error("Error fetching itinerary:", error)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <h2 className="text-2xl font-bold">Plan Your Trip</h2>
//           <p className="text-gray-500 dark:text-gray-400">
//             Fill out the form below to get a personalized itinerary
//           </p>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination City</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter the city you want to visit</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="origin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Origin City (IATA Code)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
//                   </FormControl>
//                   <FormDescription>Enter your departure city or airport code</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="departureDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Departure Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>When do you plan to start your trip?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="budgetLevel"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget Level</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your budget level" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Budget">Budget</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="Luxury">Luxury</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="interests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Interests</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. nature, history, food, adventure" {...field} />
//                   </FormControl>
//                   <FormDescription>What activities are you interested in?</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Special Requests</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requirements or preferences?"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Let us know if you have any specific requirements</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//             >
//               Generate Itinerary
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   )
// }

// // ItineraryDisplay component with updated async downloadPDF
// function ItineraryDisplay({ itinerary }) {
//   const [downloading, setDownloading] = useState(false)

//   const downloadPDF = async () => {
//     if (!itinerary) return

//     setDownloading(true)

//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/itinerary/pdf', {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/pdf',
//         },
//       })

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('No PDF available')
//         }
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const link = document.createElement('a')
//       link.href = url
//       link.download = `${itinerary.destination || 'trip'}_itinerary.pdf`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       window.URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error('Error downloading PDF:', error)
//       alert(`Failed to download PDF: ${error.message}`)
//     } finally {
//       setDownloading(false)
//     }
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Your Itinerary</h2>
//         {itinerary && (
//           <Button
//             onClick={downloadPDF}
//             disabled={downloading}
//             className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//           >
//             {downloading ? "Downloading..." : "Download PDF"}
//             <Download className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <div className="flex-1 overflow-auto">
//         <AnimatePresence mode="wait">
//           {itinerary ? (
//             <motion.div
//               key="itinerary"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="prose dark:prose-invert max-w-none"
//             >
//               <ReactMarkdown>{itinerary.itinerary || itinerary.content || "No itinerary content available"}</ReactMarkdown>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="placeholder"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8"
//             >
//               <FileText className="h-16 w-16 mb-4 opacity-30" />
//               <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
//               <p>Fill out the form on the left to generate a personalized travel itinerary for your next adventure.</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// // ChatInterface component integrated directly
// function ChatInterface({ destination }) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       text: "Hello! I'm your AI Trip Advisor. How can I help you plan your perfect trip today?",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ])
//   const [input, setInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const [isListening, setIsListening] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // Auto-scroll to bottom when new messages are added
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Update welcome message if destination changes
//   useEffect(() => {
//     if (destination) {
//       const welcomeMessage: Message = {
//         id: messages.length + 1,
//         text: `Great! I see you're planning a trip to ${destination}. How can I help you with your ${destination} itinerary?`,
//         sender: "bot",
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, welcomeMessage])
//     }
//   }, [destination])

//   const handleSendMessage = () => {
//     if (input.trim() === "") return

//     // Add user message
//     const userMessage: Message = {
//       id: messages.length + 1,
//       text: input,
//       sender: "user",
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setInput("")
//     setIsTyping(true)

//     // Simulate AI response after a short delay
//     setTimeout(() => {
//       const botResponses: { [key: string]: string[] } = {
//         default: [
//           "I'd recommend visiting the local markets and trying the street food for an authentic experience.",
//           "The best time to visit would be during the shoulder season when there are fewer tourists.",
//           "For transportation, I suggest using public transit as it's efficient and will save you money.",
//           "Don't forget to check if you need any special vaccinations or travel documents before your trip.",
//           "I recommend booking accommodations in advance, especially if you're traveling during peak season.",
//         ],
//         weather: [
//           "The weather should be pleasant during your visit. Pack light clothing but bring a jacket for evenings.",
//           "It might be rainy season during your visit. I recommend bringing waterproof clothing and an umbrella.",
//           "Expect hot and humid conditions. Light, breathable clothing is recommended, and don't forget sunscreen!",
//           "The weather can be unpredictable, so I suggest packing layers that you can add or remove as needed.",
//         ],
//         food: [
//           "You must try the local specialty dishes! I recommend visiting the night markets for the best street food.",
//           "There are several Michelin-starred restaurants in the area if you're looking for a fine dining experience.",
//           "For authentic local cuisine, try to eat where the locals eat - usually away from the main tourist areas.",
//           "Food tours are a great way to sample a variety of local dishes while learning about the culture.",
//         ],
//       }

//       // Determine which response set to use based on keywords in the user's message
//       let responseSet = botResponses.default
//       const lowerCaseInput = input.toLowerCase()

//       if (
//         lowerCaseInput.includes("weather") ||
//         lowerCaseInput.includes("temperature") ||
//         lowerCaseInput.includes("climate")
//       ) {
//         responseSet = botResponses.weather
//       } else if (
//         lowerCaseInput.includes("food") ||
//         lowerCaseInput.includes("eat") ||
//         lowerCaseInput.includes("restaurant") ||
//         lowerCaseInput.includes("cuisine")
//       ) {
//         responseSet = botResponses.food
//       }

//       const randomResponse = responseSet[Math.floor(Math.random() * responseSet.length)]

//       setIsTyping(false)
//       const botMessage: Message = {
//         id: messages.length + 2,
//         text: randomResponse,
//         sender: "bot",
//         timestamp: new Date(),
//       }

//       setMessages((prev) => [...prev, botMessage])
//     }, 1500)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const toggleListening = () => {
//     // Check if browser supports speech recognition
//     if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
//       setIsListening(!isListening)

//       if (!isListening) {
//         // This is a simplified version - in a real app, you'd implement the full speech recognition
//         alert("Speech recognition would start here. This is a simplified demo.")

//         // Simulate receiving speech after 3 seconds
//         setTimeout(() => {
//           setInput((prev) => prev + " How's the weather there?")
//           setIsListening(false)
//         }, 3000)
//       }
//     } else {
//       alert("Speech recognition is not supported in your browser.")
//     }
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
//         <h3 className="text-lg font-medium flex items-center">
//           <Bot className="mr-2 h-5 w-5" />
//           AI Trip Advisor Chat
//         </h3>
//         <p className="text-sm opacity-90">Ask questions about your trip</p>
//       </div>

//       <ScrollArea className="flex-1 p-4">
//         <div className="space-y-4">
//           <AnimatePresence>
//             {messages.map((message) => (
//               <motion.div
//                 key={`${message.timestamp.getTime()}-${message.sender}`}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
//                 >
//                   <Avatar
//                     className={
//                       message.sender === "user"
//                         ? "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
//                         : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
//                     }
//                   >
//                     {message.sender === "user" ? <User className="h-5 w-5 m-auto" /> : <Bot className="h-5 w-5 m-auto" />}
//                   </Avatar>
//                   <div
//                     className={`rounded-lg p-3 ${
//                       message.sender === "user"
//                         ? "bg-rose-600 dark:bg-rose-700 text-white"
//                         : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap">{message.text}</p>
//                     <p className="text-xs opacity-70 mt-1">
//                       {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {isTyping && (
//             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
//               <div className="flex items-start gap-2 max-w-[80%]">
//                 <Avatar className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                   <Bot className="h-5 w-5" />
//                 </Avatar>
//                 <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
//                   <div className="flex space-x-1">
//                     <motion.div
//                       className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
//                       animate={{ y: [0, -5, 0] }}
//                       transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
//                     />
//                     <motion.div
//                       className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
//                       animate={{ y: [0, -5, 0] }}
//                       transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
//                     />
//                     <motion.div
//                       className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
//                       animate={{ y: [0, -5, 0] }}
//                       transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </ScrollArea>

//       <div className="p-4 border-t border-gray-200 dark:border-gray-800">
//         <div className="flex gap-2">
//           <Input
//             placeholder="Ask about your trip..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="flex-1"
//           />
//           <Button
//             onClick={toggleListening}
//             variant="outline"
//             className={isListening ? "bg-rose-100 text-rose-600 border-rose-300" : ""}
//           >
//             {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
//           </Button>
//           <Button
//             onClick={handleSendMessage}
//             className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
//             disabled={isTyping || input.trim() === ""}
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//         <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//           {isListening ? "Listening... speak now" : "Press the microphone button to use voice input"}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Main TravelDashboard component
// export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
//   const [formMinimized, setFormMinimized] = useState(false)
//   const [itinerary, setItinerary] = useState(initialItinerary)
//   const [destination, setDestination] = useState(initialDestination)
//   const [formData, setFormData] = useState(null)

//   const dummyItinerary = {
//     destination: "Paris",
//     days: [
//       { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
//       { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
//       { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
//     ],
//   }

//   const handleItineraryGenerated = (formValues, responseData) => {
//     setFormData(formValues)
//     setItinerary(responseData)
//     setDestination(formValues.destination)
//     setFormMinimized(true)
//   }

//   return (
//     <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
//         <div className="container mx-auto px-4 py-3 flex items-center">
//           <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             <span>Back to Home</span>
//           </Link>
//           <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
//             AI Trip Advisor
//           </h1>
//           <div className="w-20"></div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
//         {/* Top: Form */}
//         <div className="relative">
//           <AnimatePresence>
//             {!formMinimized && (
//               <motion.div
//                 key="form"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className="p-4">
//                   <TripForm onItineraryGenerated={handleItineraryGenerated} />
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {formMinimized && (
//               <motion.div
//                 key="fab"
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="fixed bottom-4 left-4 z-50"
//               >
//                 <Button
//                   onClick={() => setFormMinimized(false)}
//                   className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
//                 >
//                   +
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* 2-column layout: Itinerary + Map */}
//         <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
//           {/* Left: Itinerary + Bot */}
//           <div className="flex flex-col gap-6 flex-1 overflow-hidden">
//             <Card className="flex-1 overflow-auto p-4">
//               <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
//             </Card>
//             <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
//               <ChatInterface destination={destination || dummyItinerary.destination} />
//             </Card>
//           </div>

//           {/* Right: Map */}
//           <Card className="flex-1 h-full overflow-hidden p-4">
//             <TripMap destination={destination || dummyItinerary.destination} />
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }






"use client"

import dynamic from "next/dynamic"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useRef, useEffect } from "react"
import { CalendarIcon, Download, FileText, ArrowLeft, Send, Bot, User, Mic, MicOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { cn } from "@/lib/utils"

const TripMap = dynamic(() => import("@/components/trip-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <p>Loading map...</p>
    </div>
  ),
})

// Chat Message Type
type Message = {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// Form schema for TripForm
const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  origin: z.string().min(2, {
    message: "Origin must be at least 2 characters.",
  }),
  departureDate: z.date().optional(),
  budgetLevel: z.string().optional(),
  interests: z.string().optional(),
  specialRequests: z.string().optional(),
})

// TripForm component
function TripForm({ onItineraryGenerated }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      origin: "",
      budgetLevel: "Medium",
      interests: "",
      specialRequests: "",
    },
  })

  const handleSubmit = async (values) => {
    const requestData = {
      destination: values.destination,
      origin: values.origin,
      departure_date: values.departureDate ? format(values.departureDate, "yyyy-MM-dd") : null,
      trip_length: 5,
      budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
      travelers: 2,
      interests: values.interests || "",
      special_requests: values.specialRequests || "",
    }
    console.log("Sending request:", requestData)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestData),
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("Response received:", responseData)
      
      onItineraryGenerated(values, responseData)
    } catch (error) {
      console.error("Error fetching itinerary:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Plan Your Trip</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Fill out the form below to get a personalized itinerary
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Paris, Tokyo, New York" {...field} />
                  </FormControl>
                  <FormDescription>Enter the city you want to visit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin City (IATA Code)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. LAX, JFK, LHR" {...field} />
                  </FormControl>
                  <FormDescription>Enter your departure city or airport code</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "yyyy/MM/dd") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When do you plan to start your trip?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Budget">Budget</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>This helps us tailor recommendations to your budget</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. nature, history, food, adventure" {...field} />
                  </FormControl>
                  <FormDescription>What activities are you interested in?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requirements or preferences?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Let us know if you have any specific requirements</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
            >
              Generate Itinerary
            </Button>
          </form>
        </Form>
      </div>
    </motion.div>
  )
}

// ItineraryDisplay component with updated async downloadPDF
function ItineraryDisplay({ itinerary }) {
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = async () => {
    if (!itinerary) return

    setDownloading(true)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/itinerary/pdf', {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No PDF available')
        }
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${itinerary.destination || 'trip'}_itinerary.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert(`Failed to download PDF: ${error.message}`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Itinerary</h2>
        {itinerary && (
          <Button
            onClick={downloadPDF}
            disabled={downloading}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
          >
            {downloading ? "Downloading..." : "Download PDF"}
            <Download className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {itinerary ? (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="prose dark:prose-invert max-w-none"
            >
              <ReactMarkdown>{itinerary.itinerary || itinerary.content || "No itinerary content available"}</ReactMarkdown>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8"
            >
              <FileText className="h-16 w-16 mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">No Itinerary Generated Yet</h3>
              <p>Fill out the form on the left to generate a personalized travel itinerary for your next adventure.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ChatInterface component integrated directly with backend API calls
function ChatInterface({ destination }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Trip Advisor. How can I help you plan your perfect trip today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRecorderRef = useRef<MediaRecorder | null>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update welcome message if destination changes
  useEffect(() => {
    if (destination) {
      const welcomeMessage: Message = {
        id: messages.length + 1,
        text: `Great! I see you're planning a trip to ${destination}. How can I help you with your ${destination} itinerary?`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, welcomeMessage])
    }
  }, [destination])

  // Async function to send message to /api/chat
  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Async function to handle speech recognition and audio submission
  const toggleListening = async () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    setIsListening(!isListening)

    if (!isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioRecorderRef.current = new MediaRecorder(stream)

        const audioChunks: Blob[] = []
        audioRecorderRef.current.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        audioRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("audio", audioBlob, "recording.webm")

          try {
            const response = await fetch("http://127.0.0.1:5000/api/audio", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const audioResponse = await response.blob()
            const audioUrl = URL.createObjectURL(audioResponse)
            const audio = new Audio(audioUrl)
            audio.play()

            // Assuming the backend might also return text in a header or separate endpoint
            const userMessage: Message = {
              id: messages.length + 1,
              text: "Audio input received",
              sender: "user",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, userMessage])

            const botMessage: Message = {
              id: messages.length + 2,
              text: "Thank you for your audio input. How else can I assist you?",
              sender: "bot",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
          } catch (error) {
            console.error("Error processing audio:", error)
            const errorMessage: Message = {
              id: messages.length + 2,
              text: "Sorry, there was an error processing your audio.",
              sender: "bot",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
          }

          stream.getTracks().forEach((track) => track.stop())
        }

        audioRecorderRef.current.start()
      } catch (error) {
        console.error("Error starting audio recording:", error)
        alert("Failed to access microphone.")
        setIsListening(false)
      }
    } else {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop()
      }
    }
  }

  // Async function to convert text to speech using /api/speech
  const textToSpeech = async (text: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "audio/mp3",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("Error generating speech:", error)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-rose-600 dark:bg-rose-800 text-white p-4">
        <h3 className="text-lg font-medium flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          AI Trip Advisor Chat
        </h3>
        <p className="text-sm opacity-90">Ask questions about your trip</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={`${message.timestamp.getTime()}-${message.sender}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar
                    className={
                      message.sender === "user"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {message.sender === "user" ? <User className="h-5 w-5 m-auto" /> : <Bot className="h-5 w-5 m-auto" />}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-rose-600 dark:bg-rose-700 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <Bot className="h-5 w-5" />
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <div className="flex space-x-1">
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={toggleListening}
            variant="outline"
            className={isListening ? "bg-rose-100 text-rose-600 border-rose-300" : ""}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
            disabled={isTyping || input.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {isListening ? "Listening... speak now" : "Press the microphone button to use voice input"}
        </div>
      </div>
    </div>
  )
}

// Main TravelDashboard component
export default function TravelDashboard({ itinerary: initialItinerary, destination: initialDestination }) {
  const [formMinimized, setFormMinimized] = useState(false)
  const [itinerary, setItinerary] = useState(initialItinerary)
  const [destination, setDestination] = useState(initialDestination)
  const [formData, setFormData] = useState(null)

  const dummyItinerary = {
    destination: "Paris",
    days: [
      { day: 1, activities: ["Arrive in Paris", "Visit Eiffel Tower", "Seine River Cruise"] },
      { day: 2, activities: ["Louvre Museum", "Notre-Dame Cathedral", "Montmartre"] },
      { day: 3, activities: ["Versailles Day Trip", "Explore Champs-Élysées", "Dinner at local bistro"] },
    ],
  }

  const handleItineraryGenerated = (formValues, responseData) => {
    setFormData(formValues)
    setItinerary(responseData)
    setDestination(formValues.destination)
    setFormMinimized(true)
  }

  return (
    <div className="flex flex-col min-h-screen h-[1220px] bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="flex items-center text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-bold text-center flex-1 text-rose-600 dark:text-rose-500">
            AI Trip Advisor
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Top: Form */}
        <div className="relative">
          <AnimatePresence>
            {!formMinimized && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4">
                  <TripForm onItineraryGenerated={handleItineraryGenerated} />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {formMinimized && (
              <motion.div
                key="fab"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 left-4 z-50"
              >
                <Button
                  onClick={() => setFormMinimized(false)}
                  className="rounded-full h-14 w-14 bg-rose-600 hover:bg-rose-700 text-white text-xl shadow-lg"
                >
                  +
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2-column layout: Itinerary + Map */}
        <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
          {/* Left: Itinerary + Bot */}
          <div className="flex flex-col gap-6 flex-1 overflow-hidden">
            <Card className="flex-1 overflow-auto p-4">
              <ItineraryDisplay itinerary={itinerary || dummyItinerary} />
            </Card>
            <Card className="overflow-scroll h-[350px] md:h-[400px] flex flex-col">
              <ChatInterface destination={destination || dummyItinerary.destination} />
            </Card>
          </div>

          {/* Right: Map */}
          <Card className="flex-1 h-full overflow-hidden p-4">
            <TripMap destination={destination || dummyItinerary.destination} />
          </Card>
        </div>
      </main>
    </div>
  )
}