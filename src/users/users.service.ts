import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleEnum } from '../shared/enums/roles.enum';
import { QueryParams } from './utils/query-params.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      const password = 'Mtg1234';
      const data = await this.usersRepository.save({ ...dto, password });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async findCashiers(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { role: RoleEnum.Cashier }
    });
  }

  async findAll(queryParams: QueryParams): Promise<[User[], number]> {
    const { page = 1, role } = queryParams;
    const take = 12;
    const skip = (page - 1) * take;
    const query = this.usersRepository.createQueryBuilder('u');
    if (role) query.andWhere('u.role = :role', { role });
    return await query.skip(skip).take(take).orderBy('u.updated_at', 'DESC').getManyAndCount();
  }

  async findManagers(): Promise<User[]> {
    const data = await this.usersRepository.find({ where: { role: RoleEnum.Manager } });
    return data;
  }

  async findOne(id: string): Promise<User> {
    try {
      const data: User = await this.usersRepository.findOneOrFail({ where: { id } });
      return data;
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { email }
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      await this.usersRepository.update(id, dto);
      return await this.findOne(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateProfile(user: User, dto: UpdateProfileDto): Promise<User> {
    try {
      await this.usersRepository.update(user.id, dto);
      return await this.findOne(user.id);
    } catch {
      throw new BadRequestException();
    }
  }

  async uploadImage(user: User, file: Express.Multer.File): Promise<User> {
    try {
      if (user.profile) await fs.unlink(`./uploads/profiles/${user.profile}`);
      await this.usersRepository.update(user.id, { profile: file.filename });
      return await this.findOne(user.id);
    } catch {
      throw new BadRequestException();
    }
  }

  async updatePassword(id: string, password: string): Promise<User> {
    try {
      await this.usersRepository.update(id, { password });
      return await this.findOne(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.usersRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
