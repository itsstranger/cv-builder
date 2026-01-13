import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Get API key from environment variables (Next.js makes these available)
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Gemini API key not found. Please set GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY in your .env.local file');
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: apiKey,
  })],
  model: 'googleai/gemini-2.5-flash',
});
