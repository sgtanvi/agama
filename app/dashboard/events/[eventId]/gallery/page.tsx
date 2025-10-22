import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { events, mediaAssets } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import GalleryActions from "./GalleryActions";

export default async function GalleryPage({
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

  // Fetch all photos for this event
  const photos = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.eventId, eventId))
    .orderBy(desc(mediaAssets.uploadedAt));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Photo Gallery</h1>
              <p className="text-gray-600">{event.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Photos</p>
              <p className="text-3xl font-bold">{photos.length}</p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No photos uploaded yet</p>
            <Link
              href={`/event/${eventId}/upload`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Share upload link with attendees →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-4 hover:ring-blue-400 transition group block"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={photo.url}
                    alt="Event photo"
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition">
                    {new Date(photo.uploadedAt).toLocaleString()}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        {photos.length > 0 && (
          <GalleryActions eventId={eventId} photoUrls={photos.map(p => p.url)} />
        )}
    </div>
  );
}
