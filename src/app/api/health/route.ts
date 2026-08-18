import {
  NextResponse,
} from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasGeminiKey =
    Boolean(
      process.env.GEMINI_API_KEY
    );

  const hasMongoURI =
    Boolean(
      process.env.MONGODB_URI
    );

  return NextResponse.json({
    status: "ok",

    app:
      process.env.NEXT_PUBLIC_APP_NAME ||
      "BilalGPT",

    services: {
      gemini:
        hasGeminiKey
          ? "configured"
          : "missing",

      mongodb:
        hasMongoURI
          ? "configured"
          : "missing",
    },

    timestamp:
      new Date().toISOString(),
  });
}