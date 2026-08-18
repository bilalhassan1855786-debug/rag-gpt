import "dotenv/config";

import {
  superiorDocuments,
} from "../data/superior-docs";

import {
  createEmbedding,
} from "../src/lib/gemini";

import {
  getCollection,
} from "../src/lib/mongodb";

async function main() {
  console.log(
    "\n🚀 Starting Superior University knowledge ingestion...\n"
  );

  /*
   * MongoDB collection.
   *
   * getCollection() already gets the
   * collection name from the backend
   * configuration, so we don't pass
   * an argument here.
   */
  const collection =
    await getCollection();

  /*
   * Optional:
   * Uncomment this if you want to
   * completely rebuild the collection.
   */
  // await collection.deleteMany({});

  for (
    let index = 0;
    index < superiorDocuments.length;
    index++
  ) {
    const document =
      superiorDocuments[index];

    console.log(
      `Embedding ${index + 1}/${superiorDocuments.length}: ${document.title}`
    );

    /*
     * Generate Gemini embedding.
     */
    const embedding =
      await createEmbedding(
        document.text
      );

    /*
     * Insert/update document.
     *
     * URL + title are used to identify
     * an existing knowledge document.
     */
    await collection.updateOne(
      {
        url: document.url,

        title: document.title,
      },

      {
        $set: {
          title:
            document.title,

          category:
            document.category,

          url:
            document.url,

          text:
            document.text,

          embedding,

          source:
            "Superior University",

          updatedAt:
            new Date(),
        },
      },

      {
        upsert: true,
      }
    );
  }

  console.log(
    "\n✅ Superior knowledge ingestion completed."
  );

  console.log(
    `📚 Documents processed: ${superiorDocuments.length}`
  );

  console.log(
    "🔎 Next step: configure MongoDB Atlas Vector Search index."
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(
    "\n❌ Ingestion failed:\n",
    error
  );

  process.exit(1);
});