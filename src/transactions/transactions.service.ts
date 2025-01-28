import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Between, Repository } from 'typeorm';
import { CashboxesService } from '../cashboxes/cashboxes.service';
import { User } from '../users/entities/user.entity';
import { QueryParams } from './utils/query-params.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly cashBoxsService: CashboxesService
  ) {}

  async create(user: User, dto: CreateTransactionDto): Promise<{ data: Transaction }> {
    try {
      await this.processTransaction(dto);
      const data = await this.transactionsRepository.save({
        ...dto,
        from: { id: dto.from },
        to: { id: dto.to },
        by: { id: user.id }
      });
      return { data };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async processTransaction(dto: CreateTransactionDto): Promise<void> {
    const { data: fromCashbox } = await this.cashBoxsService.findOne(dto.from);
    const { data: toCashbox } = await this.cashBoxsService.findOne(dto.to);
    if (dto.amount > fromCashbox.balance * 0.95) throw new BadRequestException('Not enough money in the cashbox');
    await this.cashBoxsService.updateBalance(dto.from, fromCashbox.balance - dto.amount);
    await this.cashBoxsService.updateBalance(dto.to, toCashbox.balance + dto.amount);
  }

  async findAll(queryParams: QueryParams): Promise<{ data: [Transaction[], number] }> {
    const BetweenDates = (from: string, to: string) => Between(new Date(from), new Date(to));
    const { page = 1, from, to } = queryParams;
    const take = 6;
    const skip = (page - 1) * take;
    const data = await this.transactionsRepository.findAndCount({
      take,
      skip,
      relations: ['from', 'to', 'by'],
      where: { created_at: BetweenDates(from, to) },
      order: { created_at: 'DESC' }
    });
    return { data };
  }

  async findOne(id: string): Promise<{ data: Transaction }> {
    try {
      const data = await this.transactionsRepository.findOneOrFail({
        where: { id },
        relations: ['from', 'to', 'by']
      });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<{ data: Transaction }> {
    try {
      const { data: transaction } = await this.findOne(id);
      const data = await this.transactionsRepository.save({
        ...transaction,
        ...dto,
        from: { id: dto.from ?? transaction.from.id },
        to: { id: dto.to ?? transaction.to.id }
      });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.transactionsRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
