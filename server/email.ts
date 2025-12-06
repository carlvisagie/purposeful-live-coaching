/**
 * Email Notification Service
 * 
 * Production-ready email system for booking confirmations, payment receipts,
 * and session reminders using Mailgun SMTP.
 */

import { ENV as env } from "./_core/env";
import * as nodemailer from 'nodemailer';

// SMTP Configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_SERVER || 'smtp.mailgun.org',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
};

const CRISIS_ALERT_EMAIL = process.env.CRISIS_ALERT_EMAIL || 'carlhvisagie@yahoo.com';
const EMERGENCY_CONTACT_PHONE = process.env.EMERGENCY_CONTACT_PHONE || '+18507252089';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface BookingConfirmationData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  price: number;
  meetingLink?: string;
}

interface PaymentReceiptData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  amount: number;
  paymentDate: string;
  transactionId: string;
}

interface SessionReminderData {
  clientName: string;
  clientEmail: string;
  sessionType: string;
  sessionDate: string;
  sessionTime: string;
  meetingLink: string;
  hoursUntilSession: number;
}

/**
 * Send email using Mailgun SMTP
 * Falls back to console logging if SMTP is not configured
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Check if SMTP is configured
  if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
    console.warn('[Email] SMTP not configured. Email would have been sent:');
    console.log({
      to: options.to,
      subject: options.subject,
      from: options.from || 'Purposeful Live Coaching <noreply@purposefullive.com>',
    });
    return false;
  }

  try {
    const transport = getTransporter();
    
    const info = await transport.sendMail({
      from: options.from || 'Purposeful Live Coaching <noreply@purposefullive.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('[Email] Sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return false;
  }
}

/**
 * Send crisis alert email to emergency contact
 */
export async function sendCrisisAlert(data: {
  clientName: string;
  clientEmail: string;
  conversationId: number;
  crisisType: string;
  message: string;
}): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .alert { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
        .details { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="alert">
          <h2 style="color: #dc2626; margin-top: 0;">🚨 CRISIS ALERT</h2>
          <p><strong>Immediate attention required</strong></p>
        </div>
        
        <div class="details">
          <p><strong>Client:</strong> ${data.clientName} (${data.clientEmail})</p>
          <p><strong>Crisis Type:</strong> ${data.crisisType}</p>
          <p><strong>Conversation ID:</strong> ${data.conversationId}</p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 10px; border-radius: 4px;">${data.message}</p>
        </div>

        <p><strong>Emergency Contact:</strong> ${EMERGENCY_CONTACT_PHONE}</p>
        <p><strong>Action Required:</strong> Contact client immediately and assess situation.</p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          This is an automated crisis alert from Purposeful Live Coaching platform.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: CRISIS_ALERT_EMAIL,
    subject: `🚨 CRISIS ALERT: ${data.clientName} - ${data.crisisType}`,
    html,
  });
}

/**
 * Send booking confirmation email to client
 */
