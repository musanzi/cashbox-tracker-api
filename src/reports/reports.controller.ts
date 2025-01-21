import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';
import { ReportTypeEnum } from './utils/type.enum';

@Controller('reports')
@Authorization(RoleEnum.Manager)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  generateReport(): Promise<{ data: Report }> {
    return this.reportsService.generateReport(ReportTypeEnum.Daily);
  }

  @Get()
  findAll(): Promise<{ data: Report[] }> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Report }> {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }
}
