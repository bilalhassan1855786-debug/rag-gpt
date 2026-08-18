import { NextRequest, NextResponse } from "next/server";

import {
  generateAIResponse,
} from "@/lib/gemini";

import {
  searchKnowledge,
  buildRAGContext,
} from "@/lib/rag";

import {
  getMemory,
} from "@/lib/memory";

import {
  buildSystemPrompt,
} from "@/lib/system-prompt";

export const runtime = "nodejs";

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const message =
      typeof body.message ===
      "string"
        ? body.message.trim()
        : "";

    const sessionId =
      typeof body.sessionId ===
      "string"
        ? body.sessionId
        : "anonymous";

    const incomingHistory =
      Array.isArray(body.history)
        ? body.history
        : [];

    if (!message) {
      return NextResponse.json(
        {
          error:
            "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Protect backend from
     * extremely large requests.
     */
    if (message.length > 12000) {
      return NextResponse.json(
        {
          error:
            "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Limit history to avoid
     * unnecessarily large Gemini requests.
     */
    const history: HistoryMessage[] =
      incomingHistory
        .filter(
          (
            item: unknown
          ): item is HistoryMessage => {
            if (
              !item ||
              typeof item !==
                "object"
            ) {
              return false;
            }

            const value =
              item as HistoryMessage;

            return (
              (value.role ===
                "user" ||
                value.role ===
                  "assistant") &&
              typeof value.content ===
                "string"
            );
          }
        )
        .slice(-20);

    /*
     * RAG search.
     *
     * If Vector Search isn't configured
     * yet, we gracefully continue without it.
     */
    let ragDocuments: Awaited<
      ReturnType<
        typeof searchKnowledge
      >
    > = [];

    try {
      ragDocuments =
        await searchKnowledge(
          message,
          6
        );
    } catch (ragError) {
      console.error(
        "RAG search failed:",
        ragError
      );
    }

    const {
      context: ragContext,
      sources,
    } =
      buildRAGContext(
        ragDocuments
      );

    /*
     * User memory.
     */
    let memories: string[] = [];

    try {
      memories =
        await getMemory(
          sessionId
        );
    } catch (memoryError) {
      console.error(
        "Memory retrieval failed:",
        memoryError
      );
    }

    /*
     * Backend-only system prompt.
     */
    const systemInstruction =
      buildSystemPrompt({
        ragContext,
        memories,
      });

    /*
     * Convert frontend history
     * to Gemini history format.
     */
    const geminiHistory = [
      ...history.map(
        (item) => ({
          role:
            item.role ===
            "assistant"
              ? ("model" as const)
              : ("user" as const),

          parts: [
            {
              text:
                item.content,
            },
          ],
        })
      ),

      {
        role: "user" as const,

        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    /*
     * Generate response.
     */
    const answer =
      await generateAIResponse({
        systemInstruction,
        history:
          geminiHistory,
      });

    return NextResponse.json({
      success: true,

      answer,

      sources,

      ragUsed:
        ragDocuments.length >
        0,

      memoryUsed:
        memories.length > 0,
    });
  } catch (error) {
    console.error(
      "Chat API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}