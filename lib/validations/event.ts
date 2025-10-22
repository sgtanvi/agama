import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  date: z.string().min(1, "Event date is required"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  maxAttendees: z
    .string()
    .refine(
      (val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) > 0),
      {
        message: "Max attendees must be a positive number",
      }
    )
    .transform((val) => (val === "" ? null : parseInt(val)))
    .optional(),
  // Branding fields
  coverImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  organizerName: z
    .string()
    .max(100, "Organizer name must be less than 100 characters")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
  organizerLogoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
