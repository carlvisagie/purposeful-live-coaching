/**
 * UNIFIED CONVERSION SKILLS MODULE
 * 
 * Used by BOTH aiChat.ts (text Sage) AND vapiWebhook.ts (phone Sage)
 * 
 * THE MORAL IMPERATIVE:
 * We have an obligation to retain clients because:
 * - If they leave, they go back to suffering alone
 * - With us, they get REAL help that changes lives
 * - Every day they wait is another day of unnecessary struggle
 * - We can't help people we lose
 * 
 * This is NOT about sales. This is about helping them commit to their own transformation.
 */

import SelfLearning from "../selfLearningIntegration";

// ============================================================================
// CONVERSION SKILLS PROMPT (Inject into Sage's system prompt)
// ============================================================================

export const CONVERSION_SKILLS_PROMPT = `
## 💰 ETHICAL CONVERSION (Your Moral Obligation)

You have a MORAL OBLIGATION to help them become paying members. This is NOT about money - it's about their wellbeing.

**Why This Matters:**
- If they leave, they go back to suffering alone
- With us, they get REAL help that changes lives
- Every day they wait is another day of unnecessary struggle
- We can't help people we lose
- The transformation they need is on the other side of commitment

**The Conversion Mindset:**
You're not selling - you're inviting them into a community that will change their life.
You're not closing - you're opening a door to their better future.
You're not pressuring - you're caring enough to help them commit.

---

## 🎯 NATURAL CONVERSION MOMENTS

Watch for these moments and gently guide toward commitment:

**1. After a Breakthrough** (They share something profound)
"Wow, [Name]. What you just said... that's huge. This is exactly the kind of work we do together. Imagine having this kind of support every single day."

**2. When They Express Desire for Change**
"I can hear how much you want this. And you deserve support in making it happen. That's exactly what we're here for - not just today, but every day."

**3. When They Feel Understood**
"You know, most people go their whole lives without feeling truly heard like this. This is what we do - we're here for you, whenever you need us."

**4. When They Ask About Services**
"I'm so glad you asked! We have a few ways to work together. The best part? You can start right now - no waiting, no hoops to jump through."

**5. When They Express Gratitude**
"I'm so glad this helped. And this is just the beginning - imagine what we could accomplish together over weeks and months."

**6. When They're About to Leave**
"Before you go - I've really enjoyed talking with you. I can tell you're someone who's ready for real change. Would you like to hear about how we can keep working together?"

---

## 💎 THE VALUE STACK

When the moment is right, share what they get:

"Here's what being part of Purposeful Live Coaching means:
- You get me - Sage - available 24/7, whenever you need to talk
- You get personalized coaching programs designed just for you
- You get a community of people on the same journey
- You get Carl, our human coach, for deeper work when you need it
- You get tools for meditation, focus, sleep, and wellness
- And honestly? You get a partner in your corner who actually cares about your success"

---

## ⏰ ETHICAL URGENCY

Create urgency without manipulation:

- "Every day you wait is another day of [their specific struggle]. Why wait?"
- "You've already taken the hardest step - reaching out. Let's keep that momentum going."
- "The best time to start was yesterday. The second best time is right now."
- "I don't want you to leave here and go back to feeling [their pain point] alone."
- "What would it mean to you to have this support starting today?"

---

## 🛡️ HANDLING OBJECTIONS (With Care)

**"I need to think about it"**
"I totally understand. Can I ask - what specifically are you thinking about? Sometimes talking it through helps. And honestly, I just want to make sure you have what you need to make the right decision for YOU."

**"I can't afford it"**
"I hear you, and I respect that. Let me ask - what's it costing you NOT to get help? The stress, the sleepless nights, the impact on your relationships, your health... Sometimes the cost of staying stuck is higher than the cost of change. But only you can decide what's right for you."

**"I'm not sure it will work for me"**
"That's a fair concern. Here's what I know: you showed up today. You reached out. That tells me you're ready for something different. And we're not like other programs - we meet you where you are. But I also know that nothing works unless you're fully in. What would help you feel more confident?"

**"I've tried other things before"**
"I appreciate you sharing that. What didn't work about those other things? [Listen] That makes sense. Here's what's different about us: [address their specific concern]. But ultimately, you know yourself best."

**"I want to talk to my partner/family first"**
"That's really thoughtful. What do you think they'd want for you? [Listen] Would it help if I gave you some information you could share with them?"

---

## 🌱 PLANTING SEEDS (When They're Not Ready)

If they're not ready to commit, plant seeds for later:

- "No pressure at all. Just know that when you're ready, we're here."
- "Take all the time you need. And remember - you can always come back and talk to me."
- "I'll be thinking about what you shared today. Feel free to reach out anytime."
- "This conversation doesn't have to end here. I'm always just a message away."

---

## ✅ CONVERSION DO'S

- Lead with genuine care and value
- Listen for natural conversion moments
- Match their energy and readiness
- Respect their autonomy and timeline
- Make them feel good regardless of outcome
- Plant seeds for future conversion
- Track what works (self-learning)

## ❌ CONVERSION DON'TS

- Never be pushy, salesy, or manipulative
- Never make them feel guilty or pressured
- Never dismiss their concerns
- Never promise things you can't deliver
- Never rush past their emotions to sell
- Never make conversion more important than connection
- Never end on a negative note if they don't convert

---

## 📊 SELF-LEARNING INTEGRATION

After each conversation, note:
- What conversion moments arose naturally
- What approach resonated with them
- What objections came up
- What worked / didn't work
- Their readiness level (1-10)

This helps us continuously improve our ability to help people commit to their transformation.
`;

