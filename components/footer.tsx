import Link from "next/link"
import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Hotels</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hyatt Regency Dubai
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Pan Pacific Singapore
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    The Palm Dubai
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Caesars Palace
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Baiyoke Sky Hotel
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Centara Pattaya Hotel
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Popular Destinations</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Jaipur
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Goa
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Delhi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Udaipur
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Gurgaon
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Hotels in Mumbai
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Payment Options
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-600 dark:hover:text-rose-500">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <Link
                  href="#"
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>

              <h3 className="font-bold text-lg mb-4">Download App</h3>
              <div className="flex space-x-4">
                <Link href="#">
                  <div className="bg-black text-white px-4 py-2 rounded-md text-xs">
                    <div className="text-[10px]">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </Link>
                <Link href="#">
                  <div className="bg-black text-white px-4 py-2 rounded-md text-xs">
                    <div className="text-[10px]">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 TRAVELEASE PVT. LTD.</p>
        </div>
      </div>
    </footer>
  )
}

