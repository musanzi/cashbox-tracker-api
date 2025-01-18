import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePhaseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  started_at: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  ended_at: Date;

  @IsNotEmpty()
  program: string;

  @IsOptional()
  form: JSON;
}
