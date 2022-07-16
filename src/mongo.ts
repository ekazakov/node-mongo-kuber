import { Document, FindCursor, MongoClient, WithId } from 'mongodb';

const user = 'root';
const pass = 'root';
export function createMongoClient() {
  const url = `mongodb://${user}:${pass}@localhost:27017/?maxPoolSize=20`;
  return new MongoClient(url);
}

const client = createMongoClient();

export async function saveTransaction(transaction: any) {
  try {
    await client.connect();
    const collection = client.db('main').collection('logs');
    await collection.insertOne(transaction);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

export async function readTransactions() {
  let cursor: FindCursor<WithId<Document>> = null!;
  try {
    await client.connect();
    const collection = client.db('main').collection('logs');
    cursor = await collection.find({}, { limit: 100 });
    return (await cursor.toArray()).map((document) => ({
      ...document,
      _id: document._id.toString(),
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await cursor.close();
    await client.close();
  }
}
