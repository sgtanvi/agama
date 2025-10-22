import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import UploadForm from "./UploadForm";

export default async function UploadPage({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Share Your Photos</h1>
          <p className="text-xl text-gray-600">{event.title}</p>
          <p className="text-gray-500 mt-2">
            Upload photos from the event anonymously
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <UploadForm eventId={eventId} />
        </div>

        {/* Info */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            📸 Photos are uploaded anonymously<br />
            🎉 Help capture the memories of this event!
          </p>
          <Link
            href={`/event/${eventId}/photos`}
            className="inline-block text-purple-600 hover:text-purple-700 font-medium underline"
          >
            View all event photos →
          </Link>
        </div>
      </div>
    </div>
  );
}
