import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { squareAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import StatusMessages from "./StatusMessages";
import { Suspense } from "react";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Check if organizer has connected Square
  const [squareAccount] = await db
    .select()
    .from(squareAccounts)
    .where(eq(squareAccounts.organizerId, userId));

  // Use correct Square OAuth URL based on environment
  const squareBaseUrl =
    process.env.SQUARE_ENVIRONMENT === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

  const squareOAuthUrl = `${squareBaseUrl}/oauth2/authorize?client_id=${process.env.SQUARE_APPLICATION_ID}&scope=MERCHANT_PROFILE_READ+PAYMENTS_WRITE+PAYMENTS_READ&session=false&state=${userId}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and payment settings</p>
      </div>

      {/* Status Messages */}
      <Suspense fallback={null}>
        <StatusMessages />
      </Suspense>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Payment Settings</h2>

        {squareAccount ? (
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-800 font-medium mb-1">
                  ✅ Square Account Connected
                </p>
                <p className="text-sm text-gray-600">
                  Merchant ID: {squareAccount.squareMerchantId}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Connected on {new Date(squareAccount.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                href="/api/square/disconnect"
                className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
              >
                Disconnect
              </Link>
            </div>
          </div>
        ) : (
          <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50">
            <h3 className="text-lg font-semibold mb-2 text-orange-900">
              Connect Your Square Account
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              To receive payments for your events, you need to connect your Square account.
              This allows attendees to pay with credit cards and you'll receive funds directly.
            </p>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">What you'll need:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>A Square account (sign up for free at squareup.com)</li>
                <li>Bank account for receiving payments</li>
                <li>Business information</li>
              </ul>
            </div>

            <a
              href={squareOAuthUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.01 8.54C6.12 4.01 11.33 1.84 15.86 3.95c3.43 1.6 5.27 5.37 4.53 9.14l-1.45-.51c.59-3.04-.84-6.2-3.59-7.5-3.63-1.7-7.96-.17-9.66 3.46-.28.6-.47 1.23-.59 1.87L3 9.49l-.01.01c-.86.29-1.81-.16-2.1-1.02-.29-.86.16-1.81 1.02-2.1l2.1.16z" />
                <path d="M19.99 15.46c-2.11 4.53-7.32 6.7-11.85 4.59-3.43-1.6-5.27-5.37-4.53-9.14l1.45.51c-.59 3.04.84 6.2 3.59 7.5 3.63 1.7 7.96.17 9.66-3.46.28-.6.47-1.23.59-1.87L21 14.51l.01-.01c.86-.29 1.81.16 2.1 1.02.29.86-.16 1.81-1.02 2.1l-2.1-.16z" />
              </svg>
              Connect with Square
            </a>

            <p className="text-xs text-gray-500 mt-3">
              You'll be redirected to Square to authorize Agama to process payments on your behalf.
            </p>
          </div>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link
          href="/dashboard"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
