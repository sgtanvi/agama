import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, attendees, ticketTypes, squareAccounts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { rsvpSchema } from "@/lib/validations/rsvp";
import { Client, Environment } from "square";
import { randomUUID } from "crypto";
import { sendRSVPConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate form data
    const body = await request.json();
    const validatedData = rsvpSchema.parse(body);

    // 2. Fetch event details
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, validatedData.eventId));

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: "This event has already passed" },
        { status: 400 }
      );
    }

    // 2.5 Handle ticket type selection
    let ticketType = null;
    let ticketPrice = event.price;
    let ticketName = "General Admission";

    if (validatedData.ticketTypeId) {
      const [tt] = await db
        .select()
        .from(ticketTypes)
        .where(eq(ticketTypes.id, validatedData.ticketTypeId));

      if (!tt) {
        return NextResponse.json(
          { error: "Ticket type not found" },
          { status: 404 }
        );
      }

      if (!tt.isActive) {
        return NextResponse.json(
          { error: "This ticket type is not available" },
          { status: 400 }
        );
      }

      // Check if sold out
      if (tt.quantity) {
        const sold = parseInt(tt.quantitySold || "0");
        const max = parseInt(tt.quantity);
        if (sold >= max) {
          return NextResponse.json(
            { error: "This ticket type is sold out" },
            { status: 400 }
          );
        }
      }

      ticketType = tt;
      ticketPrice = tt.price;
      ticketName = tt.name;
    }

    // 3. Create attendee record with pending payment
    const [attendee] = await db
      .insert(attendees)
      .values({
        eventId: validatedData.eventId,
        ticketTypeId: ticketType?.id || null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        pricePaid: ticketPrice,
        ticketTypeName: ticketName,
        paymentStatus: "pending",
      })
      .returning();

    console.log("✅ Attendee created:", attendee.id, "Ticket:", ticketName, "Price:", ticketPrice);

    // 4. Check if this is a free ticket
    const isFree = parseFloat(ticketPrice) === 0;

    if (isFree) {
      // For free events, mark as paid immediately and redirect to thank you page
      await db
        .update(attendees)
        .set({ paymentStatus: "paid" })
        .where(eq(attendees.id, attendee.id));

      // Increment ticket quantity sold for free tickets
      if (ticketType?.id) {
        await db
          .update(ticketTypes)
          .set({
            quantitySold: sql`COALESCE(${ticketTypes.quantitySold}, 0) + 1`,
          })
          .where(eq(ticketTypes.id, ticketType.id));
      }

      console.log("✅ Free ticket confirmed:", attendee.id);

      // Send confirmation email for free tickets
      if (process.env.RESEND_API) {
        await sendRSVPConfirmation({
          to: attendee.email,
          name: attendee.name,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          ticketType: ticketName,
          price: ticketPrice,
          isFree: true,
        });
      } else {
        console.warn("⚠️ RESEND_API not set, skipping email confirmation");
      }

      // Return success with redirect to thank you page (no checkout needed)
      return NextResponse.json({
        success: true,
        isFree: true,
        attendeeId: attendee.id,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/event/${event.id}/thank-you?attendee=${attendee.id}`,
      });
    }

    // TODO: Re-enable Square integration for paid tickets
    // 5. Fetch organizer's Square account
    // const [squareAccount] = await db
    //   .select()
    //   .from(squareAccounts)
    //   .where(eq(squareAccounts.organizerId, event.organizerId));

    // if (!squareAccount) {
    //   return NextResponse.json(
    //     { error: "This event organizer has not connected their Square account yet. Please contact the organizer." },
    //     { status: 400 }
    //   );
    // }

    // TEMPORARY: Use platform Square credentials for paid tickets
    const organizerSquareClient = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? Environment.Production
          : Environment.Sandbox,
    });
    const locationId = process.env.SQUARE_LOCATION_ID!;

    // 6. Create Square checkout session for paid tickets
    const idempotencyKey = randomUUID();
    const amountMoney = {
      amount: BigInt(Math.round(parseFloat(ticketPrice) * 100)), // Convert to cents
      currency: "USD",
    };

    const checkoutResponse = await organizerSquareClient.checkoutApi.createPaymentLink({
      idempotencyKey,
      order: {
        locationId: locationId,
        lineItems: [
          {
            name: `${event.title} - ${ticketName}`,
            quantity: "1",
            basePriceMoney: amountMoney,
          },
        ],
        metadata: {
          attendeeId: attendee.id,
          eventId: event.id,
        },
      },
      checkoutOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/event/${event.id}/thank-you?attendee=${attendee.id}`,
      },
    });

    if (!checkoutResponse.result.paymentLink) {
      throw new Error("Failed to create payment link");
    }

    // 8. Update attendee with order ID
    const orderId = checkoutResponse.result.paymentLink.orderId;
    if (orderId) {
      await db
        .update(attendees)
        .set({ squareOrderId: orderId })
        .where(eq(attendees.id, attendee.id));

      console.log("✅ Square checkout created, order ID:", orderId);
    }

    // 9. Return checkout URL
    return NextResponse.json({
      checkoutUrl: checkoutResponse.result.paymentLink.url,
      attendeeId: attendee.id,
    });
  } catch (error: any) {
    console.error("❌ RSVP error:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle Square API errors
    if (error.errors) {
      return NextResponse.json(
        { error: "Payment system error", details: error.errors },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process RSVP. Please try again." },
      { status: 500 }
    );
  }
}
