import { baseEntity } from 'src/models/baseEntity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { Role } from '../authorization/role.entity';
import { USER_STATUS } from './user-status';
import { USER_TYPE } from './user-types';
import { RegisterCode } from '@models/registerCode/register-code.entity';

@Entity()
@Unique(['username', 'application'])
export class User extends baseEntity<User> {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
  @Column()
  roleId: string;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    enumName: 'userStatus',
    default: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;

  @ManyToOne(() => RegisterCode, (code) => code.user)
  code: RegisterCode;
  @Column()
  codeId: string;

  @Column({
    type: 'enum',
    enum: USER_TYPE,
    enumName: 'userType',
  })
  application: USER_TYPE;

  @Column()
  verified: boolean;

  @Column()
  acceptTerms: boolean;
}
