import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, ticketTypes } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import TicketTypeManager from "./TicketTypeManager";

export default async function TicketsPage({
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

  // Fetch existing ticket types
  const existingTicketTypes = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.eventId, eventId))
    .orderBy(asc(ticketTypes.displayOrder));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ticket Types</h1>
            <p className="text-gray-600">{event.title}</p>
          </div>
          <Link
            href={`/dashboard/events/${eventId}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back to Event
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Set up your tickets:</strong> Create different ticket types with different prices.
            For free events, set the price to $0. Examples: Early Bird ($25), General ($35), VIP ($75), Student ($20), Free ($0)
          </p>
        </div>
      </div>

      {/* Ticket Type Manager */}
      <TicketTypeManager
        eventId={eventId}
        existingTicketTypes={existingTicketTypes}
        defaultPrice={event.price}
      />
    </div>
  );
}
