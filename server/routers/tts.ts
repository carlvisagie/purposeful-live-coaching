/**
 * Text-to-Speech Router
 * Generates audio for coach headset guidance
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const ttsRouter = router({
  /**
   * Generate speech audio from text using OpenAI TTS
   */
  generateSpeech: publicProcedure
    .input(
      z.object({
        text: z.string(),
        voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default("nova"),
        speed: z.number().min(0.25).max(4.0).default(1.0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Call OpenAI TTS API
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: input.text,
            voice: input.voice,
            speed: input.speed,
          }),
        });

        if (!response.ok) {
          throw new Error(`TTS API error: ${response.statusText}`);
        }

        // Get audio data
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");

        return {
          audioData: base64Audio,
          mimeType: "audio/mpeg",
        };
      } catch (error) {
        console.error("[TTS] Speech generation failed:", error);
        throw new Error("Failed to generate speech");
      }
    }),
});
