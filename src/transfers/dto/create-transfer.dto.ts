import { IsNotEmpty } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  from_cashbox: string;

  @IsNotEmpty()
  to_cashbox: string;
}
