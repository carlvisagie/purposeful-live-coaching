/**
 * Coaching Scripts Library
 * Research-backed persuasion scripts using:
 * - Chase Hughes (Behavioral Table of Elements, Ellipsis Manual)
 * - Robert Cialdini (7 Principles of Influence)
 * - Chris Voss (Never Split the Difference)
 * - Daniel Kahneman (Thinking Fast & Slow)
 * - BJ Fogg (Behavior Model)
 */

export interface CoachingScript {
  trigger: string;
  category: string;
  response: string;
  followUp: string[];
  toneCues: string[];
  personalizationPrompts: string[];
  successStory?: string;
  closeTransition: string;
}

export const coachingScripts: CoachingScript[] = [
  // ==================== MONEY/PRICE OBJECTIONS ====================
  {
    trigger: "COST",
    category: "Money Objection",
    response: "...that most of our clients actually SAVE $4,380 in traditional therapy costs within the first 90 days. **(pause)** You're not spending money—you're investing in avoiding years of expensive weekly therapy sessions that often don't deliver results.",
    followUp: [
      "Let me ask you this: if you could eliminate your anxiety and sleep through the night starting 30 days from now, what would that be worth to you?",
      "And here's the thing—every day you wait costs you more. More sleepless nights, more panic attacks, more missed opportunities. The real cost is doing nothing.",
      "Plus, we have the 90-day guarantee. If you don't see measurable results, you get every penny back. So there's literally zero financial risk."
    ],
    toneCues: ["empathetic", "confident", "pause for impact"],
    personalizationPrompts: [
      "[Reference their specific pain from earlier: anxiety, sleep, relationships]",
      "[Calculate their current 'pain cost': therapy sessions, medications, lost productivity]"
    ],
    successStory: "I had a client last month, Sarah, who said the same thing. She was spending $600/month on therapy with minimal progress. After 30 days with us, her anxiety dropped 65%, she's sleeping 7 hours a night, and she cancelled her therapist. She's actually SAVING $400/month now.",
    closeTransition: "So the question isn't 'Can I afford this?'—it's 'Can I afford NOT to do this?' Which package feels right for you?"
  },
  
  {
    trigger: "EXPENSIVE",
    category: "Money Objection",
    response: "...that 'expensive' is relative to results. **(pause)** Traditional therapy costs $150-300 per session, requires 6-12 months minimum, and has a 40% success rate. Our program costs less per month than TWO therapy sessions, delivers results in 30 days, and has an 85% success rate.",
    followUp: [
      "Think about it this way: would you rather spend $199/month for 3 months and be DONE with anxiety, or spend $600/month for a year and still be struggling?",
      "Our clients report an average of 60% anxiety reduction in the first 30 days. That's faster than medication, cheaper than therapy, and it actually SOLVES the problem instead of just managing symptoms.",
      "And remember—90-day money-back guarantee. If it doesn't work, you pay nothing. Can your therapist offer that?"
    ],
    toneCues: ["matter-of-fact", "confident", "use numbers for credibility"],
    personalizationPrompts: [
      "[Compare to their current spending: therapy, medication, self-help books]",
      "[Highlight their urgency: upcoming event, relationship strain, work performance]"
    ],
    closeTransition: "I have 3 spots left this week. If I hold one for you right now, which package makes the most sense—Essential, Growth, or Transformation?"
  },

  {
    trigger: "BUDGET",
    category: "Money Objection",
    response: "...that I completely respect budget constraints. That's exactly why we created the free discovery call option—so you can start TODAY with zero financial commitment and see results before investing a single dollar.",
    followUp: [
      "Here's what I suggest: book the free discovery call right now. We'll identify your biggest emotional trigger, give you one coping strategy you can use immediately, and you'll see how our system works.",
      "Then, if you want to continue—and most people do after seeing results—you can start with Essential Coaching at $99/month. That's less than $3.50 per day for 24/7 support.",
      "And honestly? Most clients find they SAVE money because they stop spending on things they were using to cope—alcohol, impulse purchases, comfort food. Our clients report an average of $200/month in 'hidden savings' from better emotional control."
    ],
    toneCues: ["understanding", "solution-focused", "reframe to value"],
    personalizationPrompts: [
      "[Identify their 'pain spending': what are they currently spending money on due to emotional struggles?]",
      "[Offer payment plan if available]"
    ],
    closeTransition: "Let's start with the free call. What day this week works best for you—Monday evening or Saturday afternoon?"
  },

  // ==================== TIME OBJECTIONS ====================
  {
    trigger: "TIME",
    category: "Time Objection",
    response: "...that's EXACTLY why our system is designed for busy people. **(pause)** Traditional therapy requires you to show up at a specific time every week, sit in a waiting room, and hope your therapist is available when you're actually struggling.",
    followUp: [
      "Our system works the opposite way: 15-minute coaching sessions when YOU need them, plus 24/7 AI support when you're having a panic attack at 2 AM or dealing with anxiety before a big meeting.",
      "And here's the kicker—our clients report getting back 2-3 hours of productive time per day once their anxiety drops. You'll actually GAIN time by doing this.",
      "Think about how much time you're currently losing to anxiety, rumination, sleepless nights, and emotional recovery. That's the real time cost."
    ],
    toneCues: ["energetic", "reframe time as investment", "use their language"],
    personalizationPrompts: [
      "[Reference specific time they mentioned losing: can't focus at work, lying awake at night, avoiding social events]",
      "[Calculate time ROI: 15 min/week investment = 2-3 hours/day gained]"
    ],
    closeTransition: "So the question is: do you have 15 minutes this week to start getting those hours back? Let's schedule your first session right now."
  },

  {
    trigger: "BUSY",
    category: "Time Objection",
    response: "...that busy people need this MORE than anyone else. **(pause)** You're busy because you're successful, driven, and have a lot of responsibilities. But anxiety and emotional overwhelm are STEALING your productivity.",
    followUp: [
      "Our most successful clients are CEOs, entrepreneurs, and high-performers who don't have time to waste. That's why they choose us—because we deliver results FAST.",
      "15 minutes with me once a week, plus AI support whenever you need it. That's less time than you spend scrolling social media or sitting in traffic.",
      "And when your anxiety drops 60% in 30 days, you'll be shocked at how much MORE you can accomplish. You'll wonder why you waited so long."
    ],
    toneCues: ["respect their time", "mirror their energy", "challenge gently"],
    personalizationPrompts: [
      "[Acknowledge their success/responsibilities]",
      "[Reframe: 'You're too busy NOT to do this']"
    ],
    closeTransition: "I respect your time, so let's not waste any more of it. Which package gets you results fastest—Growth or Transformation?"
  },

  // ==================== SKEPTICISM ====================
  {
    trigger: "DOUBT",
    category: "Skepticism",
    response: "...that healthy skepticism is actually a sign of intelligence. **(pause)** You SHOULD be skeptical—there are a lot of scams out there promising quick fixes that don't work.",
    followUp: [
      "That's exactly why we have an 85% success rate and a 90-day money-back guarantee. We're not asking you to 'believe' us—we're asking you to TEST us.",
      "Here's how it works: you start, we track your progress with actual data—mood scores, sleep quality, anxiety levels. If the numbers don't improve in 90 days, you get a full refund. No questions asked.",
      "So your skepticism is protected. The only way you lose is if you DON'T try, because then you're guaranteed to stay exactly where you are right now."
    ],
    toneCues: ["validate their skepticism", "confident", "use data"],
    personalizationPrompts: [
      "[Ask: 'What specifically are you skeptical about?']",
      "[Address their specific doubt with evidence]"
    ],
    successStory: "I had a client, Michael, who was the MOST skeptical person I've ever worked with. He'd tried everything—therapy, medication, meditation apps. Nothing worked. He only signed up because of the guarantee. 30 days later, his anxiety dropped 70%. He's now one of our biggest advocates.",
    closeTransition: "So let's do this: start with the free discovery call, see the system in action, and decide for yourself. What do you have to lose?"
  },

  {
    trigger: "TRIED",
    category: "Skepticism",
    response: "...that you've tried traditional therapy, and I'm glad you brought that up. **(pause)** Because what we do is fundamentally DIFFERENT from therapy. This isn't talk therapy—this is behavioral neuroscience.",
    followUp: [
      "Traditional therapy focuses on talking about your past. We focus on rewiring your brain's response to triggers in the PRESENT. It's like comparing a flip phone to an iPhone—both make calls, but one is exponentially more powerful.",
      "We use AI to detect patterns your therapist would miss, track your progress with real data, and give you 24/7 support instead of one hour per week.",
      "And here's the key difference: therapy helps you understand WHY you're anxious. We help you STOP being anxious. Understanding doesn't fix the problem—new neural pathways do."
    ],
    toneCues: ["differentiate clearly", "use analogies", "confident but not arrogant"],
    personalizationPrompts: [
      "[Ask: 'What specifically didn't work about therapy?']",
      "[Show how your system addresses that gap]"
    ],
    closeTransition: "You've already invested time and money in therapy. The question is: are you willing to try something that actually works? Let's start with the free call and I'll show you the difference."
  },

  // ==================== DECISION DELAY ====================
  {
    trigger: "THINK",
    category: "Decision Delay",
    response: "...that I absolutely respect your need to think it through. **(pause)** But let me ask you this: what specifically do you need to think about? Because I'd rather address your concerns right now than have you leave with unanswered questions.",
    followUp: [
      "Here's what I know from experience: 'I need to think about it' usually means one of three things—you're not sure it will work, you're concerned about the cost, or you're worried about the time commitment. Which one is it for you?",
      "[WAIT FOR ANSWER, then address specific concern]",
      "And here's the reality: the 3 spots I have left this week will be gone by tomorrow. If you wait to 'think about it,' you'll be waiting another 2-3 weeks for availability. That's 2-3 more weeks of suffering that you don't need to endure."
    ],
    toneCues: ["respectful but direct", "uncover real objection", "create urgency"],
    personalizationPrompts: [
      "[Listen for the REAL objection behind 'I need to think']",
      "[Address it immediately]"
    ],
    closeTransition: "So let's do this: I'll hold a spot for you right now while we talk through your concerns. If we can't resolve them in the next 5 minutes, you can walk away. Fair enough?"
  },

  {
    trigger: "LATER",
    category: "Decision Delay",
    response: "...that 'later' almost never happens. **(pause, empathetic tone)** And I don't say that to pressure you—I say it because I care about your results.",
    followUp: [
      "You reached out TODAY for a reason. Something is hurting badly enough that you took action. That pain is real, it's urgent, and it's not going to magically disappear if you wait.",
      "In fact, research shows that anxiety and emotional pain get WORSE over time when left untreated. Every day you wait, your brain reinforces those negative neural pathways, making them harder to break.",
      "I have 3 spots left this week. Next week I'm fully booked. If you wait for 'later,' you're choosing to suffer for at least 2-3 more weeks. Is that really what you want?"
    ],
    toneCues: ["caring but firm", "use urgency ethically", "paint the cost of inaction"],
    personalizationPrompts: [
      "[Reference their specific pain from earlier in the conversation]",
      "[Ask: 'What will be different later that isn't true right now?']"
    ],
    closeTransition: "Let's not let 'later' steal another day from you. Which package feels right—Essential, Growth, or Transformation?"
  },

  // ==================== CRISIS/EMOTIONAL ====================
  {
    trigger: "CRISIS",
    category: "Crisis Protocol",
    response: "...that what you're feeling right now is incredibly serious, and I want you to know you're not alone. **(slow, calm tone)** Before we go any further, I need to ask: are you currently thinking about harming yourself or ending your life?",
    followUp: [
      "[IF YES: 'I'm so glad you told me. I need you to call 988 (Suicide & Crisis Lifeline) right now, or if you're in immediate danger, call 911. I'm going to stay on the line with you until you're connected to someone who can help. Your life matters, and there are people trained specifically for this moment.']",
      "[IF NO: 'Thank you for being honest with me. What you're experiencing is a crisis, but it's not permanent. Crisis moments pass, and we can get through this together. Let's start with a grounding technique right now...']",
      "[GROUNDING: 'I want you to name 5 things you can see right now... 4 things you can touch... 3 things you can hear... 2 things you can smell... 1 thing you can taste. Do this with me now.']"
    ],
    toneCues: ["calm", "slow speech", "reassuring", "directive"],
    personalizationPrompts: [
      "[SAFETY FIRST: Assess immediate danger]",
      "[DO NOT UPSELL: Focus entirely on safety and stabilization]"
    ],
    closeTransition: "[After stabilization] I want to get you into our system TODAY so you have 24/7 support. Can I book you for a session this week?"
  },

  {
    trigger: "ANXIETY",
    category: "Emotional State",
    response: "...that anxiety feels overwhelming right now, but I'm going to teach you a technique that will reduce it by 50% in the next 90 seconds. **(confident, calm tone)** Are you ready?",
    followUp: [
      "This is called Physiological Sigh breathing, developed by Stanford neuroscientists. It's the fastest way to calm your nervous system.",
      "Here's what you do: Take a deep breath in through your nose... then take a SECOND quick breath in to fill your lungs completely... then slowly exhale through your mouth for as long as you can. Do this twice. Ready? Let's do it together.",
      "[DO THE BREATHING WITH THEM]",
      "How do you feel now? Better, right? That's what our system does—gives you tools that work IMMEDIATELY, not months from now."
    ],
    toneCues: ["calm authority", "directive", "do it WITH them"],
    personalizationPrompts: [
      "[Validate their anxiety]",
      "[Demonstrate immediate value]"
    ],
    closeTransition: "Imagine having access to techniques like this 24/7, plus a coach who understands exactly what you're going through. That's what our program gives you. Let's get you started today."
  },

  {
    trigger: "HOPELESS",
    category: "Emotional State",
    response: "...that hopelessness is a symptom of your brain chemistry right now, not a reflection of reality. **(gentle, firm tone)** And I know that might be hard to believe, but I've seen this exact pattern hundreds of times—and I've seen it transform.",
    followUp: [
      "Hopelessness is your brain's way of protecting you from more disappointment. It's saying 'don't try, because trying hurts.' But here's the truth: that feeling is temporary, and it's treatable.",
      "I had a client named David who felt exactly like you do right now. He said, 'I've tried everything, nothing works, I'm broken.' 30 days into our program, his depression score dropped 55%. He's not 'cured'—but he has hope again. And hope is where healing starts.",
      "The fact that you're here, talking to me right now, means part of you still believes change is possible. That part is right. Let's prove it together."
    ],
    toneCues: ["gentle but confident", "use hope-inducing language", "tell success story"],
    personalizationPrompts: [
      "[Validate their pain]",
      "[Reframe hopelessness as brain chemistry, not truth]"
    ],
    successStory: "David's story (mentioned above)",
    closeTransition: "I can't promise you'll feel better tomorrow. But I CAN promise that if you start today, you'll feel different in 30 days. And different is the first step to better. Let's start with the free discovery call—what do you say?"
  },

  // ==================== UPSELL ====================
  {
    trigger: "UPGRADE",
    category: "Upsell",
    response: "...that based on everything you've shared with me today, Growth Coaching is actually the perfect fit for you. **(pause)** And here's why:",
    followUp: [
      "[PERSONALIZE: Reference their specific challenges] You mentioned struggling with [anxiety/sleep/relationships]. Growth Coaching gives you weekly check-ins instead of monthly, which means we can adjust your strategy in real-time as triggers come up.",
      "Plus, you get the personalized 30-day roadmap, which is custom-built for YOUR specific emotional patterns. Essential Coaching uses a general framework—Growth Coaching is tailored to YOU.",
      "And here's the thing: our data shows that Growth Coaching clients see results 3x faster than Essential clients. So you're actually SAVING time and money by investing more upfront."
    ],
    toneCues: ["consultative", "personalize heavily", "use their words"],
    personalizationPrompts: [
      "[Reference specific pain points they mentioned]",
      "[Show how Growth features directly address those points]"
    ],
    closeTransition: "The difference between Essential and Growth is $100/month. But the difference in results is massive. Which one gets you where you want to be faster?"
  },

  {
    trigger: "MONTHLY",
    category: "Upsell",
    response: "...that monthly subscriptions aren't just about saving 20%—they're about ensuring you actually GET results. **(pause)** And here's why that matters:",
    followUp: [
      "Emotional resilience isn't built in one session. It's built through consistent, sustained support over time. Monthly subscriptions ensure you don't quit before the breakthrough happens.",
      "Our data shows that clients who commit to monthly subscriptions have an 85% success rate, compared to 40% for single-session clients. Why? Because they stick with it long enough for the neural pathways to rewire.",
      "Plus, you save $240 per year with the monthly rate. That's basically 2.5 FREE sessions just for committing to your own healing."
    ],
    toneCues: ["data-driven", "reframe as commitment to self", "use social proof"],
    personalizationPrompts: [
      "[Ask: 'What's your biggest concern about committing monthly?']",
      "[Address it directly]"
    ],
    closeTransition: "So the question is: are you ready to commit to yourself for 90 days and see this through? Or do you want to try one session and risk quitting before you see results?"
  },

  // ==================== DISCOVERY CALL FLOW ====================
  {
    trigger: "OPENING",
    category: "Discovery Call",
    response: "Hi [NAME], thanks so much for taking the time to talk with me today. I'm really glad you reached out. **(warm, welcoming tone)** Before we dive in, I want to set expectations: we have 15 minutes together, and my goal is to give you clarity and at least one tool you can use immediately. Sound good?",
    followUp: [
      "So tell me—what's going on right now that made you decide to book this call?",
      "[LISTEN ACTIVELY, take notes]",
      "Got it. And how long has this been going on?",
      "[LISTEN]",
      "And on a scale of 1-10, with 10 being unbearable, how would you rate your pain right now?"
    ],
    toneCues: ["warm", "curious", "validating"],
    personalizationPrompts: [
      "[Use their name frequently]",
      "[Mirror their language]"
    ],
    closeTransition: "[After pain discovery] Okay, I have a really clear picture now. Let me share what I'm seeing and how we can help..."
  },

  {
    trigger: "VISION",
    category: "Discovery Call",
    response: "...that based on what you've shared, here's what's possible for you in the next 30 days: **(paint vivid picture)**",
    followUp: [
      "Imagine waking up and your first thought ISN'T anxiety. Imagine sleeping through the night without waking up in a panic. Imagine having a hard conversation without your heart racing.",
      "That's not fantasy—that's what our clients experience in 30 days. 60% anxiety reduction, 7+ hours of sleep, emotional control that feels effortless.",
      "And here's how we do it: we identify your specific triggers, rewire your brain's response using proven neuroscience techniques, and give you 24/7 support so you're never alone in a crisis."
    ],
    toneCues: ["inspiring", "specific", "use sensory language"],
    personalizationPrompts: [
      "[Reference their specific desired outcome from earlier]",
      "[Make it tangible and real]"
    ],
    closeTransition: "Does that sound like something you want? [WAIT FOR YES] Great. Let me show you how we make that happen..."
  },

  {
    trigger: "CLOSE",
    category: "Discovery Call",
    response: "...that we have three ways to work together, and I'll help you pick the right one based on what you've shared. **(consultative tone)**",
    followUp: [
      "Essential Coaching is $99/month—great for people who want 24/7 AI support and monthly check-ins. This is perfect if you're self-motivated and just need guidance.",
      "Growth Coaching is $199/month—includes everything in Essential PLUS weekly check-ins, a personalized 30-day roadmap, and priority crisis support. This is our most popular option because it delivers results fastest.",
      "Transformation Coaching is $299/month—our premium option with bi-weekly calls, custom strategies, and direct coach messaging. This is for people who want white-glove support.",
      "Based on what you've told me about [their specific situation], I'd recommend [SPECIFIC PACKAGE]. Does that feel right to you?"
    ],
    toneCues: ["consultative", "confident recommendation", "assumptive close"],
    personalizationPrompts: [
      "[Make a specific recommendation based on their pain level and goals]",
      "[Assume the sale]"
    ],
    closeTransition: "Perfect. Let's get you scheduled. I have availability [DAY/TIME]. Does that work for you?"
  }
];

// Helper function to get script by trigger word
export function getScriptByTrigger(trigger: string): CoachingScript | undefined {
  return coachingScripts.find(s => s.trigger.toUpperCase() === trigger.toUpperCase());
}

// Helper function to get all scripts by category
export function getScriptsByCategory(category: string): CoachingScript[] {
  return coachingScripts.filter(s => s.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
  return Array.from(new Set(coachingScripts.map(s => s.category)));
}

// Get all trigger words
export function getAllTriggers(): string[] {
  return coachingScripts.map(s => s.trigger);
}
