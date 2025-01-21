import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';

@Controller('reports')
@Authorization(RoleEnum.Manager)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() dto: CreateReportDto): Promise<{ data: Report }> {
    return this.reportsService.create(dto);
  }

  @Get()
  findAll(): Promise<{ data: Report[] }> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Report }> {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto): Promise<{ data: Report }> {
    return this.reportsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }
}
