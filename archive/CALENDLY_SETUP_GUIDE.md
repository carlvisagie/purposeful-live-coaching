# Calendly Setup Guide for Human Coaching Sessions

**Purpose:** Set up Calendly for booking human coaching sessions with Hybrid and Premium tier customers.

**Time Required:** 15-20 minutes

---

## Step 1: Create Calendly Account (5 minutes)

1. **Go to Calendly:** https://calendly.com
2. **Sign up** with your business email (e.g., support@purposefullive.com)
3. **Choose plan:**
   - **Free plan** works for getting started (1 event type)
   - **Essentials ($10/month)** recommended (unlimited event types, better customization)
   - **Professional ($16/month)** if you need team features

---

## Step 2: Create Event Type for Coaching Sessions (5 minutes)

1. **Click "Create" → "Event Type"**
2. **Configure event:**
   - **Name:** "1-on-1 Coaching Session"
   - **Duration:** 60 minutes (or 45 minutes if you prefer)
   - **Location:** Zoom, Google Meet, or phone call
   - **Description:**
     ```
     Thank you for booking your human coaching session with PurposefulLive!
     
     In this 1-on-1 session, you'll work with an experienced coach to:
     - Dive deeper into challenges you're facing
     - Create actionable strategies for growth
     - Get personalized guidance and support
     
     Please come prepared with:
     - Specific topics or challenges you want to address
     - Any questions you have
     - A quiet, private space for our conversation
     
     Looking forward to supporting you!
     ```

3. **Set availability:**
   - Choose days and times you're available
   - Set buffer time between sessions (15-30 minutes recommended)
   - Set minimum notice period (24 hours recommended)

4. **Add questions for attendees:**
   - "What would you like to focus on in this session?" (required)
   - "Is there anything specific you want me to know before our session?" (optional)
   - "Have you had coaching sessions before?" (optional)

5. **Customize confirmation page:**
   - Add your logo
   - Add confirmation message
   - Add instructions (e.g., "You'll receive a Zoom link via email")

6. **Save event type**

---

## Step 3: Get Your Calendly Link (1 minute)

1. **Click on your event type** → "Copy Link"
2. **Your link will look like:**
   ```
   https://calendly.com/your-username/coaching-session
   ```
3. **Save this link** - you'll need it for the next step

---

## Step 4: Update Your Platform Code (5 minutes)

**Option A: Direct Calendly Link (Quick & Easy)**

Update `client/src/pages/SubscriptionDashboard.tsx`:

```typescript
// Find this line (around line 319):
// window.open("https://calendly.com/purposefullive/coaching-session", "_blank");

// Replace with your actual Calendly link:
window.open("https://calendly.com/YOUR-USERNAME/coaching-session", "_blank");
```

**Remove the toast notification** and uncomment the window.open line:

```typescript
{humanSessionsRemaining > 0 && (
  <div className="mt-4">
    <Button
      className="w-full"
      onClick={() => {
        // Open Calendly booking page
        window.open("https://calendly.com/YOUR-USERNAME/coaching-session", "_blank");
      }}
    >
      <Calendar className="mr-2 h-4 w-4" />
      Book Human Session
    </Button>
  </div>
)}
```

---

**Option B: Embedded Calendly (Better UX)**

Install Calendly widget:

```bash
pnpm add react-calendly
```

Create a new component `client/src/components/CalendlyWidget.tsx`:

```typescript
import { InlineWidget } from "react-calendly";

export function CalendlyWidget({ url }: { url: string }) {
  return (
    <div className="calendly-widget">
      <InlineWidget
        url={url}
        styles={{
          height: "700px",
          width: "100%",
        }}
      />
    </div>
  );
}
```

Update `SubscriptionDashboard.tsx` to show modal with embedded Calendly:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendlyWidget } from "@/components/CalendlyWidget";

// Add state for dialog
const [showBooking, setShowBooking] = useState(false);

// Update button onClick:
<Button
  className="w-full"
  onClick={() => setShowBooking(true)}
>
  <Calendar className="mr-2 h-4 w-4" />
  Book Human Session
</Button>

// Add dialog at the end of the component:
<Dialog open={showBooking} onOpenChange={setShowBooking}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Book Your Coaching Session</DialogTitle>
    </DialogHeader>
    <CalendlyWidget url="https://calendly.com/YOUR-USERNAME/coaching-session" />
  </DialogContent>
