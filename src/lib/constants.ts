export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "BilalGPT";

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3-flash-preview";

export const MAX_HISTORY_MESSAGES = 30;

export const MAX_MESSAGE_LENGTH = 12000;

export const SUGGESTED_PROMPTS = [
  "Tell me about Superior University",
  "What programs does Superior University offer?",
  "Explain BS Artificial Intelligence",
  "What is the Superior University admission process?",
  "What are the latest available fee details?",
  "Help me understand my AI course",
  "Explain RAG in simple words",
  "Help me build an AI project",
];