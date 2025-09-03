import Link from "next/link"

export default function JerryStoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 py-6 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome to</h1>
          <h2 className="text-4xl font-serif font-bold text-white">AlertBayTrumpeter.com!</h2>

          {/* Navigation */}
          <nav className="mt-6 flex justify-center space-x-8 text-sm">
            <Link
              href="/"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Home
            </Link>
            <Link href="/jerry-story" className="text-blue-200 font-bold underline">
              Jerry's Story
            </Link>
            <Link
              href="/masks-art"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Traditional Indigenous Masks & Art
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-blue-200 font-semibold hover:underline transition-all duration-200"
            >
              Get in Touch
            </Link>
          </nav>
        </div>
      </header>

      {/* Jerry's Story Content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-slate-700 mb-8 text-center">Jerry's Story</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/jerry-portrait.jpeg"
                alt="Jerry Higginson smiling warmly"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/jerry-with-mask.jpeg"
                alt="Jerry with traditional Indigenous mask"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/jerry-on-boat.jpeg"
                alt="Jerry on his boat with beautiful coastline"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-slate-700 leading-relaxed">
              Jerry Higginson has been the Alert Bay Trumpeter for over 27 years, bringing joy and music to cruise ship
              passengers traveling through the beautiful waters of northern Vancouver Island.
            </p>

            <p className="text-slate-700 leading-relaxed">
              Since 1996, Jerry has performed over 1000 nautical serenades, creating unforgettable memories for millions
              of passengers from around the world. His dedication to spreading happiness through music has made him a
              beloved figure in the maritime community.
            </p>

            <p className="text-slate-700 leading-relaxed">
              From his small boat, Jerry greets each passing cruise ship with enthusiasm and his signature trumpet
              performances, embodying the spirit of Alert Bay and the warmth of Canadian hospitality.
            </p>

            <p className="text-slate-700 leading-relaxed">
              Jerry's mission is simple: to bring smiles to people's faces and create magical moments at sea. His
              passion for music and connection with travelers has made him an integral part of the cruise experience
              through the Johnstone Straits.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="mb-6">
                <img
                  src="/images/jerry-masks-display.jpeg"
                  alt="Jerry's traditional Indigenous masks with cedar bark fringe"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg object-cover"
                />
              </div>
              <Link
                href="/masks-art"
                className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View Jerry's Indigenous Mask & Art Collection
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-blue-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Contact Jerry</h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start">
                  <span className="font-semibold mb-1 md:mb-0 md:mr-2">Email:</span>
                  <a href="mailto:alertbaytrumpeter@icloud.com" className="hover:text-blue-300 transition-colors">
                    alertbaytrumpeter@icloud.com
                  </a>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start">
                  <span className="font-semibold mb-1 md:mb-0 md:mr-2">Phone:</span>
                  <a href="tel:250-641-6204" className="hover:text-blue-300 transition-colors">
                    250 - 641- 6204
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Location</h3>
              <div className="text-blue-100 leading-relaxed">
                <p>Hyde Creek Rd</p>
                <p>British Columbia V0N 2R0</p>
                <p>Canada</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-bold">Alert Bay Trumpeter</h3>
              <p className="text-blue-100">Spreading smiles at sea since 1996</p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-6">
                <Link href="/jerry-story" className="hover:text-blue-300 transition-colors">
                  Jerry's Story
                </Link>
                <Link href="/masks-art" className="hover:text-blue-300 transition-colors">
                  Art Collection
                </Link>
                <Link href="/contact" className="hover:text-blue-300 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 text-center">
            <p className="text-blue-200">© 2024 Alert Bay Trumpeter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
