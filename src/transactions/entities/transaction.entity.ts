import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { TransactionCategory } from '../utils/categories.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Transaction extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionCategory })
  category: TransactionCategory;

  @Column({ type: 'text', nullable: true })
  label: string;

  @ManyToOne(() => Cashbox)
  @JoinColumn()
  cashbox: Cashbox;

  @ManyToOne(() => User)
  @JoinColumn()
  by: User;
}
