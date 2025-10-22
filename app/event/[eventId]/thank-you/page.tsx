import { db } from "@/lib/db";
import { events, attendees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ attendee?: string }>;
}) {
  const { eventId } = await params;
  const { attendee: attendeeId } = await searchParams;

  if (!attendeeId) {
    redirect(`/event/${eventId}`);
  }

  // Fetch event and attendee details
  const [event] = await db.select().from(events).where(eq(events.id, eventId));
  const [attendee] = await db
    .select()
    .from(attendees)
    .where(eq(attendees.id, attendeeId));

  if (!event || !attendee) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            You're All Set!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for registering, {attendee.name}!
          </p>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="font-medium text-gray-900">When</p>
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
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-medium text-gray-900">Where</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-lg mb-3">What's Next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <span>
                  Check your email (<strong>{attendee.email}</strong>) for your
                  confirmation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>
                  We'll send event updates to <strong>{attendee.phone}</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>📸</span>
                <span>You can upload photos during the event!</span>
              </li>
            </ul>
          </div>

          {/* Payment Status */}
          <div className="mb-8">
            <p className="text-sm text-gray-500">
              Payment Status:{" "}
              <span
                className={`font-medium ${
                  attendee.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {attendee.paymentStatus === "paid"
                  ? "✓ Confirmed"
                  : "⏳ Processing..."}
              </span>
            </p>
            {attendee.paymentStatus !== "paid" && (
              <p className="text-xs text-gray-500 mt-1">
                Your payment is being processed. You'll receive confirmation
                shortly.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/event/${eventId}/photos`}
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition font-medium text-lg text-center"
            >
              📸 View Photo Gallery
            </Link>
            <Link
              href={`/event/${eventId}/upload`}
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg text-center"
            >
              📤 Upload Your Photos
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            See you at the event! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
