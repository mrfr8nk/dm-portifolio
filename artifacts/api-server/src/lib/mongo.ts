import { MongoClient, type Collection, type Db, type Document } from "mongodb";

let clientPromise: Promise<MongoClient> | undefined;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is required");
  return uri;
}

async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    const client = new MongoClient(getMongoUri());
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  const databaseName = new URL(getMongoUri()).pathname.slice(1) || "portfolio";
  return client.db(databaseName);
}

export async function collection(name: string): Promise<Collection<Document>> {
  return (await getDatabase()).collection(name);
}

export function withoutMongoId<T extends Document>(value: T): Omit<T, "_id"> {
  const { _id: _ignored, ...rest } = value;
  return rest;
}

export async function closeMongo(): Promise<void> {
  if (!clientPromise) return;
  const client = await clientPromise;
  await client.close();
  clientPromise = undefined;
}