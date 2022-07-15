import * as dotenv from 'dotenv';
import { generateTransaction } from './generate-transaction.js';
import { fastify } from 'fastify';

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
  const transactions = new Array(0);
  // let pointer = 0;

  return {
    addTransaction(t: any) {
      transactions.push(t);
      // pointer++;
      // pointer = pointer % 100;
    },

    getAll() {
      return transactions;
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

_fastify.get('/transactions', (req, res) => {
  res.send(tStore.getAll());
});

_fastify.post('/create_transaction', (req, res) => {
  const transaction = generateTransaction(new Date());
  tStore.addTransaction(transaction);
  res.send(transaction);
});

_fastify.listen({ port }, function (err, address) {
  if (err) {
    _fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server started on ${port} port\nMode - ${process.env.NODE_ENV}`);
});
