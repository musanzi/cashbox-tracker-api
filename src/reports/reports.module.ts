import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { CashboxesModule } from '../cashboxes/cashboxes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), CashboxesModule, UsersModule],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
