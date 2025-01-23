import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './provider/user.service';
import { User } from 'src/models/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
