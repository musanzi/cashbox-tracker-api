import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Transfer } from '../transfers/entities/transfer.entity';
import { Cashbox } from '../cashboxes/entities/cashbox.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { DashboardData } from './utils/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private dataSource: DataSource) {}

  async getDashboardData(): Promise<DashboardData> {
    const chartData = (await this.dataSource.createQueryBuilder(Cashbox, 'c').getMany()).map((c) => ({
      name: c.name,
      value: +c.balance
    }));
    const totalUsers = await this.dataSource.createQueryBuilder(User, 'u').getCount();
    const totalTransactions = await this.dataSource
      .createQueryBuilder(Transaction, 't')
      .select('SUM(t.amount)', 'total')
      .getRawOne();
    const totalTransfers = await this.dataSource
      .createQueryBuilder(Transfer, 't')
      .select('SUM(t.amount)', 'total')
      .getRawOne();
    const summary = [
      { name: 'Balance', value: chartData.reduce((acc, cur) => acc + cur.value, 0) },
      { name: 'Transactions', value: +totalTransactions?.total || 0 },
      { name: 'Transferts', value: +totalTransfers?.total || 0 },
      { name: 'Utilisateurs', value: +totalUsers || 0 }
    ];
    return { chartData, summary };
  }
}
