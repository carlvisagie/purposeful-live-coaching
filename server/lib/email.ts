import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

/**
 * Email Service
 * 
 * Handles all email notifications for the platform:
 * - Welcome emails
 * - Session confirmations
 * - Payment receipts
 * - Crisis alerts
 * - Weekly progress reports
 * 
 * Uses nodemailer with SMTP configuration from environment variables.
 */

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Default sender
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@purposefulcoaching.com";
const FROM_NAME = process.env.FROM_NAME || "Purposeful Live Coaching";

/**
 * Send email helper
 */
async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

/**
 * Welcome Email
 * Sent when a new user signs up
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const subject = "Welcome to Purposeful Live Coaching! 🎉";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Your Transformation Journey!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Welcome to <strong>Purposeful Live Coaching</strong>! We're thrilled to have you join our community of individuals committed to personal growth and transformation.</p>
          
          <h3>What's Next?</h3>
          <ul>
            <li><strong>Complete Your Profile</strong> - Help us understand your goals better</li>
            <li><strong>Book Your First Session</strong> - Connect with your dedicated coach</li>
            <li><strong>Explore AI Coach</strong> - Get 24/7 support between sessions</li>
            <li><strong>Track Your Progress</strong> - Use our wellness tracking tools</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "https://purposeful-live-coaching-production.onrender.com"}/dashboard" class="button">
              Get Started
            </a>
          </p>
          
          <p>If you have any questions, just reply to this email. We're here to support you every step of the way!</p>
          
          <p>To your success,<br>
          <strong>The Purposeful Team</strong></p>
        </div>
        <div class="footer">
          <p>Purposeful Live Coaching | Your Path to Freedom</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Session Confirmation Email
 * Sent when a session is booked or rescheduled
 */
