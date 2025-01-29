import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/models/authorization/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from 'src/models/authorization/permission.entity';
import { CreateRoleRequestDto } from '../models/dto/create-role-request.dto';
import { EditRelationRequestDto } from 'src/shared/dto/edit-relation-request.dto.ts';
import { UpdateRoleRequestDto } from '../models/dto/update-role-request.dto';
import { User } from 'src/models/user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async findAll(page: number, limit: number): Promise<[Role[], number]> {
    return this.roleRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: page,
      take: limit,
    });
  }

  public async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        permissions: true,
      },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  public async create(data: CreateRoleRequestDto): Promise<Role> {
    let permissions;
    if (data.permissions) {
      const ids = data.permissions.map((children) => children.id);
      permissions = await this.permissionRepository.find({
        where: { id: In(ids) },
      });
    }

    const role = this.roleRepository.create({
      name: data.name,
      permissions: permissions,
    });

    return await this.roleRepository.save(role);
  }

  public async update(id: string, data: UpdateRoleRequestDto): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!role) throw new NotFoundException('Role not found');

    await this.roleRepository.update(
      { id },
      {
        name: data.name,
      },
    );
  }

  public async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new Error('Role not found');
    }

    await this.roleRepository.softRemove(role);
  }

  public async addPermission(
    id: string,
    data: EditRelationRequestDto,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
      relations: {
        permissions: true,
      },
    });
    if (!role) throw new NotFoundException('Role not found');

    const ids = data.relation.map((children) => children.id);
    const permissions = await this.permissionRepository.findBy({ id: In(ids) });
    if (permissions.length !== ids.length)
      throw new NotFoundException('Some permissions not found');

    role.permissions = [...role.permissions, ...permissions];

    await this.roleRepository.save(role);
    return role;
  }

  public async removePermission(
    id: string,
    data: EditRelationRequestDto,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
      relations: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException('role not found');
    }

    const idsToRemove = data.relation.map((child) => child.id);
    role.permissions = role.permissions.filter(
      (child) => !idsToRemove.includes(child.id),
    );

    await this.roleRepository.save(role);
    return role;
  }
}
