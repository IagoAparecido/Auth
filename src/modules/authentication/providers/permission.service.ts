import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/models/authorization/permission.entity';
import { Role } from 'src/models/authorization/role.entity';
import { User } from 'src/models/user/user.entity';
import { In, Repository } from 'typeorm';
import { CreatePermissionRequestDto } from '../models/dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from '../models/dto/update-permission-request.dto';
import { EditRelationRequestDto } from 'src/shared/dto/edit-relation-request.dto.ts';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findAll(
    page: number,
    limit: number,
  ): Promise<[Permission[], number]> {
    return await this.permissionRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: page,
      take: limit,
    });
  }

  public async findByUserId(id: string): Promise<Permission[]> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: { roleId: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return await this.permissionRepository.findBy({
      roles: { id: user.roleId },
    });
  }

  public async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    return permission;
  }

  public async create(data: CreatePermissionRequestDto): Promise<Permission> {
    let roles;
    if (data.roles) {
      const ids = data.roles.map((children) => children.id);
      roles = await this.rolesRepository.find({ where: { id: In(ids) } });
    }

    console.log(roles);

    const permission = this.permissionRepository.create({
      action: data.action,
      subject: data.subject,
      inverted: data.inverted,
      conditions: data.conditions,
      reason: data.reason,
      roles,
    });
    return await this.permissionRepository.save(permission);
  }

  public async delete(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id: id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    await this.permissionRepository.softRemove(permission);
  }

  public async update(
    id: string,
    data: UpdatePermissionRequestDto,
  ): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    await this.permissionRepository.update(
      { id },
      {
        action: data.action,
        subject: data.subject,
        inverted: data.inverted,
        conditions: data.conditions,
        reason: data.reason,
      },
    );
  }

  public async addRole(
    id: string,
    data: EditRelationRequestDto,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: id },
      relations: {
        roles: true,
      },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const ids = data.relation.map((children) => children.id);
    const roles = await this.rolesRepository.findBy({ id: In(ids) });
    if (roles.length !== ids.length) {
      throw new NotFoundException('Some roles not found');
    }

    permission.roles = [...permission.roles, ...roles];

    await this.permissionRepository.save(permission);
    return permission;
  }

  public async removeRole(
    id: string,
    data: EditRelationRequestDto,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: id },
      relations: { roles: true },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const idsToRemove = data.relation.map((child) => child.id);
    permission.roles = permission.roles.filter(
      (child) => !idsToRemove.includes(child.id),
    );

    await this.permissionRepository.save(permission);
    return permission;
  }
}