export async function sendSessionConfirmationEmail({
  to,
  name,
  sessionDate,
  sessionType,
  duration,
  coachName,
}: {
  to: string;
  name: string;
  sessionDate: Date;
  sessionType: string;
  duration: number;
  coachName: string;
}) {
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = sessionDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `Session Confirmed: ${formattedDate} at ${formattedTime}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .session-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Session Confirmed</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Your coaching session has been confirmed! We're looking forward to connecting with you.</p>
          
          <div class="session-details">
            <h3>Session Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Type:</strong> ${sessionType}</p>
            <p><strong>Coach:</strong> ${coachName}</p>
          </div>
          
          <p><strong>Preparation Tips:</strong></p>
          <ul>
            <li>Find a quiet, comfortable space</li>
            <li>Have a notebook ready for insights</li>
            <li>Think about what you'd like to focus on</li>
            <li>Join 5 minutes early to test your connection</li>
          </ul>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "https://purposeful-live-coaching-production.onrender.com"}/sessions" class="button">
              View Session
            </a>
          </p>
          
          <p>Need to reschedule? Just reply to this email or manage your sessions in your dashboard.</p>
          
          <p>See you soon!<br>
          <strong>${coachName}</strong></p>
        </div>
        <div class="footer">
          <p>Purposeful Live Coaching</p>
          <p>Add this event to your calendar to get reminders</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Payment Receipt Email
 * Sent when a payment is successfully processed
 */
export async function sendPaymentReceiptEmail({
  to,
  name,
  amount,
  description,
  receiptUrl,
}: {
  to: string;
  name: string;
  amount: number;
  description: string;
  receiptUrl?: string;
}) {
  const formattedAmount = (amount / 100).toFixed(2); // Convert cents to dollars

  const subject = `Payment Receipt - $${formattedAmount}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Received</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Thank you for your payment! Your transaction has been processed successfully.</p>
          
          <div class="receipt">
            <h3>Receipt</h3>
            <div class="amount">$${formattedAmount}</div>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> Card</p>
          </div>
          
          ${receiptUrl ? `
          <p style="text-align: center;">
            <a href="${receiptUrl}" class="button">
              Download Receipt
            </a>
          </p>
          ` : ""}
          
          <p>This payment has been added to your account. You can view your payment history in your dashboard.</p>
          
          <p>Questions about this payment? Just reply to this email and we'll be happy to help!</p>
          
          <p>Thank you for your trust,<br>
          <strong>The Purposeful Team</strong></p>
        </div>
        <div class="footer">
          <p>Purposeful Live Coaching</p>
          <p>Keep this email for your records</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Crisis Alert Email
 * Sent to coaches when AI detects a crisis situation
 */
export async function sendCrisisAlertEmail({
  to,
  clientName,
  message,
  severity,
  dashboardUrl,
}: {
  to: string;
  clientName: string;
  message: string;
  severity: "high" | "medium" | "low";
  dashboardUrl?: string;
}) {
  const subject = `🚨 URGENT: Crisis Alert for ${clientName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fef2f2; padding: 30px; border-radius: 0 0 10px 10px; border: 2px solid #ef4444; }
        .alert-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .severity-high { color: #ef4444; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Crisis Alert</h1>
        </div>
        <div class="content">
          <p><strong>URGENT:</strong> Our AI has detected a potential crisis situation with your client <strong>${clientName}</strong>.</p>
          
          <div class="alert-box">
            <p><strong>Severity:</strong> <span class="severity-${severity}">${severity.toUpperCase()}</span></p>
            <p><strong>Detected Message:</strong></p>
            <p style="font-style: italic; padding: 10px; background: #f9fafb; border-radius: 4px;">"${message}"</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Contact ${clientName} immediately</li>
            <li>Assess the situation and provide support</li>
            <li>If necessary, refer to emergency services (988 or 911)</li>
            <li>Document the intervention in the client's file</li>
          </ul>
          
          ${dashboardUrl ? `
          <p style="text-align: center;">
            <a href="${dashboardUrl}" class="button">
              View Client Dashboard
            </a>
          </p>
          ` : ""}
          
          <p><strong>Emergency Resources:</strong></p>
          <ul>
            <li><strong>988</strong> - Suicide & Crisis Lifeline</li>
            <li><strong>911</strong> - Emergency Services</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
          </ul>
          
          <p>This is an automated alert. Please take immediate action.</p>
        </div>
        <div class="footer">
          <p>Purposeful Live Coaching - Crisis Detection System</p>
          <p>This email was sent because a crisis keyword was detected in an AI conversation</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Weekly Progress Report Email
 * Sent to clients with their weekly progress summary
 */
export async function sendWeeklyProgressEmail({
  to,
  name,
  weekStart,
  weekEnd,
  stats,
}: {
  to: string;
  name: string;
  weekStart: Date;
  weekEnd: Date;
  stats: {
    sessionsCompleted: number;
    aiConversations: number;
    journalEntries: number;
    moodAverage: number;
    goalsAchieved: number;
  };
}) {
  const subject = `Your Weekly Progress Report - ${weekStart.toLocaleDateString()}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Your Weekly Progress</h1>
          <p>${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}</p>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Great work this week! Here's a summary of your progress:</p>
          
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.sessionsCompleted}</div>
              <div class="stat-label">Coaching Sessions</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.aiConversations}</div>
              <div class="stat-label">AI Conversations</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.journalEntries}</div>
              <div class="stat-label">Journal Entries</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.moodAverage.toFixed(1)}/10</div>
              <div class="stat-label">Average Mood</div>
            </div>
          </div>
          
          <p><strong>Goals Achieved:</strong> ${stats.goalsAchieved} 🎉</p>
          
          <p>Keep up the momentum! Every step forward is progress toward your transformation.</p>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "https://purposeful-live-coaching-production.onrender.com"}/dashboard" class="button">
              View Full Dashboard
            </a>
          </p>
          
          <p>To your continued growth,<br>
          <strong>Your Coaching Team</strong></p>
        </div>
        <div class="footer">
          <p>Purposeful Live Coaching</p>
          <p>You're receiving this because you're enrolled in our coaching program</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

// Export all email functions
export const emailService = {
  sendWelcomeEmail,
  sendSessionConfirmationEmail,
  sendPaymentReceiptEmail,
  sendCrisisAlertEmail,
  sendWeeklyProgressEmail,
};
