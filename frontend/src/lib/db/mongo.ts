import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "fazo";

declare global {
  // eslint-disable-next-line no-var
  var _fazoMongoClient: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

function connect(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to frontend/.env.local");
  }
  // Reuse a single connection across HMR reloads (dev) and lambda invocations (prod).
  if (process.env.NODE_ENV === "development") {
    if (!global._fazoMongoClient) {
      global._fazoMongoClient = new MongoClient(uri).connect();
    }
    return global._fazoMongoClient;
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

export async function getClient(): Promise<MongoClient> {
  return connect();
}

export async function getDb(): Promise<Db> {
  return (await connect()).db(dbName);
}
