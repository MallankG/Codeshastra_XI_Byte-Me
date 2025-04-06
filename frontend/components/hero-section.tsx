import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-[400px] w-full">
      <Image
        src="https://www.luxurytravelmag.com.au/wp-content/uploads/2019/04/Book-Now-1.jpg"
        alt="Travel destinations"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto px-4 py-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Perfect Trip</h1>
          <p className="text-xl md:text-2xl max-w-2xl">
            Find and book the best deals on flights, hotels, and vacation packages
          </p>
        </div>
      </div>
    </div>
  )
}

