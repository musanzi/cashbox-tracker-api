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

  async create(user: User, dto: CreateTransactionDto): Promise<{ data: Transaction }> {
    try {
      const { data: cashBox } = await this.cashBoxsService.findOne(dto.from);
      if (dto.amount > cashBox.balance * 0.95)
        throw new BadRequestException('Transaction amount exceeds 95% of the cashbox balance');
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

  async findAll(queryParams: QueryParams): Promise<{ data: Transaction[] }> {
    const { page, fromCashBox, toCashBox } = queryParams;
    const query = this.transactionsRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.from', 'from')
      .leftJoinAndSelect('t.to', 'to')
      .leftJoinAndSelect('t.by', 'by');
    const take: number = 12;
    const skip = ((page || 1) - 1) * take;
    if (fromCashBox) query.where('from.id = :fromCashBox = :fromCashBox', { fromCashBox });
    if (toCashBox) query.where('to.id = :toCashBox = :toCashBox', { toCashBox });
    const data = await query.take(take).skip(skip).getMany();
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
