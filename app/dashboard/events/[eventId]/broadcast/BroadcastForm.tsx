"use client";

import { useState } from "react";

export default function BroadcastForm({
  eventId,
  recipientCount,
}: {
  eventId: string;
  recipientCount: number;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    total: number;
    sent: number;
    failed: number;
  } | null>(null);

  const characterCount = message.length;
  const characterLimit = 1600;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (recipientCount === 0) {
      setError("No paid attendees to send message to");
      return;
    }

    const confirmed = confirm(
      `Send this message to ${recipientCount} attendees?\n\n"${message}"`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          message: message.trim(),
          channel: "sms",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send broadcast");
      }

      setSuccess({
        total: data.broadcast.totalRecipients,
        sent: data.broadcast.successCount,
        failed: data.broadcast.failedCount,
      });

      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send broadcast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium mb-1">
            ✅ Broadcast sent successfully!
          </p>
          <p className="text-green-700 text-sm">
            {success.sent} of {success.total} messages delivered
            {success.failed > 0 && ` (${success.failed} failed)`}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Message Input */}
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={6}
          maxLength={characterLimit}
          disabled={loading || recipientCount === 0}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">
            {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
          </p>
          <p
            className={`text-sm ${
              characterCount > characterLimit * 0.9
                ? "text-red-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {characterCount} / {characterLimit}
          </p>
        </div>
      </div>

      {/* Message Templates */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Quick Templates:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setMessage(
                "Hi! Just a reminder about our event tomorrow. Looking forward to seeing you there!"
              )
            }
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Event Reminder
          </button>
          <button
            type="button"
            onClick={() =>
              setMessage(
                "Thank you for attending! Don't forget to upload your photos from the event."
              )
            }
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Thank You
          </button>
          <button
            type="button"
            onClick={() =>
              setMessage(
                "Update: There has been a change to the event schedule. Please check your email for details."
              )
            }
            disabled={loading}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Schedule Update
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || recipientCount === 0 || !message.trim()}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
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
            Sending...
          </span>
        ) : (
          `Send to ${recipientCount} Attendee${recipientCount !== 1 ? "s" : ""}`
        )}
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Messages will only be sent to attendees who have completed payment
      </p>
    </form>
  );
}
