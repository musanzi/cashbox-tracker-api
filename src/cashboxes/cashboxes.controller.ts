import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashboxesService } from './cashboxes.service';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { Cashbox } from './entities/cashbox.entity';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';

@Controller('cashboxes')
@Authorization(RoleEnum.Admin)
export class CashboxesController {
  constructor(private readonly cashboxesService: CashboxesService) {}

  @Post()
  create(@Body() dto: CreateCashboxDto): Promise<Cashbox> {
    return this.cashboxesService.create(dto);
  }

  @Get()
  findAll(): Promise<Cashbox[]> {
    return this.cashboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cashbox> {
    return this.cashboxesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashboxDto): Promise<Cashbox> {
    return this.cashboxesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.cashboxesService.remove(id);
  }
}
