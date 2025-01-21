import { Column, Entity, JoinColumn, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { TransactionTypeEnum } from '../utils/type.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';

@Entity()
export class Transaction extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @ManyToMany(() => Cashbox)
  @JoinColumn({ name: 'fromCashBoxId' })
  from: Cashbox;

  @ManyToMany(() => Cashbox)
  @JoinColumn({ name: 'toCashBoxId' })
  to: Cashbox;

  @ManyToMany(() => Cashbox)
  @JoinColumn({ name: 'byId' })
  by: Cashbox;
}
