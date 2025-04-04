import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Authorization } from '../shared/decorators/rights.decorators';
import { CurrentUser } from '../shared/decorators/user.decorator';
import { RoleEnum } from '../shared/enums/roles.enum';
import CreateUserDto from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { QueryParams } from './utils/query-params.type';

@Controller('users')
@Authorization(RoleEnum.Manager)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('')
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Get('')
  findAll(@Query() queryParams: QueryParams): Promise<[User[], number]> {
    return this.userService.findAll(queryParams);
  }

  @Get('cashiers')
  findCashiers(): Promise<User[]> {
    return this.userService.findCashiers();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Post('image-profile')
  @Authorization(RoleEnum.User)
  @UseInterceptors(
    FileInterceptor('thumb', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  uploadImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
    return this.userService.uploadImage(user, file);
  }

  @Delete(':id')
  @Authorization(RoleEnum.Admin)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
