import { db } from "@/lib/db";
import { events, mediaAssets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function PublicGalleryPage({
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

  // Fetch all photos for this event
  const photos = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.eventId, eventId))
    .orderBy(desc(mediaAssets.uploadedAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600">Photo Gallery</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/event/${eventId}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
              >
                ← Event Details
              </Link>
              <Link
                href={`/event/${eventId}/upload`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
              >
                📸 Upload Your Photos
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              <span className="font-bold text-2xl text-purple-600">
                {photos.length}
              </span>{" "}
              photo{photos.length !== 1 ? "s" : ""} shared by attendees
            </p>
          </div>
        </div>

        {/* Gallery */}
        {photos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold mb-2">No photos yet</h2>
            <p className="text-gray-600 mb-6">
              Be the first to share your memories from this event!
            </p>
            <Link
              href={`/event/${eventId}/upload`}
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Upload Photos
            </Link>
          </div>
        ) : (
          <>
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer group"
                >
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative">
                      <Image
                        src={photo.url}
                        alt="Event photo"
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          />
                        </svg>
                      </div>
                    </div>
                    {/* Timestamp */}
                    <div className="p-3">
                      <p className="text-xs text-gray-500">
                        {new Date(photo.uploadedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">
                Share your memories too!
              </h2>
              <p className="mb-6 opacity-90">
                Upload your photos from this event and help capture the moment
              </p>
              <Link
                href={`/event/${eventId}/upload`}
                className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Upload Your Photos
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
