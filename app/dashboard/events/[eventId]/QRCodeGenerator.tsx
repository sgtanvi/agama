"use client";

import { useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
}

export default function QRCodeGenerator({ eventId, eventTitle, eventUrl }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrCodeUrl = await QRCode.toDataURL(eventUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(qrCodeUrl);
      setShowQR(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.download = `${eventTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_qr_code.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  const copyEventLink = () => {
    navigator.clipboard.writeText(eventUrl);
    // You could add a toast notification here
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">📱 Share Event QR Code</h3>
      <p className="text-gray-600 mb-4">
        Generate a QR code that attendees can scan to quickly access your event page.
      </p>

      <div className="space-y-4">
        {/* Event URL Display */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500 mb-1">Event URL:</p>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-white px-2 py-1 rounded border flex-1 truncate">
              {eventUrl}
            </code>
            <button
              onClick={copyEventLink}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Generate QR Code Button */}
        <button
          onClick={generateQRCode}
          disabled={isGenerating}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
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
              Generating QR Code...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              Generate QR Code
            </>
          )}
        </button>

        {/* QR Code Display */}
        {showQR && qrCodeDataUrl && (
          <div className="text-center">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
              <img
                src={qrCodeDataUrl}
                alt={`QR Code for ${eventTitle}`}
                className="mx-auto"
              />
              <p className="text-sm text-gray-600 mt-2">
                Scan to visit: <strong>{eventTitle}</strong>
              </p>
            </div>

            {/* Download Button */}
            <div className="mt-4">
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download QR Code
              </button>
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Usage Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Print the QR code on flyers, posters, or business cards</li>
            <li>• Share digitally on social media or email</li>
            <li>• Display on screens at your venue</li>
            <li>• Include in event materials and invitations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
