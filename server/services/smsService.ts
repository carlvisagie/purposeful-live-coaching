import twilio from 'twilio';

/**
 * SMS Service - Twilio Integration
 * Handles all SMS notifications for user engagement and retention
 */

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

export interface SMSMessage {
  to: string;
  message: string;
  type?: 'reminder' | 'engagement' | 'crisis' | 'welcome' | 'followup';
}

/**
 * Send SMS message
 */
export async function sendSMS({ to, message, type = 'engagement' }: SMSMessage): Promise<boolean> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.warn('Twilio not configured - SMS not sent');
    return false;
  }

  try {
    // Format phone number (ensure E.164 format)
    const formattedPhone = formatPhoneNumber(to);
    
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`SMS sent successfully: ${result.sid} (${type})`);
    
    // Log SMS for tracking
    await logSMS({
      to: formattedPhone,
      message,
      type,
      status: 'sent',
      twilioSid: result.sid,
    });

    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    
    await logSMS({
      to,
      message,
      type,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return false;
  }
}

/**
 * Send session reminder SMS
 */
export async function sendSessionReminder(
  phone: string,
  sessionDate: Date,
  coachName: string
): Promise<boolean> {
  const timeUntil = getTimeUntilSession(sessionDate);
  
  const message = `Hi! Reminder: Your coaching session with ${coachName} is ${timeUntil}. 
  
Reply CONFIRM to confirm, or RESCHEDULE if you need to change the time.

- Purposeful Live Coaching`;

  return sendSMS({
    to: phone,
    message,
    type: 'reminder',
  });
}

/**
 * Send re-engagement SMS for inactive users
 */
export async function sendReengagementSMS(
  phone: string,
  userName: string,
  daysSinceLastSession: number
): Promise<boolean> {
  const message = `Hi ${userName}! We noticed it's been ${daysSinceLastSession} days since your last session.

Your transformation matters. Sage (our AI coach) is here 24/7 whenever you're ready to continue.

Reply YES to schedule a session, or just say hi to Sage anytime.

- Purposeful Live Coaching`;

  return sendSMS({
    to: phone,
    message,
    type: 'engagement',
  });
}

/**
 * Send crisis support SMS
 */
export async function sendCrisisSupportSMS(
  phone: string,
  userName: string
): Promise<boolean> {
  const message = `${userName}, we're here for you. 

If you're in crisis:
• Call 988 (Suicide & Crisis Lifeline)
• Text HOME to 741741 (Crisis Text Line)
• Call us: +1 (555) 123-4567

You're not alone. We care about you.

- Purposeful Live Coaching`;

  return sendSMS({
    to: phone,
    message,
    type: 'crisis',
  });
}

/**
 * Send welcome SMS for new users
 */
export async function sendWelcomeSMS(
  phone: string,
  userName: string
): Promise<boolean> {
  const message = `Welcome ${userName}! 🎉

Your transformation journey starts now. Sage (your AI coach) is ready to chat 24/7.

Visit purposefullivecoaching.com/ai-coach to start.

Save this number - we'll send helpful reminders and check-ins.

- Purposeful Live Coaching`;

  return sendSMS({
    to: phone,
    message,
    type: 'welcome',
  });
}

/**
 * Send homework reminder SMS
 */
export async function sendHomeworkReminder(
  phone: string,
  userName: string,
  taskTitle: string,
  dueDate: Date
): Promise<boolean> {
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const message = `Hi ${userName}! Reminder about your action plan:

"${taskTitle}"

Due in ${daysUntilDue} days. Small steps lead to big transformations! 💪

Check your progress: purposefullivecoaching.com/dashboard

- Purposeful Live Coaching`;

  return sendSMS({
    to: phone,
    message,
    type: 'reminder',
  });
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 1 (US), keep it; otherwise add +1
  if (digits.startsWith('1')) {
    return `+${digits}`;
  } else {
    return `+1${digits}`;
  }
}

/**
 * Get human-readable time until session
 */
function getTimeUntilSession(sessionDate: Date): string {
  const now = new Date();
  const diff = sessionDate.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 1) {
    return `in ${days} days`;
  } else if (hours > 1) {
    return `in ${hours} hours`;
  } else {
    return 'soon';
  }
}

/**
 * Log SMS for tracking and analytics
 */
async function logSMS(data: {
  to: string;
  message: string;
  type: string;
  status: 'sent' | 'failed';
  twilioSid?: string;
  error?: string;
}): Promise<void> {
  // TODO: Save to database for analytics
  console.log('SMS Log:', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Check if phone number is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic validation - at least 10 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}
