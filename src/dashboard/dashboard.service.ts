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
    const totalUsers = await this.dataSource.createQueryBuilder(User, 'u').getCount();
    const totalCashboxes = await this.dataSource.createQueryBuilder(Cashbox, 'u').getCount();
    const totalTransfersByMonth = await this.dataSource
      .createQueryBuilder(Transfer, 't')
      .select('SUM(t.amount)', 'total')
      .addSelect('DATE_FORMAT(t.created_at, "%m")', 'month')
      .groupBy('month')
      .getRawMany();
    const totalTransactionsByMonth = await this.dataSource
      .createQueryBuilder(Transaction, 't')
      .select('SUM(t.amount)', 'total')
      .addSelect('DATE_FORMAT(t.created_at, "%m")', 'month')
      .groupBy('month')
      .getRawMany();
    const availableBalance = await this.dataSource
      .createQueryBuilder()
      .select('SUM(c.balance)', 'availableBalance')
      .from(Cashbox, 'c')
      .getRawOne();
    return {
      totalUsers,
      totalCashboxes,
      totalTransfersByMonth,
      totalTransactionsByMonth,
      availableBalance
    };
  }
}
