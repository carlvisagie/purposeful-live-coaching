/**
 * Update Vapi Assistant with Webhook URL
 * 
 * This configures the Vapi assistant to call our server webhooks for:
 * 1. assistant-request: Load client profile when call starts
 * 2. end-of-call-report: Update profile when call ends
 */

const VAPI_API_KEY = "29b4237e-7f4c-44e5-a670-a52fdf3b7f51";
const ASSISTANT_ID = "96eefb18-55aa-4074-8aec-499edb0ba6e3"; // Purposeful AI Coach

// Your server's public URL (update this to your actual Render URL)
const SERVER_URL = "https://purposefullivecoaching.com";

async function updateAssistantWebhook() {
  console.log("🔧 Updating Vapi Assistant with webhook configuration...\n");

  try {
    // First, get the current assistant config
    const getResponse = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to get assistant: ${await getResponse.text()}`);
    }

    const currentAssistant = await getResponse.json();
    console.log(`Current assistant: ${currentAssistant.name}`);
    console.log(`Current model: ${currentAssistant.model?.model || 'unknown'}\n`);

    // Update with Sage identity and webhooks
    const updateResponse = await fetch(`https://api.vapi.ai/assistant/${ASSISTANT_ID}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Sage - AI Life Coach",
        
        // Server URL for webhooks
        serverUrl: `${SERVER_URL}/api/trpc/vapiWebhook.webhook`,
        
        // Specific webhook URLs
        serverUrlSecret: "purposeful-vapi-secret-2024",
        
        // Model configuration
        model: {
          provider: "openai",
          model: "gpt-4o",
          temperature: 0.8,
        },
        
        // Voice configuration - warm female voice
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
          stability: 0.5,
          similarityBoost: 0.75,
        },
        
        // First message (will be overridden by webhook for returning clients)
        firstMessage: "Hey! I'm Sage. I'm so glad you called. Whatever brought you here today, you're in the right place. What's on your mind?",
        
        // End call message
        endCallMessage: "Take care of yourself. Remember, I'm here whenever you need to talk. You've got this!",
        
        // Transcriber
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        
        // Enable recording for profile updates
        recordingEnabled: true,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update assistant: ${errorText}`);
    }

    const updatedAssistant = await updateResponse.json();
    
    console.log("✅ Assistant updated successfully!\n");
    console.log("Configuration:");
    console.log(`- Name: ${updatedAssistant.name}`);
    console.log(`- Server URL: ${updatedAssistant.serverUrl || 'Not set'}`);
    console.log(`- Model: ${updatedAssistant.model?.model}`);
    console.log(`- Voice: 11labs Rachel`);
    console.log(`- Recording: ${updatedAssistant.recordingEnabled ? 'Enabled' : 'Disabled'}`);
    
    console.log("\n🎉 Sage is now configured with ProfileGuard integration!");
    console.log("\nWebhook flow:");
    console.log("1. Call comes in → Vapi calls /api/trpc/vapiWebhook.assistantRequest");
    console.log("2. Server looks up client by phone number");
    console.log("3. Loads their profile via ProfileGuard");
    console.log("4. Returns personalized Sage prompt with client context");
    console.log("5. Call ends → Vapi calls /api/trpc/vapiWebhook.endOfCallReport");
    console.log("6. Server extracts insights and updates client profile");
    console.log("\n📞 Test by calling: +1 (564) 529-6454");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

updateAssistantWebhook();
