import { CourierClient } from "@trycourier/courier";

if (!process.env.COURIER_AUTH_TOKEN) {
  throw new Error("COURIER_AUTH_TOKEN is not set");
}

export const courier = new CourierClient({
  authorizationToken: process.env.COURIER_AUTH_TOKEN,
});
