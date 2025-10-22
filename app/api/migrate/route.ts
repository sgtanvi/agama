import { NextResponse } from "next/server";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = ws;
}

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log("🚀 Running ticket types migration...");

    // Create ticket_types table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ticket_types" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "event_id" uuid NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "price" numeric(10, 2) NOT NULL,
        "quantity" numeric,
        "quantity_sold" numeric DEFAULT '0' NOT NULL,
        "display_order" numeric DEFAULT '0' NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Add columns to attendees table
    await client.query(`
      ALTER TABLE "attendees" ADD COLUMN IF NOT EXISTS "ticket_type_id" uuid;
    `);

    await client.query(`
      ALTER TABLE "attendees" ADD COLUMN IF NOT EXISTS "price_paid" numeric(10, 2);
    `);

    await client.query(`
      ALTER TABLE "attendees" ADD COLUMN IF NOT EXISTS "ticket_type_name" text;
    `);

    // Add foreign key constraints (ignore if they exist)
    try {
      await client.query(`
        ALTER TABLE "ticket_types"
        ADD CONSTRAINT "ticket_types_event_id_events_id_fk"
        FOREIGN KEY ("event_id") REFERENCES "public"."events"("id")
        ON DELETE cascade ON UPDATE no action;
      `);
    } catch (e: any) {
      if (!e.message?.includes("already exists")) throw e;
    }

    try {
      await client.query(`
        ALTER TABLE "attendees"
        ADD CONSTRAINT "attendees_ticket_type_id_ticket_types_id_fk"
        FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id")
        ON DELETE set null ON UPDATE no action;
      `);
    } catch (e: any) {
      if (!e.message?.includes("already exists")) throw e;
    }

    console.log("✅ Migration completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully!",
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}
