"use client";

import { useState } from "react";
import { createEvent } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await createEvent(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.eventId) {
      // Navigate to ticket manager
      router.push(`/dashboard/events/${result.eventId}/tickets`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          placeholder="Summer Music Festival"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          placeholder="Tell attendees what to expect..."
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Date and Time */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Event Date & Time *
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          required
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          maxLength={200}
          placeholder="123 Main St, City, State"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Max Attendees */}
      <div>
        <label
          htmlFor="maxAttendees"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Max Attendees
        </label>
        <input
          type="number"
          id="maxAttendees"
          name="maxAttendees"
          min="1"
          placeholder="100"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for unlimited
        </p>
      </div>

      {/* Branding Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Event Branding (Optional)</h3>

        {/* Cover Image URL */}
        <div className="mb-4">
          <label
            htmlFor="coverImageUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverImageUrl"
            name="coverImageUrl"
            placeholder="https://example.com/event-flyer.jpg"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add a flyer or hero image for your event page
          </p>
        </div>

        {/* Organizer Name */}
        <div className="mb-4">
          <label
            htmlFor="organizerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Organizer Name
          </label>
          <input
            type="text"
            id="organizerName"
            name="organizerName"
            maxLength={100}
            placeholder="Your name or organization"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be displayed on your event page
          </p>
        </div>

        {/* Organizer Logo URL */}
        <div>
          <label
            htmlFor="organizerLogoUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Organizer Logo URL
          </label>
          <input
            type="url"
            id="organizerLogoUrl"
            name="organizerLogoUrl"
            placeholder="https://example.com/logo.png"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Small logo to display next to your organizer name
          </p>
        </div>
      </div>

      {/* Info about ticket pricing */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Next step:</strong> After creating your event, you'll set up ticket types and pricing
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Event...
            </>
          ) : (
            "Create Event"
          )}
        </button>
        <Link
          href="/dashboard"
          className={`px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center ${
            loading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
