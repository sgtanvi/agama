import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, attendees, broadcasts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import BroadcastForm from "./BroadcastForm";

export default async function BroadcastPage({
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

  // Fetch past broadcasts
  const pastBroadcasts = await db
    .select()
    .from(broadcasts)
    .where(eq(broadcasts.eventId, eventId))
    .orderBy(desc(broadcasts.sentAt))
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Send Broadcast Message</h1>
          <p className="text-gray-600 mb-4">{event.title}</p>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">Total RSVPs:</span>{" "}
              <span className="font-medium">{eventAttendees.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Paid Attendees:</span>{" "}
              <span className="font-medium text-green-600">
                {paidAttendees.length}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        {paidAttendees.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ No paid attendees yet. Messages will only be sent to attendees
              who have completed payment.
            </p>
          </div>
        )}

        {/* Broadcast Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Compose Message</h2>
          <BroadcastForm eventId={eventId} recipientCount={paidAttendees.length} />
        </div>

        {/* Past Broadcasts */}
        {pastBroadcasts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Past Broadcasts</h2>
            <div className="space-y-4">
              {pastBroadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">
                      {new Date(broadcast.sentAt).toLocaleString()}
                    </p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {broadcast.recipientCount} recipients
                    </span>
                  </div>
                  <p className="text-gray-800">{broadcast.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
