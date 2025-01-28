import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { RoleEnum } from '../../shared/enums/roles.enum';
import { Cashbox } from '../../cashboxes/entities/cashbox.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column({ nullable: true })
  profile: string;

  @OneToMany(() => Cashbox, (cashbox) => cashbox.manager)
  cashboxes: Cashbox[];

  @OneToMany(() => Transaction, (transaction) => transaction.by)
  transactions: Transaction[];
}
