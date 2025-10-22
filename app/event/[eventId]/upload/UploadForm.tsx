"use client";

import { useState } from "react";

export default function UploadForm({ eventId }: { eventId: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          throw new Error(`${file.name} is too large. Maximum file size is 10MB.`);
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file.`);
        }
        // 1. Get presigned URL
        const signResponse = await fetch("/api/upload/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            fileName: file.name,
            fileType: file.type,
          }),
        });

        if (!signResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, key } = await signResponse.json();

        // 2. Upload directly to R2
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        // 3. Mark upload as complete
        const completeResponse = await fetch("/api/upload/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, key }),
        });

        if (!completeResponse.ok) {
          throw new Error("Failed to save photo");
        }

        const { url } = await completeResponse.json();
        setUploadedFiles((prev) => [...prev, url]);
      }

      // Clear file input
      e.target.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-400 transition">
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer block"
        >
          <div className="mb-4">
            <svg
              className="mx-auto w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          {uploading ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg
                className="animate-spin h-6 w-6 text-purple-600"
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
              <span className="text-lg font-medium text-gray-700">Uploading...</span>
            </div>
          ) : (
            <p className="text-lg font-medium text-gray-700 mb-2">
              Click to upload photos
            </p>
          )}
          <p className="text-sm text-gray-500">
            or drag and drop images here
          </p>
          <p className="text-xs text-gray-400 mt-2">
            JPG, PNG, WEBP up to 10MB each
          </p>
        </label>
      </div>

      {/* Uploaded Photos */}
      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">
            Uploaded ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedFiles.map((url, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium">
              ✓ {uploadedFiles.length} photo{uploadedFiles.length > 1 ? "s" : ""} uploaded successfully!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
