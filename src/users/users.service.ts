import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UpdateProfileDto from '../auth/dto/update-profile.dto';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2
  ) {}

  async findAll(): Promise<{ data: User[] }> {
    const data = await this.userRepository.find({});
    return { data };
  }

  async create(dto: CreateUserDto): Promise<{ data: User; password: string }> {
    try {
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      const data: User = await this.userRepository.save({
        ...dto,
        password,
        verified_at: new Date()
      });
      this.eventEmitter.emit('user.created', { user: data, password });
      return { data, password };
    } catch {
      throw new BadRequestException("Erreur lors de la création de l'utilisateur");
    }
  }

  async findOne(id: string): Promise<{ data: User }> {
    try {
      const data: User = await this.userRepository.findOneOrFail({
        where: { id }
      });
      return { data };
    } catch {
      throw new BadRequestException('Aucun utilisateur trouvé avec cet identifiant');
    }
  }

  async findByEmail(email: string): Promise<{ data: User }> {
    try {
      const data: User = await this.userRepository.findOneOrFail({ where: { email } });
      return { data };
    } catch {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<{ data: User }> {
    try {
      const { data: user } = await this.findOne(id);
      const data: User = await this.userRepository.save({
        ...user,
        ...dto
      });
      return { data };
    } catch {
      throw new BadRequestException("Erreur lors de la modification de l'utilisateur");
    }
  }

  async updateProfile(currentUser: User, dto: UpdateProfileDto): Promise<{ data: User }> {
    try {
      const { data: user } = await this.findOne(currentUser.id);
      delete user.password;
      await this.userRepository.save({ ...user, ...dto });
      const { data } = await this.findOne(user.id);
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la modification du profil');
    }
  }

  async uploadImage(currenUser: User, file: Express.Multer.File): Promise<{ data: User }> {
    try {
      const { data: user } = await this.findOne(currenUser.id);
      if (user.profile) await fs.unlink(`./uploads/profiles/${user.profile}`);
      delete user.password;
      await this.userRepository.save({ ...user, profile: file.filename });
      const { data } = await this.findOne(user.id);
      return { data };
    } catch {
      throw new BadRequestException("Erreur lors de la mise à jour de l'image");
    }
  }

  async updatePassword(id: string, password: string): Promise<{ data: User }> {
    try {
      const { data } = await this.findOne(id);
      await this.userRepository.update(data.id, { password });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la réinitialisation du mot de passe');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.userRepository.softDelete(id);
    } catch {
      throw new BadRequestException("Erreur lors de la suppression de l'utilisateur");
    }
  }
}
