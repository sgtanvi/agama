import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, attendees } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import QRCodeGenerator from "./QRCodeGenerator";
import QRCodeButton from "./QRCodeButton";
import DeleteEventButton from "./DeleteEventButton";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { eventId } = await params;

  // Fetch event (must belong to current user)
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organizerId, userId)));

  if (!event) {
    redirect("/dashboard");
  }

  // Fetch attendees for this event
  const eventAttendees = await db
    .select()
    .from(attendees)
    .where(eq(attendees.eventId, eventId));

  const paidAttendees = eventAttendees.filter(
    (a) => a.paymentStatus === "paid"
  );
  const totalRevenue = paidAttendees.reduce(
    (sum, attendee) => sum + parseFloat(attendee.pricePaid || "0"),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Event Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          {event.description && (
            <p className="text-gray-600 mb-4">{event.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{event.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ticket Price</p>
              <p className="font-medium text-lg">${event.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Attendees</p>
              <p className="font-medium">
                {event.maxAttendees || "Unlimited"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total RSVPs</p>
            <p className="text-3xl font-bold">{eventAttendees.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Paid Tickets</p>
            <p className="text-3xl font-bold text-green-600">
              {paidAttendees.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/event/${event.id}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Public Event Page
            </Link>
            <Link
              href={`/dashboard/events/${event.id}/tickets`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              🎟️ Manage Tickets
            </Link>
            <Link
              href={`/dashboard/events/${event.id}/broadcast`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Send Broadcast
            </Link>
            <Link
              href={`/dashboard/events/${event.id}/gallery`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              View Gallery
            </Link>
            <QRCodeButton eventId={event.id} />
          </div>
        </div>

        {/* QR Code Generator */}
        <div id="qr-code-section" className="mb-6">
          <QRCodeGenerator
            eventId={event.id}
            eventTitle={event.title}
            eventUrl={`${process.env.NEXT_PUBLIC_APP_URL}/event/${event.id}`}
          />
        </div>

        {/* Attendees List */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Attendees</h2>
          {eventAttendees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No RSVPs yet. Share your event link to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eventAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{attendee.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {attendee.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {attendee.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attendee.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : attendee.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {attendee.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(attendee.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Event */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Event</h2>
              <p className="text-sm text-gray-500 mt-1">
                Permanently remove this event and all its data
              </p>
            </div>
            <DeleteEventButton eventId={event.id} eventTitle={event.title} />
          </div>
        </div>
    </div>
  );
}
