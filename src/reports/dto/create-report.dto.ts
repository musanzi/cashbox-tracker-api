import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReportTypeEnum } from '../utils/type.enum';

export class CreateReportDto {
  @IsEnum({ enum: ReportTypeEnum })
  type: ReportTypeEnum;

  @IsNotEmpty()
  generated_at: Date;

  @IsNotEmpty()
  data: JSON;
}
