import { Document, FindCursor, MongoClient, WithId } from 'mongodb';

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_SERVER;
const port = process.env.MONGODB_PORT;
// localhost:27017
export function createMongoClient() {
  const fullAddress = `mongodb://${user}:${pass}@${url}:${port}/?maxPoolSize=20`;

  console.log('MONGO URL:', fullAddress);
  return new MongoClient(fullAddress, { loggerLevel: 'debug' });
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
    console.log('CLOSING client', client);
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
    await cursor?.close();
    await client?.close();
  }
}

export async function deleteAllTransactions() {
  try {
    await client.connect();
    const collection = client.db('main').collection('logs');
    await collection.deleteMany({});
  } catch (e) {
    console.error(e);
  } finally {
    await client?.close();
  }
}
