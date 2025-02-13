import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { RoleEnum } from '../../shared/enums/roles.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionCategory } from '../../transactions/utils/categories.enum';
import { Transfer } from '../../transfers/entities/transfer.entity';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.query('TRUNCATE TABLE user;');
    await dataSource.query('TRUNCATE TABLE cashbox;');
    await dataSource.query('TRUNCATE TABLE transaction;');
    await dataSource.query('TRUNCATE TABLE transfer;');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');

    const userRepository = dataSource.getRepository(User);
    const cashboxRepository = dataSource.getRepository(Cashbox);

    async function createUsers(count: number, role: RoleEnum): Promise<User[]> {
      return Promise.all(
        Array(count)
          .fill(0)
          .map(async () => {
            return await userRepository.save({
              name: faker.person.firstName(),
              phone_number: faker.phone.number({ style: 'human' }),
              email: faker.internet.email(),
              password: await bcrypt.hash('admin1234', 10),
              role
            });
          })
      );
    }

    async function createTransactions(count: number, cashiers: User[]) {
      const cashboxes = await cashboxRepository.find();
      const categories = [
        TransactionCategory.BUYING,
        TransactionCategory.DEBT_REPAYMENT,
        TransactionCategory.DONATION,
        TransactionCategory.EXTERNAL_DEPOSIT,
        TransactionCategory.GRANT,
        TransactionCategory.INVESTMENT,
        TransactionCategory.LOAN,
        TransactionCategory.MAINTENANCE,
        TransactionCategory.PAYING_FEES,
        TransactionCategory.RENT,
        TransactionCategory.TRANSPORT,
        TransactionCategory.SALARY,
        TransactionCategory.SALES_REVENUE,
        TransactionCategory.TAXES,
        TransactionCategory.UTILITIES
      ];
      return Promise.all(
        Array(count)
          .fill(0)
          .map(async () => {
            const fromCashbox = faker.helpers.arrayElement(cashboxes);
            let toCashbox = faker.helpers.arrayElement(cashboxes);
            // Ensure fromCashbox and toCashbox are not the same
            while (toCashbox.id === fromCashbox.id) {
              toCashbox = faker.helpers.arrayElement(cashboxes);
            }
            return await dataSource.getRepository(Transaction).save({
              amount: +faker.finance.amount(),
              label: faker.lorem.paragraph(),
              category: faker.helpers.arrayElement(categories),
              cashbox: { id: toCashbox.id },
              by: faker.helpers.arrayElement(cashiers),
              created_at: faker.date.recent()
            });
          })
      );
    }

    async function createTransfers(count: number, cashiers: User[]) {
      const cashboxes = await cashboxRepository.find();
      const fromCashbox = faker.helpers.arrayElement(cashboxes);
      let toCashbox = faker.helpers.arrayElement(cashboxes);
      while (toCashbox.id === fromCashbox.id) {
        toCashbox = faker.helpers.arrayElement(cashboxes);
      }
      return Promise.all(
        Array(count)
          .fill(0)
          .map(async () => {
            return await dataSource.getRepository(Transfer).save({
              amount: +faker.finance.amount(),
              label: faker.lorem.paragraph(),
              from_cashbox: fromCashbox,
              to_cashbox: toCashbox,
              by: faker.helpers.arrayElement(cashiers),
              created_at: faker.date.recent()
            });
          })
      );
    }

    async function createCashbox(users: User[]) {
      return Promise.all(
        users.map(async (user) => {
          return await cashboxRepository.save({
            name: faker.company.name(),
            balance: +faker.finance.amount(),
            cashier: { id: user.id }
          });
        })
      );
    }

    await userRepository.save({
      name: 'Wilfried Musanzi',
      phone_number: '+243979265726',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin', 10),
      role: RoleEnum.Admin
    });

    await createUsers(3, RoleEnum.Manager);
    const users = await createUsers(6, RoleEnum.Cashier);
    await createCashbox(users);
    await createTransactions(1000, users);
    await createTransfers(1500, users);
  }
}
