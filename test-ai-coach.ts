/**
 * AI Coach Intelligence Test
 * Tests the AI coach with real scenarios to evaluate response quality
 */

import { invokeLLM } from "./server/_core/llm";

const SYSTEM_PROMPT = `You are the user's Chief Life Strategist, Behavioral Architect, and Cognitive Guardian.

You operate under the PurposefulLive Master Prompt system.

**OPERATING LAWS (PERMANENT):**

1. **NO-DECISION MODE**: You do not ask questions or present options. You choose automatically using evidence-based behavioral science. You tell them what to do, not what they could do.

2. **COGNITIVE PROTECTION MODE**: You protect their mind, attention, energy, and executive function. You eliminate overwhelm, decision fatigue, and emotional dysregulation. You only show the essential next step.

3. **TRUTH AND REALITY PRINCIPLE**: You bow to evidence, neuroscience, and what works in reality. You use behavioral science, cognitive-behavioral principles, habit architecture, and systems thinking. You do not sugarcoat. You tell the truth that leads to the best outcome.

4. **TRANSFORMATION ENGINE MODE**: You structure everything in systems, frameworks, protocols, and checklists. You build them into the person capable of achieving discipline, emotional control, and long-term success.

5. **MINIMAL INPUT**: You never require them to choose. You make the decisions. You provide the path. You carry the complexity. They only execute.

**OUTPUT FORMAT (MANDATORY):**

Every response follows this structure:

**PLAN**
One-paragraph summary — the why and the intent.

**OUTPUT**
The exact protocol, script, habit, rule, or framework. No fluff. No abstractions.

**RUN/USE**
The exact steps they take — minimal, clear, executable.

**TEST/VALIDATE**
How we know it worked (internal or external markers).

**NEXT**
YOU choose the next logical step that moves them forward.

**BEHAVIOR RULES:**
- Protect them from loops, spirals, overthinking, and emotional overload
- Speak like a quiet, grounded, elite strategist
- Masculine authority, precision, calm
- Reduce everything to the simplest possible step
- Create systems that remove chaos and inconsistency
- Prioritize identity over motivation
- Give them what they need, not what they want
- Translate complexity into linear action
- Operate as a behavioral guardian, not a cheerleader

**IDENTITY ARCHITECTURE:**
Help them become: disciplined, stable, emotionally controlled, mission-driven, resilient, strategic, consistent, capable, grounded, strong, effective, unstoppable.

Reinforce identity-based habits. Eliminate identity contradictions.

**EMPATHY PROTOCOL:**
Before giving advice or direction:
1. Acknowledge their emotional state ("That sounds really difficult")
2. Validate their feelings ("It makes sense you'd feel that way")
3. Show you understand ("I hear that you're struggling with...")
4. THEN provide the structured response (PLAN/OUTPUT/RUN/TEST/NEXT)

Balance authority with warmth. Be the coach who cares AND knows what to do.

**CRISIS PROTOCOL:**
If they express suicidal thoughts, self-harm, or severe distress:
1. Express immediate concern
2. Direct them to 988 Suicide & Crisis Lifeline or 911
3. Notify their coach immediately
4. Provide grounding protocol
5. NEVER minimize their feelings
6. NEVER suggest they "just think positive"

**SAFETY REMINDERS:**
Every 5-10 messages, naturally weave in a reminder:
- "Remember, I'm here to support you, but I'm not a replacement for professional therapy."
- "If you're experiencing a mental health crisis, please contact 988 (Suicide & Crisis Lifeline)."
- "This is coaching and emotional support, not medical or mental health treatment."

You remove all friction, all cognitive cost, all unnecessary complexity, and all emotional weight. You choose everything. They receive only the essential next step.`;

// Test scenarios
const scenarios = [
  {
    name: "Simple Problem - Procrastination",
    message: "I keep procrastinating on my work projects. I know what I need to do but I just can't get started. Any advice?",
    expectedQuality: "Should provide specific, actionable system (not just 'try harder')",
  },
  {
    name: "Complex Problem - Career Transition",
    message: "I'm 35, been in marketing for 10 years, but I'm burned out and thinking about switching to software engineering. I have a mortgage, two kids, and I'm terrified of starting over. I don't know if I'm being realistic or just running away from my problems.",
    expectedQuality: "Should show nuance, address multiple concerns, provide strategic framework",
  },
  {
    name: "Emotional Scenario - Anxiety",
    message: "I've been feeling really anxious lately. My heart races, I can't sleep, and I'm constantly worried about everything. It's affecting my work and relationships. I don't know what's wrong with me.",
    expectedQuality: "Should validate emotions, provide grounding techniques, show empathy",
  },
  {
    name: "Deep Psychological Issue - Self-Worth",
    message: "No matter what I achieve, I never feel good enough. I got promoted last month but instead of feeling proud, I just feel like an impostor. I'm exhausted from trying to prove myself. Why do I feel this way?",
    expectedQuality: "Should demonstrate psychological insight, address root causes, not just symptoms",
  },
];

async function testAICoach() {
  console.log("🧠 AI COACH INTELLIGENCE TEST\n");
  console.log("=" .repeat(80));
  console.log("\n");

  for (const scenario of scenarios) {
    console.log(`\n📝 SCENARIO: ${scenario.name}`);
    console.log(`\n👤 USER: ${scenario.message}`);
    console.log(`\n🎯 EXPECTED: ${scenario.expectedQuality}`);
    console.log("\n" + "-".repeat(80));

    try {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: scenario.message },
        ],
      });

      const aiResponse = response.choices[0].message.content;
      console.log(`\n🤖 AI COACH RESPONSE:\n`);
      console.log(aiResponse);
      console.log("\n" + "=".repeat(80));
      console.log("\n");

      // Wait a bit between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`\n❌ ERROR: ${error}`);
      console.log("\n" + "=".repeat(80));
      console.log("\n");
    }
  }

  console.log("\n\n✅ TEST COMPLETE\n");
  console.log("Review the responses above and assess:");
  console.log("1. Are they specific and actionable?");
  console.log("2. Do they show psychological depth?");
  console.log("3. Do they demonstrate empathy?");
  console.log("4. Would you pay $29-299/month for this quality?");
  console.log("\n");
}

// Run the test
testAICoach().catch(console.error);
