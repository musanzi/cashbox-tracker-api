import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CashboxesService } from '../cashboxes/cashboxes.service';
import { ReportTypeEnum } from './utils/type.enum';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    private cashboxesService: CashboxesService,
    private eventEmitter: EventEmitter2
  ) {}

  async generateReport(type: ReportTypeEnum): Promise<{ data: Report }> {
    const { data: cashboxes } = await this.cashboxesService.findAll();
    const total = cashboxes.reduce((acc, cashbox) => acc + cashbox.balance, 0);
    const report: { cashbox: string; balance: number }[] = cashboxes.map((cashbox) => ({
      cashbox: cashbox.name,
      balance: cashbox.balance
    }));
    const data = await this.reportsRepository.save({
      type,
      generated_at: new Date(),
      data: { total, report }
    });
    this.eventEmitter.emit('send-daily-report', { total, data: report });
    return { data };
  }

  @Cron('0 0 18 * * *')
  async dailyReport() {
    await this.generateReport(ReportTypeEnum.Daily);
  }

  async findAll(): Promise<{ data: Report[] }> {
    const data = await this.reportsRepository.find();
    return { data };
  }

  async findOne(id: string): Promise<{ data: Report }> {
    try {
      const data = await this.reportsRepository.findOneOrFail({ where: { id } });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.reportsRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
