import { User } from '@models/user/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { CHANNEL_TYPE } from './channel-type';
import { baseEntity } from '@models/baseEntity';

@Entity()
export class RegisterCode extends baseEntity<RegisterCode> {
  @Column()
  value: number;

  @Column()
  expirationDate: Date;

  @Column({
    type: 'enum',
    enum: CHANNEL_TYPE,
    enumName: 'channelType',
  })
  channel: CHANNEL_TYPE;

  @OneToOne(() => User, (user) => user.code)
  user: User;
  @Column()
  userId: string;
}
