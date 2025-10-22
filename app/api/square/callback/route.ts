import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { squareAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAppUrl } from "@/lib/env";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This is the userId we passed
  const error = searchParams.get("error");

  const appUrl = getAppUrl();

  // Handle OAuth errors
  if (error) {
    console.error("❌ Square OAuth error:", error);
    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?error=oauth_failed`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?error=missing_params`
    );
  }

  const userId = state; // This is the Clerk user ID

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      `https://connect.squareupsandbox.com/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Square-Version": "2024-10-17",
        },
        body: JSON.stringify({
          client_id: process.env.SQUARE_APPLICATION_ID,
          client_secret: process.env.SQUARE_APPLICATION_SECRET,
          code,
          grant_type: "authorization_code",
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("❌ Square token exchange failed:", errorData);
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    const {
      access_token,
      refresh_token,
      expires_at,
      merchant_id,
    } = tokenData;

    console.log("✅ Square OAuth successful for merchant:", merchant_id);

    // Check if account already exists
    const [existingAccount] = await db
      .select()
      .from(squareAccounts)
      .where(eq(squareAccounts.organizerId, userId));

    if (existingAccount) {
      // Update existing account
      await db
        .update(squareAccounts)
        .set({
          squareMerchantId: merchant_id,
          squareAccessToken: access_token,
          squareRefreshToken: refresh_token || null,
          tokenExpiresAt: expires_at ? new Date(expires_at) : null,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(squareAccounts.organizerId, userId));
    } else {
      // Create new account
      await db.insert(squareAccounts).values({
        organizerId: userId,
        squareMerchantId: merchant_id,
        squareAccessToken: access_token,
        squareRefreshToken: refresh_token || null,
        tokenExpiresAt: expires_at ? new Date(expires_at) : null,
        isActive: true,
      });
    }

    // Redirect back to settings page
    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?success=connected`
    );
  } catch (error: any) {
    console.error("❌ Error processing Square OAuth:", error);
    return NextResponse.redirect(
      `${appUrl}/dashboard/settings?error=processing_failed`
    );
  }
}
