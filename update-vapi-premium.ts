/**
 * Update Vapi to Premium Sage Experience
 * 
 * - Remove call center feel
 * - Intimate, personal voice settings
 * - Rapport building from second 1
 * - Make caller feel like the only person on the planet
 */

const VAPI_API_KEY = "29b4237e-7f4c-44e5-a670-a52fdf3b7f51";
const ASSISTANT_ID = "96eefb18-55aa-4074-8aec-499edb0ba6e3";
const SERVER_URL = "https://purposefullivecoaching.com";

async function updateToPremiumExperience() {
  console.log("🌟 Updating Sage to Premium Experience...\n");

  try {
    const response = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Sage - Your Personal Life Coach",
        
        // Server URL for ProfileGuard integration
        serverUrl: `${SERVER_URL}/api/trpc/vapiWebhook.webhook`,
        
        // Voice - Warm, intimate, NOT call-center
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm female
          stability: 0.65,           // Slightly higher for consistency
          similarityBoost: 0.80,     // More natural
          style: 0.35,               // Subtle expressiveness
          useSpeakerBoost: true,     // Clearer voice
        },
        
        // Model - GPT-4o for best quality
        model: {
          provider: "openai",
          model: "gpt-4o",
          temperature: 0.85,  // Warm, natural responses
        },
        
        // First message - Warm, personal, NOT generic
        firstMessage: "Hey there... I'm Sage. *warm smile* I'm really glad you called. This is your time - just you and me. What's on your heart today?",
        
        // End message - Leave them feeling valued
        endCallMessage: "I'm so grateful you shared that with me today. You matter, and I'm always here when you need me. Take gentle care of yourself... talk soon.",
        
        // Transcriber - Best quality
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        
        // Recording for profile updates
        recordingEnabled: true,
        
        // NO background sound - intimate, quiet space
        backgroundSound: "off",
        
        // Silence settings - Give space for them to think
        silenceTimeoutSeconds: 30,  // Don't rush them
        maxDurationSeconds: 3600,   // Allow up to 1 hour calls
        
        // Response delay - Feel natural, not robotic
        responseDelaySeconds: 0.5,
        
        // Interruption settings - Let them speak
        interruptionsEnabled: false,  // Don't interrupt them
        
        // Backchanneling - Show active listening
        backchannelingEnabled: true,  // "mmhmm", "I hear you"
        
        // Filler words - Sound human
        fillerInjectionEnabled: false,  // Keep it clean but warm
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update: ${error}`);
    }

    const result = await response.json();
    
    console.log("✅ Sage updated to Premium Experience!\n");
    console.log("Changes made:");
    console.log("- Voice: Warmer, more intimate (stability 0.65, similarity 0.80)");
    console.log("- Background: OFF (no call center noise)");
    console.log("- Silence timeout: 30 seconds (give them space)");
    console.log("- Interruptions: DISABLED (let them speak)");
    console.log("- Backchanneling: ENABLED (active listening sounds)");
    console.log("- First message: Personal, warm, inviting");
    console.log("- End message: Grateful, caring, memorable");
    console.log("\n📞 Test by calling: +1 (564) 529-6454");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

updateToPremiumExperience();
