import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
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

  async create(user: User, dto: CreateTransactionDto): Promise<Transaction> {
    try {
      const from = await this.cashBoxsService.getCashBoxByManager(user.id);
      const data = await this.transactionsRepository.save({
        ...dto,
        from,
        to: { id: dto.to },
        by: { id: user.id }
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async findByManager(manager: User, queryParams: QueryParams): Promise<[Transaction[], number]> {
    const { page = 1, date = new Date() } = queryParams;
    const take = 12;
    const skip = (page - 1) * take;
    const from = await this.cashBoxsService.getCashBoxByManager(manager.id);
    return await this.transactionsRepository.findAndCount({
      take,
      skip,
      where: { created_at: new Date(date), from },
      relations: ['from', 'to', 'by'],
      order: { created_at: 'DESC' }
    });
  }

  async findAll(queryParams: QueryParams): Promise<[Transaction[], number]> {
    const { page = 1, date } = queryParams;
    const take = 12;
    const skip = (page - 1) * take;
    return await this.transactionsRepository.findAndCount({
      take,
      skip,
      relations: ['from', 'to', 'by'],
      where: { created_at: new Date(date) },
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      return await this.transactionsRepository.findOneOrFail({
        where: { id }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.findOne(id);
      return await this.transactionsRepository.save({
        ...transaction,
        ...dto,
        to: { id: dto.to }
      });
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
