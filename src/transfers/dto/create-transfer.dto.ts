import { IsNotEmpty } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}
