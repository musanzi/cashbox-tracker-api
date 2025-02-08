import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransactionTypeEnum } from '../utils/type.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @IsString()
  label: string;

  @IsString()
  to: string;
}