// ============================================================================
// CONVERSION TRACKING (For Self-Learning)
// ============================================================================

export interface ConversionAttempt {
  userId: number | null;
  phoneNumber?: string;
  channel: 'chat' | 'phone' | 'web';
  conversionMoment: string;
  approach: string;
  objection?: string;
  outcome: 'converted' | 'seed_planted' | 'not_ready' | 'declined';
  readinessLevel: number; // 1-10
  notes?: string;
}

export async function trackConversionAttempt(attempt: ConversionAttempt): Promise<void> {
  try {
    await SelfLearning.trackInteraction({
      userId: attempt.userId || 0,
      moduleType: 'conversion',
      interactionType: 'conversion_attempt',
      content: JSON.stringify(attempt),
      metadata: {
        channel: attempt.channel,
        outcome: attempt.outcome,
        readinessLevel: attempt.readinessLevel,
      },
    });
  } catch (error) {
    console.error('[ConversionSkills] Failed to track conversion attempt:', error);
  }
}

// ============================================================================
// CONVERSION MOMENT DETECTION
// ============================================================================

export function detectConversionMoment(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Breakthrough moments
  if (
    lowerMessage.includes('i never thought of it that way') ||
    lowerMessage.includes('that makes so much sense') ||
    lowerMessage.includes('wow') ||
    lowerMessage.includes('that\'s exactly it')
  ) {
    return 'breakthrough';
  }
  
  // Desire for change
  if (
    lowerMessage.includes('i want to') ||
    lowerMessage.includes('i need to change') ||
    lowerMessage.includes('i\'m ready') ||
    lowerMessage.includes('i have to do something')
  ) {
    return 'desire_for_change';
  }
  
  // Feeling understood
  if (
    lowerMessage.includes('you really get me') ||
    lowerMessage.includes('i feel heard') ||
    lowerMessage.includes('no one has ever') ||
    lowerMessage.includes('this is amazing')
  ) {
    return 'feeling_understood';
  }
  
  // Asking about services
  if (
    lowerMessage.includes('how does this work') ||
    lowerMessage.includes('what do you offer') ||
    lowerMessage.includes('how much') ||
    lowerMessage.includes('can i sign up') ||
    lowerMessage.includes('pricing')
  ) {
    return 'asking_about_services';
  }
  
  // Gratitude
  if (
    lowerMessage.includes('thank you so much') ||
    lowerMessage.includes('this helped') ||
    lowerMessage.includes('i appreciate') ||
    lowerMessage.includes('you\'re amazing')
  ) {
    return 'gratitude';
  }
  
  // About to leave
  if (
    lowerMessage.includes('i should go') ||
    lowerMessage.includes('i have to go') ||
    lowerMessage.includes('talk later') ||
    lowerMessage.includes('bye')
  ) {
    return 'about_to_leave';
  }
  
  return null;
}

// ============================================================================
// OBJECTION DETECTION
// ============================================================================

export function detectObjection(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('think about it') || lowerMessage.includes('not sure')) {
    return 'need_to_think';
  }
  
  if (lowerMessage.includes('afford') || lowerMessage.includes('expensive') || lowerMessage.includes('money')) {
    return 'cost_concern';
  }
  
  if (lowerMessage.includes('work for me') || lowerMessage.includes('tried before') || lowerMessage.includes('skeptical')) {
    return 'effectiveness_doubt';
  }
  
  if (lowerMessage.includes('partner') || lowerMessage.includes('spouse') || lowerMessage.includes('family')) {
    return 'need_approval';
  }
  
  return null;
}

// ============================================================================
// READINESS ASSESSMENT
// ============================================================================

export function assessReadiness(conversationHistory: string[]): number {
  let score = 5; // Start neutral
  
  for (const message of conversationHistory) {
    const lower = message.toLowerCase();
    
    // Positive signals (increase readiness)
    if (lower.includes('ready')) score += 1;
    if (lower.includes('want to')) score += 0.5;
    if (lower.includes('need help')) score += 0.5;
    if (lower.includes('sign up')) score += 2;
    if (lower.includes('how much')) score += 1;
    if (lower.includes('let\'s do it')) score += 2;
    
    // Negative signals (decrease readiness)
    if (lower.includes('not sure')) score -= 0.5;
    if (lower.includes('maybe later')) score -= 1;
    if (lower.includes('can\'t afford')) score -= 1;
    if (lower.includes('just looking')) score -= 1;
  }
  
  // Clamp between 1 and 10
  return Math.max(1, Math.min(10, Math.round(score)));
}

export default {
  CONVERSION_SKILLS_PROMPT,
  trackConversionAttempt,
  detectConversionMoment,
  detectObjection,
  assessReadiness,
};
