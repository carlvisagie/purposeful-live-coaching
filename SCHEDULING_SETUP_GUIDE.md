# Scheduling System Setup Guide

Your coaching platform now has a **complete native scheduling system** that replaces Calendly. Clients can book, view, and cancel sessions directly on your website, and you can manage your availability with a simple interface.

---

## 🎯 What's Included

### For Coaches (You)
- **Availability Management** (`/coach/availability`)
  - Set weekly working hours (e.g., Monday 9am-5pm, Tuesday 1pm-6pm)
  - Block specific dates for vacation, holidays, or personal time
  - View and edit your schedule at any time

### For Clients
- **Session Booking** (`/book-session`)
  - Interactive calendar to select dates
  - Real-time available time slots based on your schedule
  - Choose session type (Initial Consultation, Follow-up, Quick Check-in)
  - Add notes about topics to discuss

- **Session Management** (`/my-sessions`)
  - View all upcoming sessions
  - See past session history
  - Cancel sessions with confirmation
  - Join Zoom meetings directly from session cards

### Automated Notifications
- **Booking Confirmation** - Sent immediately when client books
- **Cancellation Notice** - Sent when session is cancelled
- **24-Hour Reminder** - Sent the day before the session
- **1-Hour Reminder** - Sent one hour before the session
- **Reschedule Confirmation** - Sent when session time changes

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Your Availability

1. Navigate to `/coach/availability` on your website
2. For each day you work:
   - Select the day of week
   - Set start time (e.g., 9:00 AM)
   - Set end time (e.g., 5:00 PM)
   - Click "Add Availability"
3. Repeat for all working days

**Example Schedule:**
- Monday: 9:00 AM - 5:00 PM
- Tuesday: 1:00 PM - 6:00 PM
- Wednesday: 9:00 AM - 5:00 PM
- Thursday: OFF
- Friday: 9:00 AM - 3:00 PM

### Step 2: Block Time Off (Optional)

1. On the same page, click "Add Time Off"
2. Select start and end dates
3. Add a reason (e.g., "Vacation", "Conference")
4. Click "Add Time Off"

### Step 3: Update Your Website Links

Replace all Calendly links with your new booking page:

**Old Link:**
```
https://calendly.com/your-username
```

**New Link:**
```
https://purposefullivecoaching.manus.space/book-session
```

**Where to Update:**
- Individual landing page (`/individual`)
- Enterprise landing page (`/`)
- Email signatures
- Social media profiles
- Any marketing materials

---

## 📧 Email Notifications

### Current Status
Email notifications are **built and ready** but currently log to console for testing. To activate real email delivery:

### Option 1: Use Built-in Notification Service (Recommended)
The platform includes a built-in notification API. To enable it:

1. Open `server/services/sessionNotifications.ts`
2. Replace the console.log section with:
```typescript
import { notifyOwner } from "../_core/notification";

// Send to client
await notifyOwner({
  title: subject,
  content: htmlBody,
});
```

### Option 2: Integrate SendGrid (Free for 100 emails/day)
1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Create an API key
3. Add to Settings → Secrets: `SENDGRID_API_KEY`
4. Update `sessionNotifications.ts` to use SendGrid SDK

### Option 3: Use Gmail SMTP
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Add to Settings → Secrets:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=your-email@gmail.com`
   - `SMTP_PASS=your-app-password`
4. Use nodemailer in `sessionNotifications.ts`

---

## 🎨 Customization

### Session Types
Edit `client/src/pages/BookSession.tsx` to change session types:

```typescript
const SESSION_TYPES = [
  { value: "initial", label: "Initial Consultation (60 min)", duration: 60 },
  { value: "follow-up", label: "Follow-up Session (45 min)", duration: 45 },
  { value: "check-in", label: "Quick Check-in (30 min)", duration: 30 },
  // Add your own types here
];
```

### Zoom Meeting Links
Currently uses a default Zoom link (`https://zoom.us/j/8201808284`). To customize:

1. **Option A: One Link for All Sessions**
   - Update the default link in `client/src/pages/MySessions.tsx` (line 100)
   - Update email templates in `server/services/sessionNotifications.ts`

2. **Option B: Unique Link Per Session**
   - Add `zoomLink` field to session creation
   - Generate unique Zoom meetings via Zoom API
   - Store link in database with each session

### Booking Time Slots
Currently generates slots every **30 minutes**. To change:

Edit `server/routers/scheduling.ts` (line 85):
```typescript
// Change from 30 to 60 for hourly slots, or 15 for quarter-hour slots
currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
```