</Dialog>
```

---

## Step 5: Set Up Notifications (3 minutes)

1. **In Calendly, go to Settings → Notifications**
2. **Enable:**
   - Email confirmation to attendee
   - Email confirmation to you
   - Email reminder 24 hours before (to attendee)
   - Email reminder 1 hour before (to attendee)
3. **Customize email templates** with your branding

---

## Step 6: Connect Video Conferencing (2 minutes)

1. **Go to Settings → Integrations**
2. **Connect your preferred platform:**
   - **Zoom** (recommended) - automatic meeting links
   - **Google Meet** - automatic meeting links
   - **Microsoft Teams** - automatic meeting links
   - **Phone call** - attendee enters their number

3. **Calendly will automatically:**
   - Generate meeting links
   - Send links to attendees
   - Add meetings to your calendar

---

## Step 7: Test the Booking Flow (5 minutes)

1. **Open your Calendly link** in an incognito window
2. **Book a test session** using a different email
3. **Verify:**
   - You receive confirmation email
   - Attendee receives confirmation email
   - Meeting link is included
   - Event appears in your calendar
4. **Cancel the test booking**

---

## Optional: Advanced Features

### Cancellation Policy

1. **Go to Settings → Event Settings**
2. **Set cancellation policy:**
   - Allow cancellations up to 24 hours before
   - Send cancellation confirmation
   - Automatically free up the time slot

### Payment Integration (If you want to charge for extra sessions)

1. **Go to Settings → Integrations → Payments**
2. **Connect Stripe or PayPal**
3. **Set price for extra sessions** ($99)
4. **Calendly will collect payment before booking**

**Note:** You're already handling payments through your platform, so this is optional.

### Automated Reminders

1. **Go to Settings → Workflows**
2. **Create workflow:**
   - Send reminder 24 hours before
   - Send reminder 1 hour before
   - Include preparation tips
   - Include meeting link

---

## Tracking & Analytics

**Calendly provides:**
- Number of bookings
- Cancellation rate
- Most popular time slots
- No-show rate

**Access analytics:**
1. Go to **Dashboard**
2. View **Insights**
3. Track booking trends

---

## Integration with Your Platform (Future Enhancement)

**Phase 1 (Current):** Manual Calendly link
- Users click "Book Session" → Opens Calendly
- You manually track which users have booked
- Works fine for 0-50 customers

**Phase 2 (When you have 50+ customers):** Calendly API Integration
- Automatically verify user has sessions remaining
- Sync bookings to your database
- Show upcoming sessions in user dashboard
- Send custom reminders through your email system

**Calendly API docs:** https://developer.calendly.com

---

## For Multiple Coaches (When You Scale)

**If you hire coaches:**

1. **Upgrade to Calendly Teams** ($16/user/month)
2. **Add coaches as team members**
3. **Create routing logic:**
   - Round robin (distribute evenly)
   - By expertise (match coach to client needs)
   - By availability (first available coach)

4. **Each coach gets:**
   - Their own calendar
   - Their own availability settings
   - Their own Zoom/Meet integration

---

## Troubleshooting

**Problem:** Users can't see available times
- **Solution:** Check your availability settings in Calendly
- Make sure you have enough time slots available
- Check timezone settings

**Problem:** Meeting links not generating
- **Solution:** Reconnect your Zoom/Meet integration
- Check that integration has proper permissions

**Problem:** Reminders not sending
- **Solution:** Check notification settings
- Verify email addresses are correct
- Check spam folders

---

## Quick Reference

**Your Calendly Dashboard:** https://calendly.com/app

**Your Booking Link:** https://calendly.com/YOUR-USERNAME/coaching-session

**Support:** https://help.calendly.com

---

## Cost Summary

**Free Plan:**
- 1 event type
- Unlimited bookings
- Basic integrations
- **Cost:** $0/month

**Essentials Plan (Recommended):**
- Unlimited event types
- Custom branding
- Email reminders
- Calendar integrations
- **Cost:** $10/month

**Professional Plan:**
- Everything in Essentials
- Team features
- Payment collection
- Advanced workflows
- **Cost:** $16/month

---

## Next Steps

1. **Create Calendly account** (5 minutes)
2. **Set up coaching session event** (5 minutes)
3. **Update platform code** with your Calendly link (5 minutes)
4. **Test booking flow** (5 minutes)
5. **Launch!** 🚀

**Total setup time: 20 minutes**

Once you have paying customers booking sessions, you can upgrade to the embedded widget for better UX.
