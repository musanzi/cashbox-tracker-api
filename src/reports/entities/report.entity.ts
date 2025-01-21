import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { ReportTypeEnum } from '../utils/type.enum';

@Entity()
export class Report extends AbstractEntity {
  @Column({ type: 'enum', enum: ReportTypeEnum })
  type: ReportTypeEnum;

  @Column({ type: 'date' })
  generated_at: Date;

  @Column({ type: 'json' })
  data: object;
}
