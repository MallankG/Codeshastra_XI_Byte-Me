// "use client"
// import { motion } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
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
// import type { TripFormData } from "@/app/ai-trip-advisor/page"

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

// interface TripFormProps {
//   onSubmit: (data: TripFormData) => void
// }

// export default function TripForm({ onSubmit }: TripFormProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   function handleSubmit(values: z.infer<typeof formSchema>) {
//     onSubmit(values as TripFormData)
//     handleSendClick(values)
//   }

//   async function handleSendClick(formValues: z.infer<typeof formSchema>) {
//     const requestData = {
//       destination: formValues.destination,
//       origin: formValues.origin,
//       departure_date: formValues.departureDate
//         ? format(formValues.departureDate, "yyyy-MM-dd")
//         : null,
//       trip_length: 5, // static for now
//       budget: formValues.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2, // static for now
//       interests: formValues.interests,
//       special_requests: formValues.specialRequests,
//     }

//     try {
//       const response = await fetch("https://6v2nbjpq-5000.inc1.devtunnels.ms/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log("Received Itinerary:", data.itinerary)

//       const itineraryElement = document.getElementById("itinerary-output")
//       if (itineraryElement) {
//         itineraryElement.textContent = data.itinerary
//       }
//     } catch (error) {
//       console.error("Error while fetching itinerary:", error)
//       const itineraryElement = document.getElementById("itinerary-output")
//       if (itineraryElement) {
//         itineraryElement.textContent = "Failed to fetch itinerary. Please try again."
//       }
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




"use client"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { cn } from "@/lib/utils"

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

interface TripFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
}

export default function TripForm({ onSubmit }: TripFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      origin: "",
      budgetLevel: "Medium",
      interests: "",
      specialRequests: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)  // Pass data to parent component
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






// "use client"

// import { motion } from "framer-motion"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
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

// export default function TripForm() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       origin: "",
//       budgetLevel: "Medium",
//       interests: "",
//       specialRequests: "",
//     },
//   })

//   async function handleSubmit(values: z.infer<typeof formSchema>) {
//     const requestData = {
//       destination: values.destination,
//       origin: values.origin,
//       departure_date: values.departureDate
//         ? format(values.departureDate, "yyyy-MM-dd")
//         : null,
//       trip_length: 5, // static
//       budget: values.budgetLevel?.toUpperCase() || "MEDIUM",
//       travelers: 2, // static
//       interests: values.interests,
//       special_requests: values.specialRequests,
//     }

//     try {
//       const response = await fetch("https://6v2nbjpq-5000.inc1.devtunnels.ms/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log("Received Itinerary:", data.itinerary)

//       const itineraryElement = document.getElementById("itinerary-output")
//       if (itineraryElement) {
//         itineraryElement.textContent = data.itinerary
//       }
//     } catch (error) {
//       console.error("Error while fetching itinerary:", error)
//       const itineraryElement = document.getElementById("itinerary-output")
//       if (itineraryElement) {
//         itineraryElement.textContent = "Failed to fetch itinerary. Please try again."
//       }
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
//             {/* Your form fields remain unchanged */}
//             {/* Destination, Origin, Date, Budget, Interests, Special Requests */}
//             {/* Keep the rest of your original JSX here as-is */}

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
