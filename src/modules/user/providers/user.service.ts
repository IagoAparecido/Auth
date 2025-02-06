import { CreateUserRequestDto } from '@modules/user/models/dto/create-user-request.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@models/authorization/role.entity';
import { USER_TYPE } from '@models/user/user-types';
import { UpdateUserRequestDto } from '../models/dto/update-user-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll(page: number, limit: number): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      select: [
        'id',
        'name',
        'username',
        'verified',
        'status',
        'isActive',
        'application',
        'acceptTerms',
        'createdAt',
        'updatedAt',
      ],
      skip: page,
      take: limit,
    });
  }

  findOne(username: string, application: USER_TYPE): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username: username, application: application },
      select: [
        'id',
        'name',
        'username',
        'verified',
        'status',
        'isActive',
        'application',
        'acceptTerms',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'name',
        'username',
        'verified',
        'status',
        'isActive',
        'application',
        'acceptTerms',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
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

  async delete(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id'],
    });
    if (user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.softDelete(id);
  }

  async update(id: string, data: UpdateUserRequestDto) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let roleId;
    if (data.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: data.roleId },
        select: ['id'],
      });
      if (!role) throw new NotFoundException('Role not found');
      roleId = role.id;
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;

    await this.usersRepository.update(id, {
      password: hashedPassword ?? user.password,
      roleId: roleId ?? user.roleId,
      name: data.name ?? user.name,
      acceptTerms: data.acceptTerms ?? user.acceptTerms,
      isActive: data.isActive ?? user.isActive,
      status: data.status ?? user.status,
      verified: data.verified ?? user.verified,
    });
  }

  async updateVerified(id: string, verified: boolean) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.update(id, {
      verified: verified,
    });
  }
}
