import { db } from "@/lib/db";
import { events, ticketTypes } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import RSVPForm from "./RSVPForm";

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // Fetch event details
  const [event] = await db.select().from(events).where(eq(events.id, eventId));

  if (!event) {
    redirect("/");
  }

  // Fetch active ticket types
  const availableTicketTypes = await db
    .select()
    .from(ticketTypes)
    .where(and(eq(ticketTypes.eventId, eventId), eq(ticketTypes.isActive, true)))
    .orderBy(asc(ticketTypes.displayOrder));

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Image Hero */}
          {event.coverImageUrl && (
            <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-blue-400 to-purple-500">
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

            {/* Organizer Info */}
            {event.organizerName && (
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <span className="text-sm">by</span>
                {event.organizerLogoUrl && (
                  <img
                    src={event.organizerLogoUrl}
                    alt={event.organizerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">{event.organizerName}</span>
              </div>
            )}

          {event.description && (
            <p className="text-lg text-gray-700 mb-6">{event.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-medium text-gray-900">Date & Time</p>
                <p className="text-gray-600">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-gray-900">Ticket Price</p>
                <p className="text-2xl font-bold text-green-600">
                  ${event.price}
                </p>
              </div>
            </div>

            {event.maxAttendees && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-medium text-gray-900">Capacity</p>
                  <p className="text-gray-600">{event.maxAttendees} attendees</p>
                </div>
              </div>
            )}
          </div>

          {isPastEvent && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-center">
                ⚠️ This event has already passed. Registration is closed.
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <Link
              href={`/event/${eventId}/photos`}
              className="flex-1 min-w-[200px] px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center font-medium"
            >
              📸 View Photo Gallery
            </Link>
            <Link
              href={`/event/${eventId}/upload`}
              className="flex-1 min-w-[200px] px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition text-center font-medium"
            >
              📤 Upload Photos
            </Link>
          </div>
          </div>
        </div>

        {/* RSVP Form */}
        {!isPastEvent && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Reserve Your Spot</h2>
            <RSVPForm eventId={eventId} ticketTypes={availableTicketTypes} />
          </div>
        )}

        {/* Powered by Agama Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <span>Powered by</span>
            <span className="font-semibold text-blue-600">Agama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
