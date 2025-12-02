# Master Prompt Compliance Audit

## Core Principles from Master Prompt

### 1. Data-Backed UX Patterns (Top Agency Standard)
- Hero → Stakes → Services → Process → Proof → FAQ → Final CTA
- Clean sections, perfect hierarchy, scannable content

### 2. Direct-Response Conversion Psychology
- Outcome-first copy, PAS framework
- High-impact bullets, risk-reversal
- Clarity > cleverness

### 3. High-Ticket Landing Frameworks
- Premium positioning, authority tone
- Structured offers, precise outcomes
- Transformation-focused

### 4. Zero Cognitive Load
- No friction, no extra steps
- No unnecessary choices
- No multi-CTA conflicts

### 5. Trust-Heavy Compliance Positioning
- Security, precision, audit readiness
- Credibility, evidence clarity
- U.S.-based support, guarantees

### 6. CTA Optimization Based on Intent
- Primary CTA: **Book a Strategy Call** (for unsure buyers)
- Secondary CTA: **View / Buy Packages** (for ready buyers)
- Product pages: **Start Assessment / Buy Now**

### 7. Billion-Dollar Test
Every section must pass:
- Would removing this decrease sales?
- Does this increase trust, clarity, or conversions?
- Does this reduce friction?
- If not → remove or rewrite it

### 8. Tone & Execution Standards
- Speak with confidence, clarity, authority
- No filler, no abstractions, no vagueness
- Assume buyer is intelligent but overworked
- Always provide highest-leverage solution first
- Remove distractions, complexity, unnecessary elements
- Build with "quiet, elite, masculine authority"

### 9. Deliverable Standard
- Pages must be structured like high-ticket consulting landing pages
- Scripts must be conversion-ready and psychologically sound
- Funnel flows must map precisely to buyer intent
- All writing must be concise, outcome-driven, trust-building

---

## Current Site Audit Checklist

### ✅ COMPLIANT
- [x] Perpetual scarcity (never 0 spots) - reduces friction
- [x] Single-page booking flow - zero cognitive load
- [x] Trust elements visible (90-day guarantee, certified coaches, proven results)
- [x] Stripe primary payment - reduces friction
- [x] Clear pricing ($99, $199, $299)

### ❌ NON-COMPLIANT ISSUES TO FIX

#### 1. **Individual Landing Page Structure**
- ❌ Does NOT follow Hero → Stakes → Services → Process → Proof → FAQ → Final CTA
- ❌ Missing clear "Stakes" section (what happens if they don't act)
- ❌ Missing "Process" section (how it works, step-by-step)
- ❌ FAQ section exists but not prominent enough
- ❌ Multiple CTAs competing (Book Free Call vs Book Session vs Join Video Call)

#### 2. **CTA Confusion (Multi-CTA Conflict)**
- ❌ "Book Free Discovery Call" (Calendly) - wrong CTA for paid service
- ❌ "Book This Session" (paid booking) - correct but mixed with free calls
- ❌ "Join Video Call" header button - unclear purpose
- ❌ "Book Strategy Call" header button - another free call option?
- **FIX:** Primary CTA should be "Book Your Transformation Session" everywhere

#### 3. **Copy Issues (Not Outcome-First)**
- ❌ Hero headline is generic: "Transform Emotional Resilience Into Measurable Outcomes"
- ❌ Missing high-impact bullets with specific outcomes
- ❌ Not enough risk-reversal messaging
- ❌ Lacks "quiet, elite, masculine authority" tone
- **FIX:** Rewrite hero to be more specific and outcome-focused

#### 4. **Booking Flow Issues**
- ❌ Time slots show raw ISO timestamps (2025-11-17T15:00:00.000Z) instead of "3:00 PM"
- ❌ No clear confirmation step before payment
- ❌ Missing "What happens next" messaging after booking
- **FIX:** Format times properly, add confirmation screen

#### 5. **Trust Elements Insufficient**
- ❌ No specific client results/testimonials
- ❌ No coach credentials displayed prominently
- ❌ No "As seen in" or authority badges
- ❌ No specific case studies or proof
- **FIX:** Add social proof, testimonials, case studies

#### 6. **Enterprise Page Issues**
- ❌ Still has PayPal buttons (should be Stripe everywhere)
- ❌ Pricing too high without justification ($2,500-$7,500/mo)
- ❌ No clear differentiation from Individual offering
- ❌ Missing "Contact Sales" CTA for custom pricing
- **FIX:** Align with Stripe, clarify value proposition

#### 7. **Mobile Experience Not Verified**
- ❌ Haven't tested mobile booking flow
- ❌ Calendar may not be responsive
- ❌ Time slots grid may break on small screens
- **FIX:** Test and optimize for mobile

#### 8. **Missing Sections**
- ❌ No "How It Works" process section
- ❌ No "Who This Is For" targeting section
- ❌ No "Why Now" urgency section beyond scarcity
- ❌ No "Meet Your Coach" section
- **FIX:** Add these sections following agency structure

---

## Priority Fixes (Ordered by Impact)

### HIGH IMPACT (Do First)
1. **Fix CTA confusion** - Remove free call CTAs, make "Book Your Transformation Session" primary
2. **Restructure Individual page** - Follow Hero → Stakes → Services → Process → Proof → FAQ → CTA
3. **Fix time slot display** - Show "3:00 PM" not ISO timestamps
4. **Add social proof** - Testimonials, case studies, specific results

### MEDIUM IMPACT
5. **Rewrite hero copy** - More outcome-specific, authority tone
6. **Add "How It Works" section** - Clear 3-4 step process
7. **Fix Enterprise page** - Remove PayPal, align with Individual structure
8. **Add confirmation screen** - Before payment, show booking summary

### LOW IMPACT (Polish)
9. **Mobile optimization** - Test and fix responsive issues
10. **Add coach profiles** - Build authority and trust
11. **Enhance FAQ** - Make more prominent, add more questions
12. **Add "Who This Is For"** - Targeting section with specific personas

---

## Next Steps

1. Read current Individual.tsx to audit against Master Prompt
2. Create detailed rewrite plan for Individual landing page
3. Fix booking flow time display and confirmation
4. Add social proof and trust elements
5. Test complete funnel end-to-end
6. Save checkpoint with Master Prompt compliance
