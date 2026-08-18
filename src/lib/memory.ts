import {
  getDatabase,
} from "./mongodb";

interface MemoryDocument {
  sessionId: string;

  items: string[];

  updatedAt: Date;
}

const COLLECTION =
  "memories";

/**
 * Get saved memories.
 */
export async function getMemory(
  sessionId: string
): Promise<string[]> {
  const db =
    await getDatabase();

  const document =
    await db
      .collection<MemoryDocument>(
        COLLECTION
      )
      .findOne({
        sessionId,
      });

  return (
    document?.items || []
  );
}

/**
 * Save a memory.
 */
export async function saveMemory(
  sessionId: string,
  memory: string
) {
  const db =
    await getDatabase();

  const cleanMemory =
    memory.trim();

  if (!cleanMemory) {
    return;
  }

  await db
    .collection<MemoryDocument>(
      COLLECTION
    )
    .updateOne(
      {
        sessionId,
      },

      {
        $addToSet: {
          items: cleanMemory,
        },

        $set: {
          updatedAt:
            new Date(),
        },
      },

      {
        upsert: true,
      }
    );
}

/**
 * Delete all memories
 * for a session.
 */
export async function clearMemory(
  sessionId: string
) {
  const db =
    await getDatabase();

  await db
    .collection<MemoryDocument>(
      COLLECTION
    )
    .deleteOne({
      sessionId,
    });
}

/**
 * Remove one specific memory.
 */
export async function deleteMemoryItem(
  sessionId: string,
  memory: string
) {
  const db =
    await getDatabase();

  await db
    .collection<MemoryDocument>(
      COLLECTION
    )
    .updateOne(
      {
        sessionId,
      },

      {
        $pull: {
          items: memory,
        },

        $set: {
          updatedAt:
            new Date(),
        },
      }
    );
}