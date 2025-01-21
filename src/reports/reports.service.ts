import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>
  ) {}

  async create(dto: CreateReportDto): Promise<{ data: Report }> {
    try {
      const report = this.reportsRepository.create(dto);
      const data = await this.reportsRepository.save(report);
      return { data };
    } catch {
      throw new BadRequestException();
    }
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

  async update(id: string, dto: UpdateReportDto): Promise<{ data: Report }> {
    try {
      await this.reportsRepository.update(id, dto);
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
