import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashboxesService } from './cashboxes.service';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { Cashbox } from './entities/cashbox.entity';

@Controller('cashboxes')
export class CashboxesController {
  constructor(private readonly cashboxesService: CashboxesService) {}

  @Post()
  create(@Body() dto: CreateCashboxDto): Promise<{ data: Cashbox }> {
    return this.cashboxesService.create(dto);
  }

  @Get()
  findAll(): Promise<{ data: Cashbox[] }> {
    return this.cashboxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Cashbox }> {
    return this.cashboxesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashboxDto): Promise<{ data: Cashbox }> {
    return this.cashboxesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.cashboxesService.remove(id);
  }
}
