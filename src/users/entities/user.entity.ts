import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../shared/utils/abstract.entity';
import { RoleEnum } from '../../shared/enums/roles.enum';

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
}
