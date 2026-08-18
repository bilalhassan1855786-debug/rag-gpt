import {
  GoogleGenAI,
} from "@google/genai";

import {
  getEnv,
  config,
} from "./env";

let geminiClient:
  | GoogleGenAI
  | null = null;

function getGeminiClient() {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: getEnv(
        "GEMINI_API_KEY"
      ),
    });
  }

  return geminiClient;
}

export interface GeminiHistoryMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

/**
 * Generate text embedding for RAG.
 */
export async function createEmbedding(
  text: string
): Promise<number[]> {
  const client =
    getGeminiClient();

  const response =
    await client.models.embedContent({
      model:
        config.embeddingModel,

      contents: text,

      config: {
        outputDimensionality:
          config.embeddingDimensions,
      },
    });

  const values =
    response.embeddings?.[0]
      ?.values;

  if (
    !values ||
    values.length === 0
  ) {
    throw new Error(
      "Gemini returned an empty embedding."
    );
  }

  return values;
}

/**
 * Generate normal AI response.
 */
export async function generateAIResponse({
  systemInstruction,
  history,
}: {
  systemInstruction: string;
  history: GeminiHistoryMessage[];
}) {
  const client =
    getGeminiClient();

  const response =
    await client.models.generateContent(
      {
        model: config.geminiModel,

        contents: history,

        config: {
          systemInstruction,

          temperature: 0.65,

          maxOutputTokens: 4096,
        },
      }
    );

  const text =
    response.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text;
}