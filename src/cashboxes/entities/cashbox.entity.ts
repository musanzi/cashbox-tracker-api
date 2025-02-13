import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Cashbox extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.cashboxes)
  @JoinColumn()
  cashier: User;
}
