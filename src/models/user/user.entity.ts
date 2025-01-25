import { baseEntity } from 'src/models/baseEntity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Role } from '../authorization/role.entity';

@Entity()
export class User extends baseEntity<User> {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  public role: Role;
  @Column()
  public roleId: string;
}
