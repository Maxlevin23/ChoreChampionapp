
import { GoogleGenAI } from "@google/genai";
import {GenerateContentResponse} from "@google/genai";

// IMPORTANT: The API key MUST be set as an environment variable `process.env.API_KEY`
// Do not add any UI or code to set this key. It's assumed to be pre-configured.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found. Reminder generation will use a default message. Ensure process.env.API_KEY is set.");
}

const defaultReminder = (choreName: string, memberName: string): string => {
  return `Just a friendly nudge for ${memberName}: please remember to take care of the chore "${choreName}". Thanks!`;
};

export async function geminiGenerateChoreReminder(choreName: string, memberName: string): Promise<string> {
  if (!ai) {
    return defaultReminder(choreName, memberName);
  }

  const prompt = `You are a friendly household assistant. Generate a very short, encouraging, and friendly reminder message for a person named "${memberName}" to complete a household chore called "${choreName}". Keep it concise, ideally one sentence. Example: "Hey ${memberName}, don't forget about ${choreName} when you have a moment!"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Use the specified model
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          // thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster, potentially less nuanced responses if desired. For reminders, default is fine.
        }
    });
    
    const text = response.text;
    if (text && text.trim() !== "") {
      return text.trim();
    } else {
      console.warn("Gemini API returned empty response, using default reminder.");
      return defaultReminder(choreName, memberName);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a graceful fallback if API call fails
    return defaultReminder(choreName, memberName);
  }
}
