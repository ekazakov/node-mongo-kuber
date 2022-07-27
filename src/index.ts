import './init-config.js';
import fs from 'node:fs';
import { generateTransaction } from './generate-transaction.js';
import { fastify } from 'fastify';
import { readTransactions, saveTransaction, deleteAllTransactions } from './mongo.js';

const port: number = Number(process.env.PORT) || 3000;

console.log(JSON.stringify(process.env, null, '\t'));

const _fastify = fastify({
  logger: true,
});

function createTransactionStore() {
  return {
    async addTransaction(t: any) {
      console.log(t);
      await saveTransaction(t);
    },

    async getAll() {
      const data = (await readTransactions()) ?? [];
      console.log('data:', data);
      return data;
    },

    async deleteAll() {
      await deleteAllTransactions();
    }
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

_fastify.delete('/transactions', async (req, res) => {
  await tStore.deleteAll();
  res.status(204);
});

_fastify.post('/create_transaction', async (req, res) => {
  const transaction = generateTransaction(new Date());
  await tStore.addTransaction(transaction);
  res.status(204);
});

const dir = './tmp';

_fastify.post('/exit', () => {
  process.exit(1);
});

_fastify.post('/save', async () => {
  const data = await tStore.getAll();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(`${dir}/data.json`, JSON.stringify(data), { encoding: 'utf-8', flag: 'w+' });
});

_fastify.delete('/remove', async () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.unlinkSync(`${dir}/data.json`);
});

_fastify.get('/read', (req, res) => {
  const data = fs.readFileSync(`${dir}/data.json`, { encoding: 'utf-8' });
  res.send(data);
});

_fastify.listen({ port, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    _fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server started on ${port} port\nMode - ${process.env.NODE_ENV}`);
});
