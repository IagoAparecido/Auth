import { CreateUserRequestDto } from '@modules/user/models/dto/create-user-request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@models/authorization/role.entity';
import { USER_TYPE } from '@models/user/user-types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(username: string, application: USER_TYPE): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username: username, application: application },
    });
  }

  async create(data: CreateUserRequestDto) {
    const user = await this.usersRepository.findOne({
      where: { username: data.username, application: data.application },
      select: ['username', 'application'],
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const role = await this.rolesRepository.findOne({
      where: { id: data.roleId },
      select: ['id'],
    });
    if (!role) {
      throw new UnauthorizedException('Role not found');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.usersRepository.save({
      name: data.name,
      username: data.username,
      password: hashedPassword,
      application: data.application,
      acceptTerms: data.terms,
      role: role,
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
