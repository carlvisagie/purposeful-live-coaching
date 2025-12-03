# CTA Testing Results - Master Prompt Audit

## CorporateLanding (/) - Enterprise B2B

### Hero Section CTAs
- [ ] "Calculate Your ROI" button → scrolls to ROI calculator section
- [ ] "Schedule Strategy Call" button → opens Calendly in new tab

### Pricing Tier CTAs
- [ ] Starter tier button → opens Calendly
- [ ] Growth tier button (highlighted) → opens Calendly
- [ ] Enterprise tier button → opens Calendly

### Final CTA Section
- [ ] "Schedule Your Strategy Call" button → opens Calendly

### Navigation & Scrolling
- [ ] ROI Calculator section has correct ID (#roi-calculator)
- [ ] All smooth scroll animations work
- [ ] Exit-intent popup appears on mouse leave
- [ ] Live chat widget loads correctly

---

## IndividualLanding (/individual-coaching) - Individual B2C

### Hero Section CTAs
- [ ] "Start Your Journey" button → scrolls to pricing section
- [ ] "See How It Works" button → scrolls to how-it-works section

### How It Works Section
- [ ] Section has correct ID (#how-it-works)
- [ ] All 4 steps display correctly

### Pricing Section CTAs
- [ ] "Breakthrough" ($1) button → requires login, then navigates to /dashboard
- [ ] "Essential" ($49) button → requires login, then initiates Stripe checkout with AI_ESSENTIAL product
- [ ] "Growth" ($99) button → requires login, then initiates Stripe checkout with AI_GROWTH product

### Final CTA Section
- [ ] "Start Your Journey" button → scrolls to pricing section

### Navigation & Scrolling
- [ ] Pricing section has correct ID (#pricing)
- [ ] All smooth scroll animations work
- [ ] Exit-intent popup appears on mouse leave
- [ ] Live chat widget loads correctly

---

## Stripe Checkout Flow (IndividualLanding)

### Prerequisites
- User must be logged in (redirects to login if not)
- Stripe price IDs must be configured in environment

### Expected Flow
1. User clicks pricing tier button
2. If not logged in → redirect to login
3. If logged in → Stripe checkout session created
4. User redirected to Stripe checkout page
5. User completes payment
6. Success page: /dashboard?payment=success
7. Cancel page: /dashboard?payment=cancelled

### Test Cases
- [ ] Test with logged-out user (should redirect to login)
- [ ] Test with logged-in user (should open Stripe checkout)
- [ ] Verify Stripe session is created with correct product ID
- [ ] Verify customer email is pre-filled
- [ ] Verify success URL is correct
- [ ] Verify cancel URL is correct

---

## Calendly Integration (CorporateLanding)

### Expected Behavior
- All "Schedule Strategy Call" buttons open: https://calendly.com/carlhvisagie-rxgb
- Opens in new tab (_blank)
- No errors in console

### Test Cases
- [ ] Test all 3 Calendly links work
- [ ] Verify link opens in new tab
- [ ] Verify Calendly page loads correctly

---

## Responsive Design

### Mobile (< 768px)
- [ ] Hero section stacks correctly
- [ ] Buttons are full-width and tappable
- [ ] Pricing cards stack vertically
- [ ] FAQ items are readable
- [ ] No horizontal scroll

### Tablet (768px - 1024px)
- [ ] 2-column layouts work
- [ ] Buttons are properly sized
- [ ] Pricing cards display 2-3 per row

### Desktop (> 1024px)
- [ ] Full layouts display correctly
- [ ] 3-column pricing cards
- [ ] All spacing is correct

---

## Accessibility

- [ ] All buttons have visible focus states
- [ ] All links are keyboard accessible
- [ ] Color contrast meets WCAG standards
- [ ] Form inputs (if any) are properly labeled
- [ ] Exit-intent popup can be closed with ESC key

---

## Performance

- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations (60fps)
- [ ] Images are optimized

---

## Summary

**Total Tests**: 50+
**Status**: PENDING (awaiting manual testing in browser)

