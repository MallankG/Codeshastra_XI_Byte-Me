'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaTrainSubway } from "react-icons/fa6"
import { motion } from "framer-motion"
import Image from "next/image"

const trains = [
  {
    route: "Mumbai → Delhi",
    type: "Rajdhani Express",
    duration: "15h 30m",
    image: "/images/train1.jpg",
  },
  {
    route: "Bangalore → Hyderabad",
    type: "Shatabdi Express",
    duration: "8h 10m",
    image: "/images/train2.jpg",
  },
  {
    route: "Kolkata → Chennai",
    type: "Duronto Express",
    duration: "19h 45m",
    image: "/images/train3.jpg",
  },
]

export default function TrainSearchSection() {
  return (
    <section className="px-4 py-10 md:py-16 bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
          🚆 Train Search
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Find and book your train tickets easily. Real-time info, availability, and smooth booking.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block mt-6"
        >
          <Link href="/train-ticket-booking">
            <Button className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white text-sm md:text-base px-6 py-2 shadow-md">
              <FaTrainSubway className="mr-2 h-5 w-5" />
              Train Ticket Booking
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {trains.map((train, index) => (
          <motion.div
            key={train.route}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* <div className="relative h-48 w-full">
              <Image
                src={train.image}
                alt={train.route}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-500"
              />
            </div> */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">
                {train.route}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{train.type}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{train.duration} journey</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
