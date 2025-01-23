import { baseEntity } from 'src/shared/baseEntity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends baseEntity<User> {
  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
