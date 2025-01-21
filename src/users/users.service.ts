import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(dto: CreateUserDto): Promise<{ data: User }> {
    try {
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      const data = await this.usersRepository.save({ ...dto, password });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<{ data: User[] }> {
    const data = await this.usersRepository.find({});
    return { data };
  }

  async findOne(id: string): Promise<{ data: User }> {
    try {
      const data: User = await this.usersRepository.findOneOrFail({ where: { id } });
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string): Promise<{ data: User }> {
    try {
      const data: User = await this.usersRepository.findOneOrFail({ where: { email } });
      return { data };
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<{ data: User }> {
    try {
      await this.usersRepository.update(id, dto);
      const { data } = await this.findOne(id);
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async updateProfile(user: User, dto: UpdateProfileDto): Promise<{ data: User }> {
    try {
      await this.usersRepository.update(user.id, dto);
      const { data } = await this.findOne(user.id);
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async uploadImage(user: User, file: Express.Multer.File): Promise<{ data: User }> {
    try {
      if (user.profile) await fs.unlink(`./uploads/profiles/${user.profile}`);
      await this.usersRepository.update(user.id, { profile: file.filename });
      const { data } = await this.findOne(user.id);
      return { data };
    } catch {
      throw new BadRequestException();
    }
  }

  async updatePassword(id: string, password: string): Promise<{ data: User }> {
    try {
      const { data } = await this.findOne(id);
      await this.usersRepository.update(data.id, { password });
      return { data };
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
