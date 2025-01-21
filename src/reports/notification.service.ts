import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReportsEmailService {
  constructor(
    private readonly emailService: MailerService,
    private readonly usersService: UsersService
  ) {}

  @OnEvent('send-daily-report')
  async sendReportEmail({ total, data }: { total: number; data: { cashbox: string; balance: number }[] }) {
    const { data: users } = await this.usersService.findManagers();
    users.forEach(async (user) => {
      await this.emailService.sendMail({
        to: user.email,
        subject: 'Daily Report',
        raw: `
        ${data.forEach((cashbox) => `${cashbox.cashbox}: ${cashbox.balance}`)}
      
        Total: ${total}
        `
      });
    });
  }
}
