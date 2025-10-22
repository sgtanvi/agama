"use client";

import { useState } from "react";
import { TicketType } from "@/lib/db/schema";

interface TicketTypeForm {
  id?: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  isActive: boolean;
}

export default function TicketTypeManager({
  eventId,
  existingTicketTypes,
  defaultPrice,
}: {
  eventId: string;
  existingTicketTypes: TicketType[];
  defaultPrice: string;
}) {
  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>(
    existingTicketTypes.length > 0
      ? existingTicketTypes.map((tt) => ({
          id: tt.id,
          name: tt.name,
          description: tt.description || "",
          price: tt.price,
          quantity: tt.quantity || "",
          isActive: tt.isActive,
        }))
      : [
          {
            name: "General Admission",
            description: "Standard ticket",
            price: "0",
            quantity: "",
            isActive: true,
          },
        ]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        name: "",
        description: "",
        price: "0",
        quantity: "",
        isActive: true,
      },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: keyof TicketTypeForm, value: any) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate
      for (const tt of ticketTypes) {
        if (!tt.name.trim()) {
          throw new Error("All ticket types must have a name");
        }
        if (!tt.price || parseFloat(tt.price) < 0) {
          throw new Error("All ticket types must have a valid price");
        }
      }

      const response = await fetch(`/api/events/${eventId}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketTypes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save ticket types");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Update with returned IDs
      if (data.ticketTypes) {
        setTicketTypes(
          data.ticketTypes.map((tt: TicketType) => ({
            id: tt.id,
            name: tt.name,
            description: tt.description || "",
            price: tt.price,
            quantity: tt.quantity || "",
            isActive: tt.isActive,
          }))
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Configure Ticket Types</h2>
        <button
          onClick={addTicketType}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          + Add Ticket Type
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✅ Ticket types saved successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Ticket Types List */}
      <div className="space-y-4 mb-6">
        {ticketTypes.map((tt, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Name *
                </label>
                <input
                  type="text"
                  value={tt.name}
                  onChange={(e) => updateTicketType(index, "name", e.target.value)}
                  placeholder="e.g., Early Bird, VIP, Student"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  value={tt.price}
                  onChange={(e) => updateTicketType(index, "price", e.target.value)}
                  placeholder="25.00"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={tt.description}
                  onChange={(e) => updateTicketType(index, "description", e.target.value)}
                  placeholder="Brief description of what's included"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Quantity (Optional)
                </label>
                <input
                  type="number"
                  value={tt.quantity}
                  onChange={(e) => updateTicketType(index, "quantity", e.target.value)}
                  placeholder="Leave empty for unlimited"
                  min="1"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tt.isActive}
                    onChange={(e) => updateTicketType(index, "isActive", e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active (visible to attendees)
                  </span>
                </label>
              </div>
            </div>

            {/* Remove Button */}
            {ticketTypes.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => removeTicketType(index)}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-700 font-medium disabled:text-gray-400"
                >
                  Remove Ticket Type
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={loading || ticketTypes.length === 0}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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
              Saving...
            </>
          ) : (
            "Save Ticket Types"
          )}
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-4 text-center">
          💡 Tip: Attendees will see these ticket types when they RSVP
        </p>
        <div className="flex justify-center">
          <a
            href={`/dashboard/events/${eventId}`}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Continue to Event Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
