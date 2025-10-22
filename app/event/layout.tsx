import Link from "next/link";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Simple Header for Public Pages */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Orbit
          </Link>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
