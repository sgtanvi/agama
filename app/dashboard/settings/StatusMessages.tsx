"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatusMessages() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "connected") {
      setMessage({
        type: "success",
        text: "✅ Square account connected successfully! You can now receive payments for your events.",
      });
    } else if (success === "disconnected") {
      setMessage({
        type: "success",
        text: "✅ Square account disconnected successfully.",
      });
    } else if (error === "oauth_failed") {
      setMessage({
        type: "error",
        text: "❌ Square authorization failed. Please try again.",
      });
    } else if (error === "missing_params") {
      setMessage({
        type: "error",
        text: "❌ Invalid authorization response. Please try again.",
      });
    } else if (error === "processing_failed") {
      setMessage({
        type: "error",
        text: "❌ Failed to process Square authorization. Please try again.",
      });
    } else if (error === "disconnect_failed") {
      setMessage({
        type: "error",
        text: "❌ Failed to disconnect Square account. Please try again.",
      });
    }

    // Clear message after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!message) return null;

  return (
    <div
      className={`mb-6 rounded-lg p-4 ${
        message.type === "success"
          ? "bg-green-50 border-2 border-green-200"
          : "bg-red-50 border-2 border-red-200"
      }`}
    >
      <p
        className={`font-medium ${
          message.type === "success" ? "text-green-800" : "text-red-800"
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}
