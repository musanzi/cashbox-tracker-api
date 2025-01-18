import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../../shared/enums/roles.enum';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  address: string;

  @IsEnum({ enum: RoleEnum })
  roles: RoleEnum;
}
