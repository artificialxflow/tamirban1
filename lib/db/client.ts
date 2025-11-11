import { MongoClient, type Db } from "mongodb";

type MongoGlobals = {
  client: MongoClient | null;
  db: Db | null;
};

declare global {
  var __tamirban_mongo__: MongoGlobals | undefined;
}

const mongoGlobal = globalThis.__tamirban_mongo__ ?? { client: null, db: null };

if (process.env.NODE_ENV !== "production") {
  globalThis.__tamirban_mongo__ = mongoGlobal;
}

function deriveDbNameFromUri(uri: string): string | null {
  try {
    const parsed = new URL(uri);
    const pathname = parsed.pathname.replace(/^\//, "");
    return pathname || null;
  } catch {
    return null;
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  if (mongoGlobal.client) {
    return mongoGlobal.client;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5_000,
    retryWrites: true,
  });

  mongoGlobal.client = client;
  return client;
}

export async function getMongoDb(forcedDbName?: string): Promise<Db> {
  if (mongoGlobal.db && !forcedDbName) {
    return mongoGlobal.db;
  }

  const client = await getMongoClient();
  const dbName =
    forcedDbName ??
    process.env.MONGODB_DB_NAME ??
    deriveDbNameFromUri(process.env.MONGODB_URI ?? "");

  if (!dbName) {
    throw new Error(
      "MONGODB_DB_NAME is not defined. Set it explicitly or pass a database name to getMongoDb().",
    );
  }

  const db = client.db(dbName);

  if (!forcedDbName) {
    mongoGlobal.db = db;
  }

  return db;
}

export async function disconnectMongo(): Promise<void> {
  if (mongoGlobal.client) {
    await mongoGlobal.client.close();
    mongoGlobal.client = null;
    mongoGlobal.db = null;
  }
}

