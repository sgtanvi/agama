import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events, ticketTypes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const body = await request.json();
    const { ticketTypes: ticketTypesData } = body;

    // Verify event ownership
    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)));

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete existing ticket types for this event
    await db.delete(ticketTypes).where(eq(ticketTypes.eventId, eventId));

    // Insert new ticket types
    const insertedTicketTypes = [];
    for (let i = 0; i < ticketTypesData.length; i++) {
      const tt = ticketTypesData[i];

      const [inserted] = await db
        .insert(ticketTypes)
        .values({
          eventId,
          name: tt.name,
          description: tt.description || null,
          price: tt.price.toString(),
          quantity: tt.quantity ? tt.quantity.toString() : null,
          quantitySold: "0",
          displayOrder: i.toString(),
          isActive: tt.isActive,
        })
        .returning();

      insertedTicketTypes.push(inserted);
    }

    console.log(`✅ Saved ${insertedTicketTypes.length} ticket types for event ${eventId}`);

    return NextResponse.json({
      success: true,
      ticketTypes: insertedTicketTypes,
    });
  } catch (error: any) {
    console.error("❌ Ticket types save error:", error);
    return NextResponse.json(
      { error: "Failed to save ticket types" },
      { status: 500 }
    );
  }
}
