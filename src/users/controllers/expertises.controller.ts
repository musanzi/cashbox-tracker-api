import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpertisesService } from '../services/expertises.service';
import { CreateExpertiseDto } from '../dto/create-expertise.dto';
import { UpdateExpertiseDto } from '../dto/update-expertise.dto';
import { Expertise } from '../entities/expertise.entity';
import { Authorization } from '../../shared/decorators/rights.decorators';
import { RoleEnum } from '../../shared/enums/roles.enum';

@Controller('user-expertises')
@Authorization(RoleEnum.Staff)
export class ExpertisesController {
  constructor(private readonly expertisesService: ExpertisesService) {}

  @Post()
  create(@Body() createExpertiseDto: CreateExpertiseDto): Promise<{ data: Expertise }> {
    return this.expertisesService.create(createExpertiseDto);
  }

  @Get()
  @Authorization(RoleEnum.Guest)
  findAll(): Promise<{ data: Expertise[] }> {
    return this.expertisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Expertise }> {
    return this.expertisesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExpertiseDto): Promise<{ data: Expertise }> {
    return this.expertisesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.expertisesService.remove(id);
  }
}
