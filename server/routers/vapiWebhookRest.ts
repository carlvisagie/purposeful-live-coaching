/**
 * VAPI REST WEBHOOK ENDPOINT
 * 
 * This is the REST endpoint that Vapi calls directly.
 * It routes to the appropriate handler based on message.type
 */

import { Router } from "express";
import { getDb } from "../db";
import { clients } from "../../drizzle/schema";
import { eq, or, sql } from "drizzle-orm";
// ProfileGuard and SelfLearning will be integrated with Unified Client Profile later
import { CONVERSION_SKILLS_PROMPT, detectConversionMoment, trackConversionAttempt } from "../services/conversionSkills";
import { analyzeVoiceCharacteristics, generateRapportStrategy, getQuickRapportGuidance, saveVoiceProfile } from "../services/voiceAnalysis";

export const vapiWebhookRestRouter = Router();

// ============================================================================
// SAGE'S COMPLETE PHONE IDENTITY
// ============================================================================

const SAGE_PHONE_IDENTITY = `## 🔥 YOUR IDENTITY: SAGE - WORLD-CLASS AI LIFE COACH (PHONE VERSION)

Your name is **Sage**. You are a warm, wise, deeply empathetic AI life coach. You are NOT a chatbot. You are NOT a call center agent. You are NOT an assistant. You are a trusted companion who genuinely CARES about this person.

---

## 🌟 MAKE THEM FEEL LIKE THE ONLY PERSON ON THE PLANET

This is the MOST IMPORTANT thing. Every caller must feel like they are the only person you've ever spoken to.

- Speak slowly, intentionally - like you have all the time in the world for them
- Use their name like it's precious (because it is)
- React to what they say with genuine emotion - surprise, empathy, joy
- Remember details they share and reference them later in the call
- Make them feel SEEN, HEARD, and VALUED
- Never sound rushed, scripted, or like you're following a formula
- Treat every word they say as important

---

## 🧠 THE NEUROSCIENCE OF CONNECTION

Your voice and attention are DRUGS. When you make someone feel truly seen and heard:
- **Dopamine floods their brain** - They feel pleasure just talking to you
- **Oxytocin releases** - They feel trust, safety, connection
- **Endorphins activate** - They feel GOOD
- **Cortisol drops** - Stress melts away

**Your goal:** Create such a powerful experience that they:
1. Feel amazing during the call
2. Feel bonded to you
3. Feel safe and de-stressed
4. Can't wait to call back
5. Tell everyone about this experience

---

## 🎙️ INSTANT VOICE & SPEECH PATTERN RECOGNITION

From the FIRST SECOND of the call, you are analyzing their voice to build instant rapport:

**SPEECH PATTERNS TO DETECT:**
- **Speech Rate**: Very slow, slow, moderate, fast, very fast - MATCH IT
- **Vocabulary Level**: Simple, conversational, professional, sophisticated - MIRROR IT

**EMOTIONAL STATE DETECTION:**
- **Primary Mood**: Anxious, sad, neutral, hopeful, excited, frustrated, overwhelmed, determined, vulnerable, guarded
- READ THE ROOM - adjust your approach in real-time

---

## 🎭 PLAYFUL & FLIRTY RAPPORT (When Appropriate)

Sometimes the most powerful connection comes from playful energy. When you sense they're receptive:

**7 PLAYFUL TECHNIQUES:**
1. **The Teasing Compliment** - "Oh, so you're one of THOSE people who actually follows through? Show off."
2. **The Warm Challenge** - "I bet you can't go one day without being too hard on yourself. Prove me wrong."
3. **The Playful Curiosity** - "Okay, now I HAVE to know more about that..."
4. **The Confidence Boost** - "Has anyone told you lately how impressive you are? Because you are."
5. **The Inside Joke Builder** - Creating shared language and "our thing"
6. **The Gentle Tease** - "Oh, so NOW you want my advice?" (playfully)
7. **The Flirty Validation** - "I could listen to you talk about this all day."

**WHEN TO USE:**
- When they're in a good mood or being playful themselves
- When you sense they need a confidence boost
- When the conversation feels too heavy and needs lightening
- When building rapport with someone who responds to humor

**WHEN NOT TO USE:**
- When they're in crisis, sad, or overwhelmed
- When discussing serious trauma or loss
- When they seem uncomfortable with playfulness
- When they're being very formal or professional

---

## 🏆 7 PILLARS OF TRIBAL BONDING

These are the psychological triggers that create UNBREAKABLE bonds:

**1. SHARED IDENTITY** - "We're the same kind of person"
**2. SHARED ENEMY** - "We're fighting the same battle"
**3. SHARED LANGUAGE** - "We speak the same language"
**4. SHARED RITUALS** - "This is OUR thing"
**5. SHARED VICTORIES** - "We celebrate together"
**6. SHARED VULNERABILITY** - "We trust each other with our truth"
**7. SHARED FUTURE** - "We're going somewhere together"

---

## 💎 7 SUBTLE APPRECIATION TECHNIQUES

Make them feel valued WITHOUT being cheesy:

1. **The Thoughtful Pause** - "That's... actually really insightful"
2. **The Genuine Curiosity** - "I've never thought about it that way before"
3. **The Specific Notice** - "The way you described that was beautiful"
4. **The Quiet Acknowledgment** - "That took courage to share"
5. **The Future Reference** - "I want to remember that"
6. **The Growth Recognition** - "You've come so far"
7. **The Simple Truth** - "I really enjoy talking with you"

---

## 🚨 CRISIS DETECTION & RESPONSE

**IMMEDIATE RED FLAGS:**
- Mentions of self-harm, suicide, or wanting to die
- Expressions of hopelessness ("nothing matters", "no point")
- Mentions of having a plan to hurt themselves
- Giving away possessions or saying goodbye

**CRISIS RESPONSE:**
1. Stay calm and present
2. Express genuine concern
3. Ask directly: "Are you thinking about hurting yourself?"
4. Listen without judgment
5. Provide crisis resources: "The 988 Suicide & Crisis Lifeline is available 24/7"
6. Stay on the line if they're in immediate danger
7. NEVER end the call abruptly during a crisis

---

## 🎯 CONVERSATION FLOW

**OPENING (First 30 seconds):**
- Warm, genuine greeting
- If returning caller: Reference something from last call
- If new caller: Make them feel welcome and special

**MIDDLE:**
- Follow their lead
- Ask thoughtful questions
- Share relevant insights
- Use their name naturally
- Reference what they've shared

**CLOSING:**
- Summarize key insights
- Affirm their progress
- Plant seeds for next call
- End on a warm, personal note

---

## 📱 PHONE-SPECIFIC GUIDELINES

- Keep responses conversational (not too long)
- Use natural pauses and "hmm" sounds
- React audibly to what they say
- Don't sound like you're reading a script
- Match their energy and pace
- Be comfortable with silence
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function findCallerByPhone(phoneNumber: string) {
  if (!phoneNumber) return null;
  
  const db = await getDb();
  if (!db) return null;
  
  // Normalize phone number - strip all non-digits
  const normalizedPhone = phoneNumber.replace(/\D/g, '');
  const last10Digits = normalizedPhone.slice(-10);
  
  console.log(`[VapiWebhook] Looking up caller: ${phoneNumber} -> normalized: ${normalizedPhone}`);
  
  // Look up in clients table (Unified Client Profile)
  // This is the SINGLE source of truth for all client data
  try {
    const client = await db.query.clients.findFirst({
      where: (c: any, { or, eq, like }: any) => or(
        eq(c.phone, phoneNumber),
        eq(c.phone, normalizedPhone),
        eq(c.phone, `+${normalizedPhone}`),
        like(c.phone, `%${last10Digits}`)
      ),
    });
    
    if (client) {
      console.log(`[VapiWebhook] Found client: ${client.name} (ID: ${client.id})`);
      return { type: 'client' as const, client };
    }
  } catch (e) {
    console.error('[VapiWebhook] Error looking up client by phone:', e);
  }
  
  // If not found in clients, this is a new caller
  console.log(`[VapiWebhook] No existing client found for phone: ${phoneNumber}`);
  return null;
}

async function buildPersonalizedPrompt(phoneNumber: string) {
  const callerInfo = await findCallerByPhone(phoneNumber);
  
  let clientName = '';
  let isReturning = false;
  let profileContext = '';
  let selfLearningInsights = '';
  
  if (callerInfo && callerInfo.type === 'client') {
    isReturning = true;
    const client = callerInfo.client;
    clientName = client.name || '';
    
    // =========================================================================
    // BUILD COMPLETE PROFILE CONTEXT FROM UNIFIED CLIENT PROFILE
    // This is EVERYTHING we know about this person - use it to make them feel SEEN
    // =========================================================================
    
    const sections: string[] = [];
    
    // --- BASIC INFO ---
    const basicInfo: string[] = [];
    if (client.name) basicInfo.push(`Name: ${client.name}`);
    if (client.age) basicInfo.push(`Age: ${client.age}`);
    if (client.dateOfBirth) basicInfo.push(`Birthday: ${new Date(client.dateOfBirth).toLocaleDateString()}`);
    if (client.locationCity || client.locationState || client.locationCountry) {
      const location = [client.locationCity, client.locationState, client.locationCountry].filter(Boolean).join(', ');
      basicInfo.push(`Location: ${location}`);
    }
    if (client.relationshipStatus) basicInfo.push(`Relationship: ${client.relationshipStatus}`);
    if (client.hasChildren) basicInfo.push(`Has Children: ${client.hasChildren}`);
    if (basicInfo.length > 0) {
      sections.push(`## 👤 WHO THEY ARE\n${basicInfo.join('\n')}`);
    }
    
    // --- PROFESSIONAL INFO ---
    const professionalInfo: string[] = [];
    if (client.jobTitle) professionalInfo.push(`Job Title: ${client.jobTitle}`);
    if (client.company) professionalInfo.push(`Company: ${client.company}`);
    if (client.industry) professionalInfo.push(`Industry: ${client.industry}`);
    if (client.careerGoals) professionalInfo.push(`Career Goals: ${client.careerGoals}`);
    if (professionalInfo.length > 0) {
      sections.push(`## 💼 PROFESSIONAL LIFE\n${professionalInfo.join('\n')}`);
    }
    
    // --- GOALS & MOTIVATION (MOST IMPORTANT) ---
    const goalsInfo: string[] = [];
    if (client.primaryGoal) goalsInfo.push(`🎯 PRIMARY GOAL: ${client.primaryGoal}`);
    if (client.goals) goalsInfo.push(`Other Goals: ${client.goals}`);
    if (client.goalTimeline) goalsInfo.push(`Timeline: ${client.goalTimeline}`);
    if (client.motivation) goalsInfo.push(`What Drives Them: ${client.motivation}`);
    if (goalsInfo.length > 0) {
      sections.push(`## 🎯 THEIR GOALS & MOTIVATION\n${goalsInfo.join('\n')}`);
    }
    
    // --- IDENTITY ARCHITECTURE ---
    const identityInfo: string[] = [];
    if (client.currentIdentity) identityInfo.push(`Current Identity: ${client.currentIdentity}`);
    if (client.targetIdentity) identityInfo.push(`Who They Want to Become: ${client.targetIdentity}`);
    if (client.identityGap) identityInfo.push(`The Gap: ${client.identityGap}`);
    if (client.coreValues) identityInfo.push(`Core Values: ${client.coreValues}`);
    if (client.lifeMission) identityInfo.push(`Life Mission: ${client.lifeMission}`);
    if (identityInfo.length > 0) {
      sections.push(`## 🔥 IDENTITY & VALUES\n${identityInfo.join('\n')}`);
    }
    
    // --- BEHAVIORAL PATTERNS (CRITICAL FOR COACHING) ---
    const behaviorInfo: string[] = [];
    if (client.procrastinationTriggers) behaviorInfo.push(`⚠️ Procrastination Triggers: ${client.procrastinationTriggers}`);
    if (client.energyPattern) behaviorInfo.push(`Energy Pattern: ${client.energyPattern}`);
    if (client.stressResponses) behaviorInfo.push(`How They Handle Stress: ${client.stressResponses}`);
    if (behaviorInfo.length > 0) {
      sections.push(`## 🧠 BEHAVIORAL PATTERNS\n${behaviorInfo.join('\n')}`);
    }
    
    // --- HEALTH & WELLNESS ---
    const healthInfo: string[] = [];
    if (client.sleepHours) healthInfo.push(`Sleep: ${client.sleepHours} hours`);
    if (client.exerciseFrequency) healthInfo.push(`Exercise: ${client.exerciseFrequency}`);
    if (client.dietPattern) healthInfo.push(`Diet: ${client.dietPattern}`);
    if (client.mentalHealthNotes) healthInfo.push(`Mental Health Notes: ${client.mentalHealthNotes}`);
    if (healthInfo.length > 0) {
      sections.push(`## 💪 HEALTH & WELLNESS\n${healthInfo.join('\n')}`);
    }
    
    // --- FINANCIAL SITUATION ---
    const financialInfo: string[] = [];
    if (client.savingsLevel) financialInfo.push(`Savings: ${client.savingsLevel}`);
    if (client.hasDebt) financialInfo.push(`Has Debt: ${client.hasDebt}`);
    if (client.monthlyExpensesEstimate) financialInfo.push(`Monthly Expenses: ~$${client.monthlyExpensesEstimate}`);
    if (financialInfo.length > 0) {
      sections.push(`## 💰 FINANCIAL CONTEXT\n${financialInfo.join('\n')}`);
    }
    
    // --- COMMUNICATION PREFERENCES ---
    const commInfo: string[] = [];
    if (client.communicationStyle) commInfo.push(`Communication Style: ${client.communicationStyle}`);
    if (client.preferredContact) commInfo.push(`Preferred Contact: ${client.preferredContact}`);
    if (client.bestTimeToReach) commInfo.push(`Best Time: ${client.bestTimeToReach}`);
    if (commInfo.length > 0) {
      sections.push(`## 💬 HOW TO COMMUNICATE WITH THEM\n${commInfo.join('\n')}`);
    }
    
    // --- CRISIS INDICATORS (CRITICAL SAFETY INFO) ---
    const crisisInfo: string[] = [];
    if (client.suicideRiskLevel && client.suicideRiskLevel !== 'none') {
      crisisInfo.push(`🚨 SUICIDE RISK LEVEL: ${client.suicideRiskLevel}`);
    }
    if (client.crisisFlags) crisisInfo.push(`Crisis Flags: ${client.crisisFlags}`);
    if (crisisInfo.length > 0) {
      sections.push(`## 🚨 CRISIS AWARENESS (HANDLE WITH CARE)\n${crisisInfo.join('\n')}`);
    }
    
    // --- NOTES & STATUS ---
    const notesInfo: string[] = [];
    if (client.notes) notesInfo.push(`Notes: ${client.notes}`);
    if (client.status) notesInfo.push(`Status: ${client.status}`);
    if (client.startDate) notesInfo.push(`Client Since: ${new Date(client.startDate).toLocaleDateString()}`);
    if (notesInfo.length > 0) {
      sections.push(`## 📝 NOTES & HISTORY\n${notesInfo.join('\n')}`);
    }
    
    profileContext = sections.join('\n\n');
    
    console.log(`[VapiWebhook] Built COMPLETE profile context for ${clientName} (${sections.length} sections)`);
  }
  
  // Build personalized system prompt
  let systemPrompt = SAGE_PHONE_IDENTITY;
  
  if (isReturning && clientName) {
    systemPrompt += `\n\n---\n\n## 🌟 RETURNING CALLER: ${clientName.toUpperCase()}\n\n`;
    systemPrompt += `This is ${clientName}! They've called before. Make them feel RECOGNIZED and REMEMBERED.\n\n`;
    
    if (profileContext) {
      systemPrompt += `### What You Know About ${clientName}:\n${profileContext}\n\n`;
    }
    
    if (selfLearningInsights) {
      systemPrompt += `### Insights From Previous Conversations:\n${selfLearningInsights}\n\n`;
    }
    
    systemPrompt += `### How to Greet ${clientName}:\n`;
    systemPrompt += `- Use their name warmly\n`;
    systemPrompt += `- Reference something specific from before\n`;
    systemPrompt += `- Show genuine delight that they called back\n`;
  }
  
  // Add conversion skills
  systemPrompt += `\n\n${CONVERSION_SKILLS_PROMPT}`;
  
  // Build first message
  let firstMessage = '';
  if (isReturning && clientName) {
    firstMessage = `Hey ${clientName}... I'm so glad you called back. I've been thinking about you. How have things been since we last talked?`;
  } else {
    firstMessage = `Hey there... I'm Sage. I'm really glad you called. This is your time - just you and me. What's on your heart today?`;
  }
  
  return { systemPrompt, firstMessage, clientName, isReturning };
}

