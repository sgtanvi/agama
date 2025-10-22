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
    // Check attendees columns
    const attendeesColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'attendees'
      ORDER BY ordinal_position;
    `);

    // Check if ticket_types table exists
    const ticketTypesExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'ticket_types'
      );
    `);

    return NextResponse.json({
      attendeesColumns: attendeesColumns.rows,
      ticketTypesExists: ticketTypesExists.rows[0].exists,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
