import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { RightsService } from './rights.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, RightsService, LocalStrategy, SessionSerializer],
  exports: [RightsService]
})
export class AuthModule {}
