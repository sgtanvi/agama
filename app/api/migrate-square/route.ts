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
    console.log("🚀 Running Square accounts migration...");

    // Create square_accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "square_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "organizer_id" text NOT NULL UNIQUE,
        "square_merchant_id" text NOT NULL,
        "square_access_token" text NOT NULL,
        "square_refresh_token" text,
        "token_expires_at" timestamp with time zone,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    console.log("✅ Square accounts migration completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Square accounts migration completed successfully!",
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
