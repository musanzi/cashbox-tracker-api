import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '../../users/entities/user.entity';
import { RoleEnum } from '../../shared/enums/roles.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    await dataSource.query('TRUNCATE TABLE user;');
    await dataSource.query('TRUNCATE TABLE cashbox;');
    await dataSource.query('TRUNCATE TABLE transaction;');
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
              from: { id: fromCashbox.id },
              to: { id: toCashbox.id },
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
            manager: { id: user.id }
          });
        })
      );
    }

    await userRepository.save({
      name: faker.person.firstName(),
      phone_number: faker.phone.number({ style: 'human' }),
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin1234', 10),
      role: RoleEnum.Admin
    });

    await createUsers(10, RoleEnum.Manager);
    await createUsers(2, RoleEnum.Admin);
    const users = await createUsers(5, RoleEnum.Cashier);
    await createCashbox(users);
    await createTransactions(30, users);
  }
}
