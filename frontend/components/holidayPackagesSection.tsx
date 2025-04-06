'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MdHolidayVillage } from "react-icons/md"
import { motion } from "framer-motion"
import Image from "next/image"

const holidayPackages = [
  {
    title: "Maldives Escape",
    desc: "5 nights in a water villa with spa & snorkeling.",
    image: "/images/maldives.jpg",
  },
  {
    title: "Swiss Alps Adventure",
    desc: "7-day guided tour with skiing and scenic train rides.",
    image: "/images/switzerland.jpg",
  },
  {
    title: "Dubai Luxury Getaway",
    desc: "Experience desert safaris, Burj Khalifa, and 5-star stay.",
    image: "/images/dubai.jpg",
  },
]

export default function HolidayPackagesSection() {
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
          🏖️ Holiday Packages
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Explore curated holiday packages that suit every traveler – from romantic beaches to thrilling adventures.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block mt-6"
        >
          <Link href="/holiday-packages">
            <Button className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white text-sm md:text-base px-6 py-2 shadow-md">
              <MdHolidayVillage className="mr-2 h-5 w-5" />
              View Holiday Packages
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {holidayPackages.map((pkg, index) => (
          <motion.div
            key={pkg.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* <div className="relative h-48 w-full">
              <Image
                src={pkg.image}
                alt={pkg.title}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-500"
              />
            </div> */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-1">
                {pkg.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{pkg.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
