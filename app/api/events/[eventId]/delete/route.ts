import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events, attendees, ticketTypes, mediaAssets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;

    // Verify the event belongs to the current user
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)));

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete all related data in order (due to foreign key constraints)
    // 1. Delete media assets
    await db.delete(mediaAssets).where(eq(mediaAssets.eventId, eventId));

    // 2. Delete attendees
    await db.delete(attendees).where(eq(attendees.eventId, eventId));

    // 3. Delete ticket types
    await db.delete(ticketTypes).where(eq(ticketTypes.eventId, eventId));

    // 4. Finally, delete the event
    await db.delete(events).where(eq(events.id, eventId));

    console.log("✅ Event deleted:", eventId);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ Delete event error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
