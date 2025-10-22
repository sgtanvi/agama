import { z } from "zod";

export const rsvpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+]?[0-9\s\-().]+$/, {
      message: "Phone number can only contain numbers, spaces, and symbols: + - ( )",
    })
    .refine((val) => val.replace(/[^0-9]/g, "").length >= 10, {
      message: "Phone number must contain at least 10 digits",
    }),
  eventId: z.string().uuid("Invalid event ID"),
  ticketTypeId: z
    .string()
    .uuid("Invalid ticket type ID")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
});

export type RSVPInput = z.infer<typeof rsvpSchema>;
