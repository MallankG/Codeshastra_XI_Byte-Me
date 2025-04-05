"use client"
import Link from "next/link"
import { SearchForm } from "@/components/search-form"
import { OfferSection } from "@/components/offer-section"
import { FeatureSection } from "@/components/feature-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ThemeToggle } from "@/components/theme-toggle"
import { ExploreButton } from "@/components/explore-button"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-500">TravelEase</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/offers" className="text-sm font-medium hover:text-rose-600 dark:hover:text-rose-500">
              Offers
            </Link>
            <Link href="/support" className="text-sm font-medium hover:text-rose-600 dark:hover:text-rose-500">
              Support
            </Link>
            <Link href="/trips" className="text-sm font-medium hover:text-rose-600 dark:hover:text-rose-500">
              My Trips
            </Link>
            {/* <Link href="/login" className="text-sm font-medium hover:text-rose-600 dark:hover:text-rose-500">
              Login
            </Link> */}
            {/* <SignInButton /> */}
            {/* <Link
              href="/login?tab=signup"
              className="text-sm font-medium bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white px-4 py-2 rounded-md"
            >
              Sign Up
            </Link> */}
            {/* <SignUpButton /> */}

            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <ExploreButton />
            <ThemeToggle />
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button className="text-gray-700 dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <HeroSection />
      <SearchForm />
      <OfferSection />
      <FeatureSection />
      <Footer />
    </main>
  )
}

