import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, key } = body;

    if (!eventId || !key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate public URL
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    // Save to database
    const [asset] = await db
      .insert(mediaAssets)
      .values({
        eventId,
        storageKey: key,
        url: publicUrl,
      })
      .returning();

    console.log("✅ Photo saved:", asset.id);

    return NextResponse.json({
      success: true,
      assetId: asset.id,
      url: publicUrl,
    });
  } catch (error: any) {
    console.error("❌ Error saving photo:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}
