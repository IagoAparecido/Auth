import { baseEntity } from 'src/models/baseEntity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role extends baseEntity<Role> {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'roles_permissions' })
  permissions: Permission[];
}
