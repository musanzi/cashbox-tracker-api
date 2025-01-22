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

  async create(dto: CreateCashboxDto): Promise<{ data: Cashbox }> {
    try {
      const data = await this.cashboxesRepository.save(dto);
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<{ data: Cashbox[] }> {
    const data = await this.cashboxesRepository.find();
    return { data };
  }

  async findOne(id: string): Promise<{ data: Cashbox }> {
    try {
      const data = await this.cashboxesRepository.findOneOrFail({ where: { id } });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async updateBalance(id: string, balance: number): Promise<{ data: Cashbox }> {
    try {
      await this.cashboxesRepository.update(id, { balance });
      const { data } = await this.findOne(id);
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateCashboxDto): Promise<{ data: Cashbox }> {
    try {
      await this.cashboxesRepository.update(id, dto);
      const data = await this.cashboxesRepository.findOneOrFail({ where: { id } });
      return { data };
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
