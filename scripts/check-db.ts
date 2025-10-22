import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkDatabase() {
  const client = await pool.connect();

  try {
    console.log("🔍 Checking database structure...\n");

    // Check if ticket_types table exists
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('ticket_types', 'attendees');
    `);

    console.log("📋 Tables found:", tablesResult.rows.map(r => r.table_name));

    // Check attendees columns
    const attendeesColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'attendees'
      ORDER BY ordinal_position;
    `);

    console.log("\n👥 Attendees table columns:");
    attendeesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    // Check ticket_types columns if exists
    if (tablesResult.rows.some(r => r.table_name === 'ticket_types')) {
      const ticketTypesColumns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'ticket_types'
        ORDER BY ordinal_position;
      `);

      console.log("\n🎟️ Ticket Types table columns:");
      ticketTypesColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkDatabase();
