import {
  Collection,
  Db,
  Document,
  MongoClient,
} from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is not configured. Add it to .env.local."
  );
}

const dbName =
  process.env.MONGODB_DB ||
  "bilalgpt";

const collectionName =
  process.env.MONGODB_VECTOR_COLLECTION ||
  "knowledge";

/*
 * Keep one MongoDB client during development.
 * This prevents creating a new connection
 * on every hot reload/API request.
 */

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise:
    | Promise<MongoClient>
    | undefined;
}

const client =
  new MongoClient(uri);

const clientPromise =
  global._mongoClientPromise ||
  client.connect();

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise =
    clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const mongoClient =
    await getMongoClient();

  return mongoClient.db(dbName);
}

export async function getCollection<
  T extends Document = Document
>(): Promise<Collection<T>> {
  const database =
    await getDatabase();

  return database.collection<T>(
    collectionName
  );
}