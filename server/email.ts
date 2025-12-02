import { notifyOwner } from "./_core/notification";

/**
 * EMAIL NOTIFICATION SERVICE
 * 
 * Sends transactional emails for:
 * - Session bookings
 * - Payment confirmations
 * - Session reminders
 * - Cancellations
 * 
 * Uses Manus built-in notification system to notify coach
 * In production, replace with SendGrid, Resend, or AWS SES for client emails
 */

interface EmailTemplate {
  subject: string;
  body: string;
}

interface SessionBookingData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  sessionDate: Date;
  sessionDuration: number;
  price: number;
  calendlyLink?: string;
}

interface PaymentConfirmationData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  amount: number;
  transactionId: string;
}

interface SessionReminderData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  sessionDate: Date;
  zoomLink?: string;
  calendlyLink?: string;
}

/**
 * Generate session booking confirmation email
 */
export function generateBookingEmail(data: SessionBookingData): EmailTemplate {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `Session Booked: ${data.sessionType} on ${data.sessionDate.toLocaleDateString()}`;

  const body = `
Hi ${data.clientName},

Your coaching session has been successfully booked!

📅 Session Details:
- Type: ${data.sessionType}
- Date & Time: ${formattedDate}
- Duration: ${data.sessionDuration} minutes
- Investment: $${(data.price / 100).toFixed(2)}

${data.calendlyLink ? `🔗 Add to Calendar: ${data.calendlyLink}` : ""}

What to Expect:
1. You'll receive a Zoom link 24 hours before your session
2. Please arrive 5 minutes early to test your audio/video
3. Have a quiet, private space ready for our conversation
4. Come prepared with any questions or topics you'd like to discuss

Looking forward to our session together!

Best regards,
Carl Visagie
PurposefulLive Coaching
  `.trim();

  return { subject, body };
}

/**
 * Generate payment confirmation email
 */
export function generatePaymentEmail(data: PaymentConfirmationData): EmailTemplate {
  const subject = `Payment Confirmed: ${data.sessionType}`;

  const body = `
Hi ${data.clientName},

Thank you for your payment!

💳 Payment Details:
- Session: ${data.sessionType}
- Amount: $${(data.amount / 100).toFixed(2)}
- Transaction ID: ${data.transactionId}

Your session is now confirmed. You'll receive a separate email with session details and the Zoom link.

If you have any questions, please don't hesitate to reach out.

Best regards,
Carl Visagie
PurposefulLive Coaching
  `.trim();

  return { subject, body };
}

/**
 * Generate session reminder email (sent 24 hours before)
 */
export function generateReminderEmail(data: SessionReminderData): EmailTemplate {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `Reminder: Your ${data.sessionType} is Tomorrow`;

  const body = `
Hi ${data.clientName},

This is a friendly reminder about your upcoming coaching session tomorrow!

📅 Session Details:
- Type: ${data.sessionType}
- Date & Time: ${formattedDate}

${data.zoomLink ? `🎥 Join Zoom: ${data.zoomLink}` : ""}
${data.calendlyLink ? `📅 Reschedule if needed: ${data.calendlyLink}` : ""}

Preparation Tips:
✓ Test your audio and video beforehand
✓ Find a quiet, private space
✓ Have water nearby
✓ Bring any questions or topics you'd like to discuss
✓ Arrive 5 minutes early

I'm looking forward to our session!

Best regards,
Carl Visagie
PurposefulLive Coaching
  `.trim();

  return { subject, body };
}

/**
 * Send booking notification to coach
 */
export async function notifyCoachOfBooking(data: SessionBookingData): Promise<boolean> {
  const formattedDate = data.sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return await notifyOwner({
    title: `New Session Booked: ${data.sessionType}`,
    content: `
Client: ${data.clientName} (${data.clientEmail})
Session: ${data.sessionType}
Date: ${formattedDate}
Duration: ${data.sessionDuration} minutes
Price: $${(data.price / 100).toFixed(2)}
    `.trim(),
  });
}

/**
 * Send payment notification to coach
 */
export async function notifyCoachOfPayment(data: PaymentConfirmationData): Promise<boolean> {
  return await notifyOwner({
    title: `Payment Received: $${(data.amount / 100).toFixed(2)}`,
    content: `
Client: ${data.clientName} (${data.clientEmail})
Session: ${data.sessionType}
Amount: $${(data.amount / 100).toFixed(2)}
Transaction: ${data.transactionId}
    `.trim(),
  });
}

/**
 * Send client email (placeholder - integrate with SendGrid/Resend/AWS SES)
 */
export async function sendClientEmail(
  to: string,
  template: EmailTemplate
): Promise<boolean> {
  // TODO: Integrate with actual email service (SendGrid, Resend, AWS SES)
  // For now, just log the email content
  console.log(`
=== EMAIL TO ${to} ===
Subject: ${template.subject}
Body:
${template.body}
======================
  `);

  // Return true to indicate "sent" (placeholder)
  return true;
}

/**
 * Send session booking confirmation
 */
export async function sendBookingConfirmation(data: SessionBookingData): Promise<void> {
  const email = generateBookingEmail(data);
  await sendClientEmail(data.clientEmail, email);
  await notifyCoachOfBooking(data);
}

/**
 * Send payment confirmation
 */
export async function sendPaymentConfirmation(data: PaymentConfirmationData): Promise<void> {
  const email = generatePaymentEmail(data);
  await sendClientEmail(data.clientEmail, email);
  await notifyCoachOfPayment(data);
}

/**
 * Send session reminder
 */
export async function sendSessionReminder(data: SessionReminderData): Promise<void> {
  const email = generateReminderEmail(data);
  await sendClientEmail(data.clientEmail, email);
}
