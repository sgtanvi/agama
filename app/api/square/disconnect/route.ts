import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { squareAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAppUrl } from "@/lib/env";

export async function GET() {
  const { userId } = await auth();
  const appUrl = getAppUrl();

  if (!userId) {
    return NextResponse.redirect(`${appUrl}/sign-in`);
  }

  try {
    // Revoke Square access token
    const [account] = await db
      .select()
      .from(squareAccounts)
      .where(eq(squareAccounts.organizerId, userId));

    if (account) {
      // Revoke the token with Square
      await fetch(`https://connect.squareupsandbox.com/oauth2/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Square-Version": "2024-10-17",
        },
        body: JSON.stringify({
          client_id: process.env.SQUARE_APPLICATION_ID,
          access_token: account.squareAccessToken,
        }),
      });

      // Delete from database
      await db
        .delete(squareAccounts)
        .where(eq(squareAccounts.organizerId, userId));

      console.log("✅ Square account disconnected for user:", userId);
    }

    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?success=disconnected`
    );
  } catch (error: any) {
    console.error("❌ Error disconnecting Square:", error);
    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?error=disconnect_failed`
    );
  }
}
