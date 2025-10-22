import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendees, ticketTypes } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = request.headers.get("x-square-hmacsha256-signature");
    const body = await request.text();
    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

    // Always verify signature if key is configured
    if (webhookSignatureKey && webhookSignatureKey !== "REPLACE_ME") {
      if (!signature) {
        console.error("❌ Missing webhook signature");
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 401 }
        );
      }

      const hash = crypto
        .createHmac("sha256", webhookSignatureKey)
        .update(body)
        .digest("base64");

      if (hash !== signature) {
        console.error("❌ Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }

      console.log("✅ Webhook signature verified");
    } else {
      console.warn("⚠️ Webhook signature verification is disabled. Set SQUARE_WEBHOOK_SIGNATURE_KEY in production!");
    }

    const event = JSON.parse(body);
    console.log("📨 Square webhook received:", event.type);

    // 2. Handle payment.updated event
    if (event.type === "payment.updated" || event.type === "payment.created") {
      const payment = event.data.object.payment;

      // Get order metadata (contains attendeeId)
      if (payment.orderId) {
        // In a real implementation, you'd fetch the order to get metadata
        // For now, we'll update based on payment status
        console.log("💳 Payment status:", payment.status);

        if (payment.status === "COMPLETED") {
          // Find attendee by Square payment ID and update
          const [updatedAttendee] = await db
            .update(attendees)
            .set({
              paymentStatus: "paid",
              squarePaymentId: payment.id,
              squareOrderId: payment.orderId,
            })
            .where(eq(attendees.squareOrderId, payment.orderId))
            .returning();

          if (updatedAttendee) {
            console.log("✅ Attendee payment confirmed:", updatedAttendee.id);

            // Increment ticket type sold quantity
            if (updatedAttendee.ticketTypeId) {
              await db
                .update(ticketTypes)
                .set({
                  quantitySold: sql`COALESCE(${ticketTypes.quantitySold}, 0) + 1`,
                })
                .where(eq(ticketTypes.id, updatedAttendee.ticketTypeId));

              console.log("✅ Ticket type quantity updated:", updatedAttendee.ticketTypeId);
            }
          }
        } else if (payment.status === "FAILED" || payment.status === "CANCELED") {
          await db
            .update(attendees)
            .set({ paymentStatus: "failed" })
            .where(eq(attendees.squareOrderId, payment.orderId));

          console.log("❌ Payment failed for order:", payment.orderId);
        }
      }
    }

    // 3. Acknowledge webhook
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
