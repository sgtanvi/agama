"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { createEventSchema } from "@/lib/validations/event";

export async function createEvent(formData: FormData) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to create an event" };
  }

  try {
    // 2. Extract and validate form data
    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      location: formData.get("location"),
      maxAttendees: formData.get("maxAttendees"),
      coverImageUrl: formData.get("coverImageUrl"),
      organizerName: formData.get("organizerName"),
      organizerLogoUrl: formData.get("organizerLogoUrl"),
    };

    const validatedData = createEventSchema.parse(rawData);

    // 3. Insert into database
    const [newEvent] = await db
      .insert(events)
      .values({
        organizerId: userId,
        title: validatedData.title,
        description: validatedData.description || null,
        date: new Date(validatedData.date),
        price: "0", // Default to free - pricing is set in ticket manager
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees?.toString() || null,
        coverImageUrl: validatedData.coverImageUrl || null,
        organizerName: validatedData.organizerName || null,
        organizerLogoUrl: validatedData.organizerLogoUrl || null,
      })
      .returning();

    console.log("✅ Event created:", newEvent.id);

    // 4. Return success with event ID so client can navigate
    return { success: true, eventId: newEvent.id };
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return { error: "Invalid form data. Please check your inputs." };
    }

    // Handle database errors
    console.error("❌ Error creating event:", error);
    return { error: "Failed to create event. Please try again." };
  }
}
