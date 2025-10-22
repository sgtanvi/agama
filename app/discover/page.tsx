// DISCOVER PAGE TEMPORARILY DISABLED
// Uncomment this page when you're ready to enable event discovery

// import { db } from "@/lib/db";
// import { events } from "@/lib/db/schema";
// import { gte, asc } from "drizzle-orm";
import Link from "next/link";

export default async function DiscoverPage() {
  // TEMPORARILY DISABLED - Show coming soon page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl text-center space-y-6 bg-white rounded-2xl shadow-xl p-12">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-4xl font-bold">Coming Soon</h1>
        <p className="text-xl text-gray-600">
          Event discovery is currently under development. Check back soon!
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

  /* ORIGINAL CODE - COMMENTED OUT FOR NOW
  // Fetch all upcoming events (not past events)
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(gte(events.date, new Date()))
    .orderBy(asc(events.date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header *\/}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              Agama
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Organizer Login
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header *\/}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Discover Events</h1>
          <p className="text-xl text-gray-600">
            Find and join amazing events happening near you
          </p>
        </div>

        {/* Events Grid *\/}
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl text-gray-600 mb-2">No upcoming events yet</p>
            <p className="text-gray-500">Check back soon for exciting events!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                {/* Event Image Placeholder *\/}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">🎉</span>
                </div>

                {/* Event Details *\/}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                    {event.title}
                  </h2>

                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>📅</span>
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>🕐</span>
                      <span>
                        {new Date(event.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Price *\/}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500">Ticket Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${event.price}
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                      View Details
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action for Organizers *\/}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to host your own event?</h2>
          <p className="text-gray-600 mb-6">
            Create and manage events with Agama's powerful organizer tools
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Get Started as an Organizer
          </Link>
        </div>
      </div>
    </div>
  );
  */
}
