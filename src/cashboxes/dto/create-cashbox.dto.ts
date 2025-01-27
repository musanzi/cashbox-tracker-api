import { IsNotEmpty } from 'class-validator';

export class CreateCashboxDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  manager: string;
}
