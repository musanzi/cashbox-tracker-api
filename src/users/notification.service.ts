import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';

@Injectable()
export class UsersEmailService {
  constructor(private readonly emailService: MailerService) {}

  @OnEvent('user-created')
  async sendReportEmail({ user, password }: { user: User; password: string }) {
    await this.emailService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur MTG',
      raw: `
      Bonjour ${user.name} 
      
      Voici vos informations de connexion: 
      Email: ${user.email}
      Mot de passe: ${password}
      `
    });
  }
}
