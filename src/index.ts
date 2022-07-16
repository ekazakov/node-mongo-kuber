import * as dotenv from 'dotenv';
import { generateTransaction } from './generate-transaction.js';
import { fastify } from 'fastify';
import { readTransactions, saveTransaction } from './mongo.js';

//set up the env variables from './env' or './dev.env'
//to add more presets change package.json
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env' : './dev.env',
});

const port: number = Number(process.env.PORT) || 3000;

const _fastify = fastify({
  logger: true,
});

function createTransactionStore() {
  // const transactions = new Array(0);

  return {
    async addTransaction(t: any) {
      // transactions.push(t);
      console.log(t);
      await saveTransaction(t);
    },

    async getAll() {
      const data = (await readTransactions()) ?? [];
      console.log('data:', data);
      return data;
    },
  };
}

const tStore = createTransactionStore();

_fastify.get('/', (req, res) => {
  res.send({ hello: 'works' });
});

_fastify.get('/transaction', (req, res) => {
  res.send(generateTransaction(new Date()));
});

_fastify.get('/transactions', async (req, res) => {
  const data = await tStore.getAll();
  res.send(data);
});

_fastify.post('/create_transaction', async (req, res) => {
  const transaction = generateTransaction(new Date());
  await tStore.addTransaction(transaction);
  res.status(204);
});

_fastify.listen({ port }, function (err, address) {
  if (err) {
    _fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server started on ${port} port\nMode - ${process.env.NODE_ENV}`);
});
