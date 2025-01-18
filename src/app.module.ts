import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../'),
      renderPath: '/uploads'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      })
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          secure: true,
          host: config.get('MAIL_HOST'),
          port: Number(config.get('MAIL_PORT')),
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `Support MTG <${config.get('MAIL_USERNAME')}>`
        }
      })
    }),
    AuthModule,
    UsersModule,
    DatabaseModule
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthorizationGuard }]
})
export class AppModule {}
