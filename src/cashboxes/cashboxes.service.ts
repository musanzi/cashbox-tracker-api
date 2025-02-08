import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cashbox } from './entities/cashbox.entity';

@Injectable()
export class CashboxesService {
  constructor(
    @InjectRepository(Cashbox)
    private cashboxesRepository: Repository<Cashbox>
  ) {}

  async create(dto: CreateCashboxDto): Promise<Cashbox> {
    try {
      const data = await this.cashboxesRepository.save({
        ...dto,
        manager: { id: dto.manager }
      });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async getCashBoxByManager(managerId: string): Promise<Cashbox> {
    try {
      return await this.cashboxesRepository.findOneOrFail({
        where: { manager: { id: managerId } }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Cashbox[]> {
    const data = await this.cashboxesRepository.find({
      relations: ['manager']
    });
    return data;
  }

  async findOne(id: string): Promise<Cashbox> {
    try {
      return await this.cashboxesRepository.findOneOrFail({
        where: { id }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateBalance(id: string, balance: number): Promise<Cashbox> {
    try {
      await this.cashboxesRepository.update(id, { balance });
      return await this.findOne(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateCashboxDto): Promise<Cashbox> {
    try {
      const cashbox = await this.findOne(id);
      await this.cashboxesRepository.save({
        ...cashbox,
        ...dto,
        manager: { id: dto.manager }
      });
      const data = await this.cashboxesRepository.findOneOrFail({ where: { id } });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.cashboxesRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
