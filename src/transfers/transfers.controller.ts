import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { Transfer } from './entities/transfer.entity';
import { QueryParams } from './utils/query-params.type';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';

@Controller('transfers')
@Authorization(RoleEnum.Cashier)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateTransferDto): Promise<Transfer> {
    return this.transfersService.create(user, dto);
  }

  @Get()
  findAll(@Query() queryParams: QueryParams): Promise<[Transfer[], number]> {
    return this.transfersService.findAll(queryParams);
  }

  @Get('for-cashier')
  findForCashier(@CurrentUser() user: User, @Query() queryParams: QueryParams): Promise<[Transfer[], number]> {
    return this.transfersService.findForCashier(user, queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transfer> {
    return this.transfersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransferDto): Promise<Transfer> {
    return this.transfersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.transfersService.remove(id);
  }
}