export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: 600; color: #6b7280; }
        .detail-value { color: #111827; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Booking Confirmed! 🎉</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your coaching session is scheduled</p>
        </div>
        <div class="content">
          <p>Hi ${data.clientName},</p>
          <p>Great news! Your coaching session has been confirmed. I'm excited to work with you and help you achieve your goals.</p>
          
          <div class="details">
            <h3 style="margin-top: 0;">Session Details</h3>
            <div class="detail-row">
              <span class="detail-label">Session Type:</span>
              <span class="detail-value">${data.sessionType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${data.sessionDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${data.sessionTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${data.duration} minutes</span>
            </div>
            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">Investment:</span>
              <span class="detail-value">$${data.price}</span>
            </div>
          </div>

          ${data.meetingLink ? `
            <div style="text-align: center;">
              <a href="${data.meetingLink}" class="button">Join Video Call</a>
            </div>
          ` : ''}

          <h3>What to Expect</h3>
          <ul>
            <li>You'll receive a reminder email 24 hours before your session</li>
            <li>Make sure you're in a quiet space with good internet connection</li>
            <li>Have a notebook ready to take notes</li>
            <li>Come prepared with any questions or topics you'd like to discuss</li>
          </ul>

          <h3>Need to Reschedule?</h3>
          <p>Life happens! If you need to reschedule, please let me know at least 24 hours in advance.</p>

          <p style="margin-top: 30px;">Looking forward to our session!</p>
          <p><strong>Purposeful Live Coaching</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Purposeful Live Coaching. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Your ${data.sessionType} is Confirmed - ${data.sessionDate}`,
    html,
  });
}

/**
 * Send payment receipt email to client
 */
export async function sendPaymentReceipt(data: PaymentReceiptData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .total-row { display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: 700; color: #10b981; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Payment Received ✓</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your payment</p>
        </div>
        <div class="content">
          <p>Hi ${data.clientName},</p>
          <p>This email confirms that we've received your payment. Here's your receipt:</p>
          
          <div class="receipt">
            <h3 style="margin-top: 0;">Receipt</h3>
            <div class="receipt-row">
              <span>Date:</span>
              <span>${data.paymentDate}</span>
            </div>
            <div class="receipt-row">
              <span>Session Type:</span>
              <span>${data.sessionType}</span>
            </div>
            <div class="receipt-row">
              <span>Transaction ID:</span>
              <span style="font-family: monospace; font-size: 12px;">${data.transactionId}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid:</span>
              <span>$${data.amount.toFixed(2)}</span>
            </div>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            Keep this email for your records. If you have any questions about this payment, 
            please reply to this email with the transaction ID above.
          </p>

          <p style="margin-top: 30px;">Thank you for choosing Purposeful Live Coaching!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Purposeful Live Coaching. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Payment Receipt - $${data.amount.toFixed(2)} - ${data.sessionType}`,
    html,
  });
}

/**
 * Send session reminder email (24 hours before session)
 */
export async function sendSessionReminder(data: SessionReminderData): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .reminder-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Session Reminder ⏰</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your coaching session is in ${data.hoursUntilSession} hours</p>
        </div>
        <div class="content">
          <p>Hi ${data.clientName},</p>
          
          <div class="reminder-box">
            <h3 style="margin-top: 0;">Upcoming Session</h3>
            <p style="margin: 5px 0;"><strong>${data.sessionType}</strong></p>
            <p style="margin: 5px 0;">${data.sessionDate} at ${data.sessionTime}</p>
          </div>

          <div style="text-align: center;">
            <a href="${data.meetingLink}" class="button">Join Video Call</a>
          </div>

          <div class="checklist">
            <h3 style="margin-top: 0;">Pre-Session Checklist</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Find a quiet, private space</li>
              <li>Test your camera and microphone</li>
              <li>Have a notebook and pen ready</li>
              <li>Prepare any questions or topics to discuss</li>
              <li>Join 2-3 minutes early to test your connection</li>
            </ul>
          </div>

          <p><strong>Meeting Link:</strong><br>
          <a href="${data.meetingLink}" style="color: #10b981; word-break: break-all;">${data.meetingLink}</a></p>

          <p style="margin-top: 30px;">See you soon!</p>
          <p><strong>Purposeful Live Coaching</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Purposeful Live Coaching. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Reminder: Your ${data.sessionType} is in ${data.hoursUntilSession} hours`,
    html,
  });
}

/**
 * Send notification to coach about new booking
 */
export async function notifyCoachNewBooking(data: BookingConfirmationData): Promise<boolean> {
  const coachEmail = env.ownerEmail || 'coach@purposefullive.com'; // Use owner email from env

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>New Booking Received!</h2>
      <p><strong>Client:</strong> ${data.clientName} (${data.clientEmail})</p>
      <p><strong>Session:</strong> ${data.sessionType}</p>
      <p><strong>Date:</strong> ${data.sessionDate} at ${data.sessionTime}</p>
      <p><strong>Duration:</strong> ${data.duration} minutes</p>
      <p><strong>Price:</strong> $${data.price}</p>
      ${data.meetingLink ? `<p><strong>Meeting Link:</strong> ${data.meetingLink}</p>` : ''}
      <p>Check your admin dashboard for more details.</p>
    </body>
    </html>
  `;

  return sendEmail({
    to: coachEmail,
    subject: `New Booking: ${data.sessionType} - ${data.clientName}`,
    html,
  });
}
