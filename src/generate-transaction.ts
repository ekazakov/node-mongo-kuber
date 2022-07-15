import { faker } from '@faker-js/faker';

export function generateTransaction(date: Date) {
  return {
    date: date.toISOString(),
    from: { user: faker.name.findName(), iban: faker.finance.iban(true) },
    type: faker.finance.transactionType(),
    amount: faker.finance.amount(10, 10 ** 6, 2, '$'),
    description: faker.lorem.sentence(),
    to: { user: faker.name.findName(), iban: faker.finance.iban(true) },
  };
}
