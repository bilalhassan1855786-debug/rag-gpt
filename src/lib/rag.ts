import {
  createEmbedding,
} from "./gemini";

import {
  getCollection,
} from "./mongodb";

export interface KnowledgeDocument {
  _id?: unknown;

  title: string;

  category: string;

  url: string;

  text: string;

  embedding: number[];

  source?: string;

  createdAt?: Date;
}

export interface RAGSource {
  title: string;

  url: string;

  category: string;

  score?: number;
}

/**
 * Search Superior / knowledge-base
 * documents using MongoDB Atlas Vector Search.
 */
export async function searchKnowledge(
  query: string,
  limit = 6
) {
  /*
   * MongoDB collection is configured
   * internally by mongodb.ts.
   */
  const collection =
    await getCollection();

  /*
   * Convert user query into an
   * embedding vector using Gemini.
   */
  const queryVector =
    await createEmbedding(
      query
    );

  /*
   * MongoDB Atlas Vector Search.
   */
  const results =
    await collection
      .aggregate([
        {
          $vectorSearch: {
            index:
              "knowledge_vector_index",

            path: "embedding",

            queryVector,

            numCandidates:
              Math.max(
                50,
                limit * 10
              ),

            limit,
          },
        },

        {
          $project: {
            _id: 0,

            title: 1,

            category: 1,

            url: 1,

            text: 1,

            score: {
              $meta:
                "vectorSearchScore",
            },
          },
        },
      ])
      .toArray();

  return results as Array<{
    title: string;

    category: string;

    url: string;

    text: string;

    score: number;
  }>;
}

/**
 * Convert retrieved documents
 * into context for Gemini.
 */
export function buildRAGContext(
  documents: Awaited<
    ReturnType<
      typeof searchKnowledge
    >
  >
) {
  /*
   * No documents found.
   */
  if (
    documents.length === 0
  ) {
    return {
      context: "",

      sources:
        [] as RAGSource[],
    };
  }

  /*
   * Build context that will be
   * sent to Gemini from the backend.
   */
  const context =
    documents
      .map(
        (document, index) =>
          `
[SOURCE ${index + 1}]

Title:
${document.title}

Category:
${document.category}

Content:
${document.text}

Official URL:
${document.url}
`
      )
      .join("\n");

  /*
   * Build source information
   * for the frontend.
   */
  const sources: RAGSource[] =
    documents.map(
      (document) => ({
        title:
          document.title,

        url:
          document.url,

        category:
          document.category,

        score:
          document.score,
      })
    );

  return {
    context,

    sources,
  };
}