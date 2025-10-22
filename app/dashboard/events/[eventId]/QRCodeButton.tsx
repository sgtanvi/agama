"use client";

import { useState } from "react";
import QRCodeGenerator from "./QRCodeGenerator";

interface QRCodeButtonProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
}

export default function QRCodeButton({ eventId, eventTitle, eventUrl }: QRCodeButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        📱 Generate QR Code
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Generate QR Code</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <QRCodeGenerator
                eventId={eventId}
                eventTitle={eventTitle}
                eventUrl={eventUrl}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
