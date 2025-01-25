import { baseEntity } from 'src/models/baseEntity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { Actions } from './actions.enum';

@Entity()
export class Permission extends baseEntity<Permission> {
  @Column({
    type: 'enum',
    enum: Actions,
    enumName: 'actions',
  })
  public action: Actions;

  @Column()
  subject: string;

  @Column({ default: false })
  inverted: boolean;

  @Column({ type: 'json', nullable: true })
  conditions?: unknown;

  @Column({ nullable: true })
  reason?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
