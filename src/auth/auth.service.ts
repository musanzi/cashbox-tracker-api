import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common';
import UpdateProfileDto from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private _jwtSecret = this.configService.get('JWT_SECRET');

  constructor(
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch {
      throw new BadRequestException('Les identifiants saisis sont invalides');
    }
  }

  async signIn(@Req() req: Request): Promise<Express.User> {
    return req.user;
  }

  async signOut(@Req() request: Request): Promise<void> {
    request.session.destroy(() => {});
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this._jwtSecret });
      return await this.usersService.findOne(payload.sub);
    } catch {
      throw new BadRequestException();
    }
  }

  async verifyPassword(password: string, encrypted: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, encrypted);
    if (!isMatch) throw new BadRequestException();
    return isMatch;
  }

  async generateToken(user: User, expiresIn: string): Promise<string> {
    const payload = { sub: user.id, name: user.name };
    return this.jwtService.signAsync(payload, { secret: this._jwtSecret, expiresIn });
  }

  async profile(user: User): Promise<User> {
    try {
      return await this.usersService.findByEmail(user.email);
    } catch {
      throw new BadRequestException();
    }
  }

  async updateProfile(user: User, dto: UpdateProfileDto): Promise<User> {
    return await this.usersService.updateProfile(user, dto);
  }

  async updatePassword(user: User, dto: UpdatePasswordDto): Promise<User> {
    try {
      await this.usersService.updatePassword(user.id, dto.password);
      return await this.usersService.findByEmail(user.email);
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jour du mot de passe');
    }
  }

  async forgotPassword(dto: forgotPasswordDto): Promise<void> {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      const token = await this.generateToken(user, '15min');
      const link = this.configService.get('FRONTEND_URI') + 'reset-password?token=' + token;
      this.eventEmitter.emit('user.reset-password', { user, link });
    } catch {
      throw new NotFoundException();
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const { token, password } = resetPasswordDto;
    try {
      await this.verifyToken(token);
      const payload = await this.jwtService.verifyAsync(token, { secret: this._jwtSecret });
      return await this.usersService.updatePassword(payload.sub, password);
    } catch {
      throw new BadRequestException();
    }
  }
}