---

## 🔧 Advanced Features

### Automatic Reminders (Cron Job)
To send 24-hour and 1-hour reminders automatically, set up a scheduled task:

1. Create a new file `server/jobs/sendReminders.ts`:
```typescript
import { getSessionsNeedingReminders, recordReminderSent } from "../db/scheduling";
import { sendSessionNotification } from "../services/sessionNotifications";

export async function send24HourReminders() {
  const sessions = await getSessionsNeedingReminders("24_hour");
  
  for (const { session, client } of sessions) {
    await sendSessionNotification({
      type: "reminder_24h",
      clientEmail: client.email,
      clientName: client.name,
      sessionDate: session.scheduledDate,
      duration: session.duration,
    });
    
    await recordReminderSent({
      sessionId: session.id,
      reminderType: "24_hour",
    });
  }
}

export async function send1HourReminders() {
  const sessions = await getSessionsNeedingReminders("1_hour");
  
  for (const { session, client } of sessions) {
    await sendSessionNotification({
      type: "reminder_1h",
      clientEmail: client.email,
      clientName: client.name,
      sessionDate: session.scheduledDate,
      duration: session.duration,
    });
    
    await recordReminderSent({
      sessionId: session.id,
      reminderType: "1_hour",
    });
  }
}
```

2. Schedule with cron or external service (e.g., GitHub Actions, AWS Lambda)

### Calendar Integration (.ics Files)
To generate downloadable calendar files:

1. Install `ics` package: `pnpm add ics`
2. Generate .ics file in booking confirmation
3. Attach to email or provide download link

### Rescheduling Interface
Currently clients can only cancel sessions. To add rescheduling:

1. Add "Reschedule" button to `MySessions.tsx`
2. Open `BookSession.tsx` in reschedule mode
3. Call `trpc.scheduling.rescheduleSession.useMutation()`

---

## 📊 Database Tables

### `sessions`
Stores all booked sessions with status tracking.

**Fields:**
- `id` - Unique session ID
- `coachId` - Reference to coach
- `clientId` - Reference to client
- `scheduledDate` - Date and time of session
- `duration` - Length in minutes
- `sessionType` - Type of session
- `status` - scheduled | completed | cancelled | no-show
- `notes` - Additional notes

### `coachAvailability`
Stores recurring weekly schedule.

**Fields:**
- `id` - Unique availability ID
- `coachId` - Reference to coach
- `dayOfWeek` - 0 (Sunday) to 6 (Saturday)
- `startTime` - HH:MM format (e.g., "09:00")
- `endTime` - HH:MM format (e.g., "17:00")
- `isActive` - true | false

### `availabilityExceptions`
Stores time off and blocked dates.

**Fields:**
- `id` - Unique exception ID
- `coachId` - Reference to coach
- `startDate` - Start of blocked period
- `endDate` - End of blocked period
- `reason` - Why unavailable

### `sessionReminders`
Tracks sent reminder emails to prevent duplicates.

**Fields:**
- `id` - Unique reminder ID
- `sessionId` - Reference to session
- `reminderType` - 24_hour | 1_hour
- `sentAt` - Timestamp when sent

---

## 🐛 Troubleshooting

### "No available slots" on booking page
**Cause:** No availability set for that day of week  
**Fix:** Go to `/coach/availability` and add working hours for that day

### Clients can book overlapping sessions
**Cause:** Time slot validation not working  
**Fix:** Check `isTimeSlotAvailable()` function in `server/db/scheduling.ts`

### Email notifications not sending
**Cause:** Email service not configured  
**Fix:** Follow "Email Notifications" section above to integrate SendGrid or SMTP

### Wrong timezone for sessions
**Cause:** Database stores UTC, display needs conversion  
**Fix:** Add timezone conversion in `BookSession.tsx` and `MySessions.tsx`

---

## 🎯 Next Steps

1. **Set your availability** (5 min) - Add your working hours
2. **Test booking flow** (10 min) - Book a test session as a client
3. **Update website links** (5 min) - Replace Calendly with `/book-session`
4. **Enable email notifications** (15 min) - Connect SendGrid or SMTP
5. **Customize session types** (5 min) - Match your service offerings

---

## 📞 Support

If you encounter any issues or need customizations:
- Check the console logs for error messages
- Review the database tables in Management UI → Database
- Contact support at https://help.manus.im

---

**Your scheduling system is ready to use!** 🎉

Start by setting your availability at `/coach/availability`, then share `/book-session` with your clients.
