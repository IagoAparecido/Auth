import { CreateUserRequestDto } from '@modules/auth/models/dto/create-user-request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(data: CreateUserRequestDto) {
    const user = await this.usersRepository.findOne({
      where: { username: data.username, application: data.application },
      select: ['username'],
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.usersRepository.save({
      name: data.name,
      username: data.username,
      password: hashedPassword,
      application: data.application,
    });
  }

  createForRegister(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['username'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
