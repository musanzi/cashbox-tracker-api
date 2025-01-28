import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { TransactionTypeEnum } from '../utils/type.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Transaction extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @ManyToOne(() => Cashbox)
  @JoinColumn()
  from: Cashbox;

  @ManyToOne(() => Cashbox)
  @JoinColumn()
  to: Cashbox;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn()
  by: User;
}
