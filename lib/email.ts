import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export async function sendRSVPConfirmation({
  to,
  name,
  eventTitle,
  eventDate,
  eventLocation,
  ticketType,
  price,
  isFree,
}: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  price: string;
  isFree: boolean;
}) {
  try {
    const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    const { data, error } = await resend.emails.send({
      from: "Agama Events <onboarding@resend.dev>", // You'll change this to your domain later
      to,
      subject: `✅ Registration Confirmed: ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
              .detail-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .detail-row:last-child { border-bottom: none; }
              .label { font-weight: bold; color: #6b7280; }
              .value { color: #111827; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🎉 You're Registered!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Great news! Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>

                <div class="detail-box">
                  <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Event Details</h2>
                  <div class="detail-row">
                    <span class="label">Event:</span>
                    <span class="value">${eventTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Date & Time:</span>
                    <span class="value">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Location:</span>
                    <span class="value">${eventLocation}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Ticket Type:</span>
                    <span class="value">${ticketType}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Price:</span>
                    <span class="value">${isFree ? "FREE" : `$${price}`}</span>
                  </div>
                </div>

                ${
                  isFree
                    ? `
                  <p style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <strong>✅ All Set!</strong><br/>
                    Your spot is reserved. We'll send you event updates and reminders via SMS.
                  </p>
                `
                    : `
                  <p style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
                    <strong>💳 Payment Confirmed</strong><br/>
                    Your payment has been processed successfully. See you at the event!
                  </p>
                `
                }

                <p>We're excited to see you there! If you have any questions, feel free to reach out.</p>

                <p style="margin-top: 30px;">
                  Best regards,<br/>
                  <strong>The Agama Team</strong>
                </p>
              </div>
              <div class="footer">
                <p>This is an automated confirmation email from Agama Events.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false, error };
  }
}
