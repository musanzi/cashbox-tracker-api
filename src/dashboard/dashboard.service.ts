import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cashbox } from '../cashboxes/entities/cashbox.entity';
import { DashboardData } from './utils/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(private dataSource: DataSource) {}

  async getDashboardData(): Promise<DashboardData> {
    const chartData = (await this.dataSource.createQueryBuilder(Cashbox, 'c').getMany()).map((c) => ({
      name: c.name,
      value: +c.balance
    }));
    return { chartData };
  }
}
