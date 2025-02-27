import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Authorization } from '../shared/decorators/rights.decorators';
import { RoleEnum } from '../shared/enums/roles.enum';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { QueryParams } from './utils/query-params.type';

@Controller('transactions')
@Authorization(RoleEnum.Cashier)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.create(user, dto);
  }

  @Get()
  findAll(@Query() queryParams: QueryParams): Promise<[Transaction[], number]> {
    return this.transactionsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto): Promise<Transaction> {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }
}
