import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import UpdateProfileDto from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Authorization } from '../shared/decorators/rights.decorators';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { RoleEnum } from '../shared/enums/roles.enum';
import { User } from '../users/entities/user.entity';

@Controller('auth')
@Authorization(RoleEnum.User)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @Authorization(RoleEnum.Guest)
  singIn(@Req() req: Request): Promise<Express.User> {
    return this.authService.signIn(req);
  }

  @Post('sign-out')
  signOut(@Req() req: Request) {
    return this.authService.signOut(req);
  }

  @Get('profile')
  profile(@CurrentUser() user: User): Promise<User> {
    return this.authService.profile(user);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() currentUser: User, @Body() data: UpdateProfileDto): Promise<User> {
    return this.authService.updateProfile(currentUser, data);
  }

  @Patch('update-password')
  @Authorization(RoleEnum.User)
  updatePassword(@CurrentUser() user: User, @Body() dto: UpdatePasswordDto): Promise<User> {
    return this.authService.updatePassword(user, dto);
  }

  @Post('forgot-password')
  @Authorization(RoleEnum.Guest)
  forgotPassword(@Body() dto: forgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Authorization(RoleEnum.Guest)
  resetPassword(@Body() dto: ResetPasswordDto): Promise<User> {
    return this.authService.resetPassword(dto);
  }
}
