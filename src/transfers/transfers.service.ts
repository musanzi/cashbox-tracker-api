import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { QueryParams } from './utils/query-params.type';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>
  ) {}

  async create(user: User, dto: CreateTransferDto): Promise<Transfer> {
    try {
      return await this.transferRepository.save({
        ...dto,
        from_cashbox: { id: dto.from },
        to_cashbox: { id: dto.to },
        by: user
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(queryParams: QueryParams): Promise<[Transfer[], number]> {
    const { page = 1, from_cashbox, to_cashbox, date = new Date() } = queryParams;
    const take = 30;
    const skip = (page - 1) * take;
    const query = this.transferRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.by', 'by')
      .leftJoinAndSelect('t.from_cashbox', 'fromCashbox')
      .leftJoinAndSelect('t.to_cashbox', 'toCashbox')
      .andWhere('t.created_at >= :date', { date: date.setHours(0, 0, 0, 0) });
    if (from_cashbox) query.andWhere('fromCashbox.id = :id', { id: from_cashbox });
    if (to_cashbox) query.andWhere('toCashbox.id = :id', { id: to_cashbox });
    return await query.skip(skip).take(take).orderBy('t.created_at', 'DESC').getManyAndCount();
  }

  async findOne(id: string): Promise<Transfer> {
    try {
      return await this.transferRepository.findOneOrFail({
        where: { id },
        relations: ['by', 'from_cashbox', 'to_cashbox']
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateTransferDto): Promise<Transfer> {
    try {
      const transfer = await this.findOne(id);
      return await this.transferRepository.save({
        ...transfer,
        ...dto,
        from_cashbox: { id: dto.from },
        to_cashbox: { id: dto.to }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.transferRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