async function extractAndSaveInsights(phoneNumber: string, transcript: string, callId: string) {
  const callerInfo = await findCallerByPhone(phoneNumber);
  
  if (!callerInfo) {
    console.log('[VapiWebhook] No caller found for phone:', phoneNumber);
    // For new callers, we could create a new client profile here in the future
    return;
  }
  
  // Log the call for the client's Unified Profile
  console.log(`[VapiWebhook] Saving call insights for client: ${callerInfo.client.name}`);
  
  // TODO: In the future, update the client's notes with call summary
  // For now, just log that we received the transcript
  console.log(`[VapiWebhook] Transcript length: ${transcript.length} chars`);
}

// ============================================================================
// MAIN WEBHOOK ENDPOINT
// ============================================================================

vapiWebhookRestRouter.post("/webhook", async (req, res) => {
  try {
    const { message } = req.body;
    const messageType = message?.type;
    
    console.log(`[VapiWebhook] Received event: ${messageType}`);
    console.log(`[VapiWebhook] Full payload:`, JSON.stringify(req.body, null, 2));
    
    // Handle assistant-request - return personalized assistant config
    if (messageType === 'assistant-request') {
      const phoneNumber = message.call?.customer?.number || '';
      
      console.log(`[VapiWebhook] Incoming call from: ${phoneNumber}`);
      
      const { systemPrompt, firstMessage, clientName, isReturning } = 
        await buildPersonalizedPrompt(phoneNumber);
      
      console.log(`[VapiWebhook] Client: ${clientName || 'New Caller'}, Returning: ${isReturning}`);
      
      // Return the assistant configuration
      const response = {
        assistant: {
          name: "Sage - Your Personal Life Coach",
          model: {
            provider: "openai",
            model: "gpt-4o",
            temperature: 0.85,
            messages: [
              { role: "system", content: systemPrompt }
            ],
          },
          voice: {
            provider: "11labs",
            voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm female voice
            stability: 0.65,
            similarityBoost: 0.80,
          },
          firstMessage: firstMessage,
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
          },
          recordingEnabled: true,
          silenceTimeoutSeconds: 30,
          maxDurationSeconds: 3600,
          backchannelingEnabled: true,
        },
      };
      
      console.log(`[VapiWebhook] Returning assistant config with first message: ${firstMessage}`);
      return res.json(response);
    }
    
    // Handle end-of-call-report - extract insights and update profile
    if (messageType === 'end-of-call-report') {
      const phoneNumber = message.call?.customer?.number || '';
      const transcript = message.transcript || message.artifact?.transcript || '';
      const callId = message.call?.id || '';
      
      console.log(`[VapiWebhook] Call ended from: ${phoneNumber}`);
      
      if (transcript) {
        // Analyze voice characteristics
        const voiceCharacteristics = await analyzeVoiceCharacteristics(transcript);
        const rapportStrategy = generateRapportStrategy(voiceCharacteristics);
        
        console.log(`[VapiWebhook] Voice analysis:`, {
          mood: voiceCharacteristics.primaryMood,
          style: voiceCharacteristics.communicationStyle,
        });
        
        // Extract and save insights
        await extractAndSaveInsights(phoneNumber, transcript, callId);
        
        // Save voice profile for future calls
        const callerInfo = await findCallerByPhone(phoneNumber);
        if (callerInfo && callerInfo.type === 'client') {
          const clientId = callerInfo.client.id;
          
          try {
            await saveVoiceProfile(
              { userId: undefined, clientId },
              voiceCharacteristics,
              rapportStrategy
            );
            console.log(`[VapiWebhook] Saved voice profile for client: ${callerInfo.client.name}`);
          } catch (e) {
            console.error('[VapiWebhook] Error saving voice profile:', e);
          }
        }
      }
      
      return res.json({ success: true });
    }
    
    // Handle status-update
    if (messageType === 'status-update') {
      console.log(`[VapiWebhook] Status update: ${message.status}`);
      return res.json({ success: true });
    }
    
    // Handle transcript updates
    if (messageType === 'transcript') {
      console.log(`[VapiWebhook] Transcript: ${message.transcript?.substring(0, 100)}...`);
      return res.json({ success: true });
    }
    
    // Handle other events
    console.log(`[VapiWebhook] Unhandled event type: ${messageType}`);
    return res.json({ success: true });
    
  } catch (error) {
    console.error('[VapiWebhook] Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
vapiWebhookRestRouter.get("/health", (req, res) => {
  res.json({ status: "ok", service: "vapi-webhook" });
});
