import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, attendees, broadcasts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { broadcastSchema } from "@/lib/validations/broadcast";
import { courier } from "@/lib/courier";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse and validate request
    const body = await request.json();
    const validatedData = broadcastSchema.parse(body);

    // 3. Verify event belongs to user
    const [event] = await db
      .select()
      .from(events)
      .where(
        and(eq(events.id, validatedData.eventId), eq(events.organizerId, userId))
      );

    if (!event) {
      return NextResponse.json(
        { error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    // 4. Get all paid attendees for this event
    const paidAttendees = await db
      .select()
      .from(attendees)
      .where(
        and(
          eq(attendees.eventId, validatedData.eventId),
          eq(attendees.paymentStatus, "paid")
        )
      );

    if (paidAttendees.length === 0) {
      return NextResponse.json(
        { error: "No paid attendees to send message to" },
        { status: 400 }
      );
    }

    console.log(
      `📤 Broadcasting to ${paidAttendees.length} paid attendees for event: ${event.title}`
    );

    // 5. Send SMS to each attendee via Courier
    const sendPromises = paidAttendees.map(async (attendee) => {
      try {
        await courier.send({
          message: {
            to: {
              phone_number: attendee.phone,
            },
            content: {
              title: `Update: ${event.title}`,
              body: validatedData.message,
            },
            routing: {
              method: "single",
              channels: ["sms"],
            },
          },
        });
        console.log(`✅ SMS sent to ${attendee.name} (${attendee.phone})`);
        return { success: true, attendee: attendee.id };
      } catch (error: any) {
        console.error(`❌ Failed to send SMS to ${attendee.phone}:`, error);
        return { success: false, attendee: attendee.id, error: error.message };
      }
    });

    const results = await Promise.allSettled(sendPromises);
    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    // 6. Save broadcast record
    const [broadcast] = await db
      .insert(broadcasts)
      .values({
        eventId: validatedData.eventId,
        message: validatedData.message,
        channel: validatedData.channel,
        recipientCount: successCount.toString(),
        sentBy: userId,
      })
      .returning();

    console.log(
      `✅ Broadcast complete: ${successCount}/${paidAttendees.length} messages sent`
    );

    // 7. Return results
    return NextResponse.json({
      success: true,
      broadcast: {
        id: broadcast.id,
        totalRecipients: paidAttendees.length,
        successCount,
        failedCount: paidAttendees.length - successCount,
      },
    });
  } catch (error: any) {
    console.error("❌ Broadcast error:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle Courier API errors
    if (error.message?.includes("Courier")) {
      return NextResponse.json(
        { error: "SMS service error", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send broadcast. Please try again." },
      { status: 500 }
    );
  }
}
