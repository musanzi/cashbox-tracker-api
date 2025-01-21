import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEmailService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersEmailService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
