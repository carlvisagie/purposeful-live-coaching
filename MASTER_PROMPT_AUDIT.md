# Master Prompt Audit Checklist

## PHASE 1: Landing Page Structure Audit

### Corporate Landing Page (/)
- [ ] Hero section present and clear
- [ ] Stakes section (cost of problem) present
- [ ] Services section (solution) present
- [ ] Process section (how it works) present
- [ ] Proof section (testimonials/results) present
- [ ] FAQ section present
- [ ] Final CTA section present
- [ ] No AI references (FIXED)
- [ ] Primary CTA: "Schedule Strategy Call" (for unsure buyers)
- [ ] Secondary CTA: "Calculate Your ROI" (for ready buyers)
- [ ] Zero cognitive load (no conflicting CTAs)
- [ ] Trust elements visible (security, compliance, guarantees)

### Individual Landing Page (/individual-coaching)
- [ ] Hero section present and clear
- [ ] Stakes section (personal pain points) present
- [ ] Services section (solution) present
- [ ] Process section (how it works) present
- [ ] Proof section (testimonials) present
- [ ] FAQ section present
- [ ] Final CTA section present
- [ ] Primary CTA: "Book Session" (clear intent)
- [ ] Secondary CTA: "Learn More" or similar
- [ ] Zero cognitive load
- [ ] Trust elements visible

### AI Coaching Page (/ai-coaching)
- [ ] Separate from other offerings
- [ ] Clear value proposition
- [ ] Pricing tiers ($49, $79, $99)
- [ ] CTA: "Subscribe Now"
- [ ] Not mixed with enterprise messaging

## PHASE 2: Friction Points & Cognitive Load

### Navigation & Routing
- [ ] All routes defined in App.tsx
- [ ] No 404 errors on published site
- [ ] Clear navigation between pages
- [ ] No conflicting CTAs on same page
- [ ] Booking flow doesn't require login initially
- [ ] Payment flow works end-to-end

### CTA Clarity
- [ ] Primary CTA is obvious (size, color, position)
- [ ] Secondary CTA is subordinate
- [ ] No more than 2 primary CTAs per section
- [ ] Button text is action-oriented
- [ ] Button destinations are clear

### Copy & Messaging
- [ ] Outcome-first copy (benefits before features)
- [ ] PAS framework applied (Problem → Agitation → Solution)
- [ ] No jargon or unclear language
- [ ] Scannable content (bullets, short paragraphs)
- [ ] Authority tone (confident, not salesy)

## PHASE 3: Billion-Dollar Test

### Each Section Must Pass:
- [ ] "Would removing this decrease sales?"
- [ ] "Does this increase trust, clarity, or conversions?"
- [ ] "Does this reduce friction?"
- [ ] If NO to any → mark for removal/rewrite

### Elements to Test:
- [ ] Hero copy
- [ ] Problem section
- [ ] Solution section
- [ ] Process section
- [ ] Testimonials
- [ ] Pricing
- [ ] FAQ
- [ ] CTAs
- [ ] Trust badges
- [ ] Social proof

## PHASE 4: Trust & Compliance

### Security & Authority
- [ ] HIPAA/SOC2 badges visible
- [ ] Security messaging clear
- [ ] Compliance claims backed by evidence
- [ ] No vague promises
- [ ] Guarantees are specific (90-day, money-back, etc.)

### Proof Elements
- [ ] Testimonials have specific metrics
- [ ] Case studies show real results
- [ ] No fake social proof
- [ ] Reviews/ratings if present are authentic

## PHASE 5: Payment & Conversion Flow

### Booking Flow
- [ ] No auth required to start booking
- [ ] Session selection clear
- [ ] Date/time selection intuitive
- [ ] Confirmation before payment
- [ ] Stripe checkout works
- [ ] Success page shows booking confirmation
- [ ] Email confirmation sent

### Subscription Flow (AI Coaching)
- [ ] Pricing tiers clear
- [ ] "Subscribe Now" button obvious
- [ ] Stripe checkout works
- [ ] Subscription created in database
- [ ] Welcome email sent
- [ ] Dashboard shows active subscription

### Enterprise Flow
- [ ] ROI calculator works
- [ ] Calendly link opens correctly
- [ ] Email capture works
- [ ] Lead data stored in database

## PHASE 6: Technical Compliance

### Code Quality
- [ ] Zero TypeScript errors
- [ ] Zero console errors
- [ ] Dev server running cleanly
- [ ] All imports correct
- [ ] No unused imports
- [ ] Responsive design works

### Performance
- [ ] Page loads quickly
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Smooth animations

---

## BUGS FOUND & FIXED

### Bug #1: AI Content on Enterprise Page
- **Status**: FIXED
- **What**: "24/7 AI Coaching" and "AI-powered coaching" messaging on enterprise page
- **Why it's bad**: Violates Master Prompt - enterprise should be 100% human coaching focused
- **Fix**: Removed all AI references, changed to "Proven human coaching"

### Bug #2: [TO BE IDENTIFIED]
- **Status**: PENDING
- **What**: 
- **Why it's bad**: 
- **Fix**: 

