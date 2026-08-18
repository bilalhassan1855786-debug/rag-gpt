export function getEnv(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is not configured. Add it to .env.local or Vercel Environment Variables.`
    );
  }

  return value;
}

export const config = {
  geminiModel:
    process.env.GEMINI_MODEL ||
    "gemini-3.6-flash",

  embeddingModel:
    process.env.GEMINI_EMBEDDING_MODEL ||
    "gemini-embedding-2",

  embeddingDimensions: Number(
    process.env.EMBEDDING_DIMENSIONS || "768"
  ),

  mongoDatabase:
    process.env.MONGODB_DB ||
    "bilalgpt",

  mongoCollection:
    process.env.MONGODB_VECTOR_COLLECTION ||
    "knowledge",

  appName:
    process.env.NEXT_PUBLIC_APP_NAME ||
    "BilalGPT",
};