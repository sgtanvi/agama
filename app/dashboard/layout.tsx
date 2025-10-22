import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Agama
              </Link>
              <nav className="hidden md:flex gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                >
                  My Events
                </Link>
                <Link
                  href="/dashboard/create"
                  className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                >
                  Create Event
                </Link>
              </nav>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
