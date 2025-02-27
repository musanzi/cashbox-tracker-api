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
      const data = await this.transactionsRepository.save({
        ...dto,
        cashbox: { id: dto.cashbox },
        by: { id: user.id }
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(queryParams: QueryParams): Promise<[Transaction[], number]> {
    const { page = 1, cashbox, date = new Date() } = queryParams;
    const take = 30;
    const skip = (page - 1) * take;
    const query = this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.by', 'by')
      .leftJoinAndSelect('t.cashbox', 'cashbox')
      .where('t.created_at >= :date', { date: date.setHours(0, 0, 0, 0) })
      .orderBy('t.updated_at', 'DESC');
    if (cashbox) query.andWhere('cashbox.id = :id', { id: cashbox });
    return await query.skip(skip).take(take).getManyAndCount();
  }

  async findOne(id: string): Promise<Transaction> {
    try {
      return await this.transactionsRepository.findOneOrFail({
        where: { id },
        relations: ['cashbox']
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
        cashbox: { id: dto.cashbox }
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
