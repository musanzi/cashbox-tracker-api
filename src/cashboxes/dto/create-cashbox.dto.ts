import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCashboxDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  balance: number;

  @IsNotEmpty()
  cashier: string;
}
