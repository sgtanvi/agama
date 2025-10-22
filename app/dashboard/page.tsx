import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, squareAccounts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userEvents = await db
    .select()
    .from(events)
    .where(eq(events.organizerId, userId))
    .orderBy(desc(events.date));

  // Check if organizer has connected Square
  const [squareAccount] = await db
    .select()
    .from(squareAccounts)
    .where(eq(squareAccounts.organizerId, userId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Events</h1>
          <div className="flex gap-3">
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Settings
            </Link>
            <Link
              href="/dashboard/create"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Create Event
            </Link>
          </div>
        </div>

        {userEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No events yet</p>
            <Link
              href="/dashboard/create"
              className="text-blue-600 hover:underline"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {userEvents.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${event.price}</p>
                    <p className="text-sm text-gray-500">per ticket</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
