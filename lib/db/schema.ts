import { pgTable, uuid, text, timestamp, numeric, boolean } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizerId: text("organizer_id").notNull(), // Clerk user ID
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date", { withTimezone: true }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  location: text("location"),
  maxAttendees: numeric("max_attendees"),
  // Organizer branding fields
  coverImageUrl: text("cover_image_url"),
  organizerName: text("organizer_name"),
  organizerLogoUrl: text("organizer_logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ticketTypes = pgTable("ticket_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // "Early Bird", "VIP", "General Admission"
  description: text("description"), // Optional details about this ticket type
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: numeric("quantity"), // Max available (null = unlimited)
  quantitySold: numeric("quantity_sold").default("0").notNull(),
  displayOrder: numeric("display_order").default("0").notNull(), // For sorting
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const attendees = pgTable("attendees", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  ticketTypeId: uuid("ticket_type_id")
    .references(() => ticketTypes.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  pricePaid: numeric("price_paid", { precision: 10, scale: 2 }), // Snapshot of price at purchase
  ticketTypeName: text("ticket_type_name"), // Snapshot in case ticket type is deleted
  paymentStatus: text("payment_status").default("pending").notNull(), // pending, paid, failed, refunded
  squarePaymentId: text("square_payment_id"),
  squareOrderId: text("square_order_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  storageKey: text("storage_key").notNull(), // R2 object key
  url: text("url").notNull(), // Public URL
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
});

export const broadcasts = pgTable("broadcasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  channel: text("channel").default("sms").notNull(), // sms, email, push
  recipientCount: numeric("recipient_count"),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
  sentBy: text("sent_by").notNull(), // Clerk user ID
});

export const squareAccounts = pgTable("square_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizerId: text("organizer_id").notNull().unique(), // Clerk user ID
  squareMerchantId: text("square_merchant_id").notNull(),
  squareAccessToken: text("square_access_token").notNull(), // Should be encrypted
  squareRefreshToken: text("square_refresh_token"), // Should be encrypted
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for use in application
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type TicketType = typeof ticketTypes.$inferSelect;
export type NewTicketType = typeof ticketTypes.$inferInsert;
export type Attendee = typeof attendees.$inferSelect;
export type NewAttendee = typeof attendees.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;
export type Broadcast = typeof broadcasts.$inferSelect;
export type NewBroadcast = typeof broadcasts.$inferInsert;
export type SquareAccount = typeof squareAccounts.$inferSelect;
export type NewSquareAccount = typeof squareAccounts.$inferInsert;
