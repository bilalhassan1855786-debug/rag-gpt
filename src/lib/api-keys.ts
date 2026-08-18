export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local or Vercel Environment Variables."
    );
  }

  return key;
}