import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Transfer extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  label: string;

  @ManyToOne(() => Cashbox)
  @JoinColumn()
  from_cashbox: Cashbox;

  @ManyToOne(() => Cashbox)
  @JoinColumn()
  to_cashbox: Cashbox;

  @ManyToOne(() => User)
  @JoinColumn()
  by: User;
}
