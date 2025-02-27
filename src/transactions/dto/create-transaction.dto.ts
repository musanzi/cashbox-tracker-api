import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TransactionCategory } from '../utils/categories.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsString()
  label: string;

  @IsString()
  cashbox: string;
}
