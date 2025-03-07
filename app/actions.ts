"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Helper function to check if API key is valid and available
async function checkApiKeyAndGenerate(prompt: string) {
  try {
    // Check if we have a valid API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Missing Google Generative AI API key. Please add a valid API key in your environment variables.")
    }

    const { text } = await generateText({
      model: google("gemini-1.5-pro"), // Using the latest Gemini model
      prompt,
      temperature: 0.7,
      maxTokens: 250,
    })

    return { success: true, text }
  } catch (error: any) {
    console.error("API Error:", error.message || error)
    return {
      success: false,
      error: error.message || "Failed to generate response. Please check your API key.",
    }
  }
}

export async function generateResponse(
  chatHistory: string,
  tone: string,
  datingApp: string,
): Promise<{ success: boolean; text?: string; error?: string }> {
  const prompt = `
You are an AI dating assistant that helps users craft the best responses for dating app conversations.
Your goal is to generate a smooth, engaging, and context-aware reply based on the user's conversation.

Previous messages: ${chatHistory}
Desired tone: ${tone}
Dating app: ${datingApp}

Response Guidelines:
1. Maintain natural, flirty, and engaging tone.
2. Avoid generic or robotic replies.
3. Keep the response under 2-3 sentences.
4. Suggest emojis if relevant.

Generate the best response based on the conversation.
`

  return checkApiKeyAndGenerate(prompt)
}

export async function generateIcebreaker(
  profileDetails: string,
  tone: string,
  datingApp: string,
): Promise<{ success: boolean; text?: string; error?: string }> {
  const prompt = `
You are an AI dating assistant that helps users craft engaging icebreakers for dating app conversations.
Your goal is to generate a unique, attention-grabbing first message based on profile details.

Profile details: ${profileDetails}
Desired tone: ${tone}
Dating app: ${datingApp}

Icebreaker Guidelines:
1. Reference specific details from their profile to show genuine interest.
2. Be original and avoid clichés.
3. Keep it concise (1-2 sentences).
4. Include a question to encourage a response.
5. Add appropriate emojis if it fits the tone.

Generate a creative icebreaker that will stand out in their inbox.
`

  return checkApiKeyAndGenerate(prompt)
}

