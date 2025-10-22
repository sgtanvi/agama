"use client";

interface QRCodeButtonProps {
  eventId: string;
}

export default function QRCodeButton({ eventId }: QRCodeButtonProps) {
  const scrollToQRCode = () => {
    const qrSection = document.getElementById('qr-code-section');
    qrSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToQRCode}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
    >
      📱 Generate QR Code
    </button>
  );
}
