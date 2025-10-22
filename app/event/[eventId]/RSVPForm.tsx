"use client";

import { useState } from "react";
import { TicketType } from "@/lib/db/schema";

export default function RSVPForm({
  eventId,
  ticketTypes,
}: {
  eventId: string;
  ticketTypes: TicketType[];
}) {
  const [selectedTicketType, setSelectedTicketType] = useState<string>(
    ticketTypes.length > 0 ? ticketTypes[0].id : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      ticketTypeId: selectedTicketType,
      eventId,
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process RSVP");
      }

      // Handle free tickets - redirect directly to thank you page
      if (result.isFree && result.redirectUrl) {
        window.location.href = result.redirectUrl;
        // Note: loading state stays true during redirect
        return;
      }

      // Handle paid tickets - redirect to Square checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        // Note: loading state stays true during redirect, which is intentional
        // It prevents double-submission while navigating to Square
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process RSVP. Please try again.");
      setLoading(false);
    }
  }

  // Check for sold out tickets
  const getTicketAvailability = (ticket: TicketType) => {
    if (!ticket.quantity) return { available: true, remaining: null };
    const sold = parseInt(ticket.quantitySold || "0");
    const max = parseInt(ticket.quantity);
    const remaining = max - sold;
    return { available: remaining > 0, remaining };
  };

  const selectedTicket = ticketTypes.find((tt) => tt.id === selectedTicketType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Ticket Type Selection */}
      {ticketTypes.length > 0 && (
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Select Ticket Type
          </label>
          <div className="grid gap-3">
            {ticketTypes.map((ticket) => {
              const { available, remaining } = getTicketAvailability(ticket);
              const isSelected = selectedTicketType === ticket.id;

              return (
                <div
                  key={ticket.id}
                  onClick={() => available && setSelectedTicketType(ticket.id)}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                    !available
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          checked={isSelected}
                          disabled={!available}
                          onChange={() => setSelectedTicketType(ticket.id)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <h3 className="font-bold text-lg">{ticket.name}</h3>
                      </div>
                      {ticket.description && (
                        <p className="text-sm text-gray-600 ml-6">
                          {ticket.description}
                        </p>
                      )}
                      {remaining !== null && available && (
                        <p className="text-xs text-gray-500 ml-6 mt-1">
                          {remaining} ticket{remaining !== 1 ? "s" : ""} remaining
                        </p>
                      )}
                      {!available && (
                        <p className="text-sm text-red-600 ml-6 font-medium">
                          SOLD OUT
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${ticket.price}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={255}
          placeholder="john@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          maxLength={20}
          placeholder="+1 (555) 123-4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {/* <p className="text-sm text-gray-500 mt-1">
          We'll use this to send event updates via SMS
        </p> */}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            Processing...
          </>
        ) : selectedTicket && parseFloat(selectedTicket.price) === 0 ? (
          "Reserve Your Spot"
        ) : (
          "Continue to Payment"
        )}
      </button>

      {selectedTicket && parseFloat(selectedTicket.price) > 0 && (
        <p className="text-sm text-gray-500 text-center">
          You'll be redirected to Square to complete your payment securely
        </p>
      )}
    </form>
  );
}
