import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold">Agama</h1>
        <p className="text-xl text-gray-600">
          Event management platform with real-time engagement tracking
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Organizer Dashboard
          </Link>
          {/* <Link
            href="/discover"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Discover Events
          </Link> */}
        </div>
      </div>
    </div>
  );
}
