import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getMemory,
  saveMemory,
  deleteMemoryItem,
  clearMemory,
} from "@/lib/memory";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest
) {
  try {
    const sessionId =
      request.nextUrl.searchParams.get(
        "sessionId"
      );

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "sessionId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const memories =
      await getMemory(
        sessionId
      );

    return NextResponse.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error(
      "Memory GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load memory.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const sessionId =
      typeof body.sessionId ===
      "string"
        ? body.sessionId
        : "";

    const memory =
      typeof body.memory ===
      "string"
        ? body.memory.trim()
        : "";

    if (!sessionId || !memory) {
      return NextResponse.json(
        {
          error:
            "sessionId and memory are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (memory.length > 1000) {
      return NextResponse.json(
        {
          error:
            "Memory is too long.",
        },
        {
          status: 400,
        }
      );
    }

    await saveMemory(
      sessionId,
      memory
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Memory POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save memory.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const sessionId =
      typeof body.sessionId ===
      "string"
        ? body.sessionId
        : "";

    const memory =
      typeof body.memory ===
      "string"
        ? body.memory
        : "";

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "sessionId is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (memory) {
      await deleteMemoryItem(
        sessionId,
        memory
      );
    } else {
      await clearMemory(
        sessionId
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Memory DELETE error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete memory.",
      },
      {
        status: 500,
      }
    );
  }
}