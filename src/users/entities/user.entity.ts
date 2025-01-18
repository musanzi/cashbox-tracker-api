import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  verified_at: Date;
}
