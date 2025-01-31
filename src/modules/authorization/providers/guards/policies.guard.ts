import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from '../../decorators/policies.decorator';
import {
  createMongoAbility,
  ForbiddenError,
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
  subject,
} from '@casl/ability';
import { PermissionService } from '../permission.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IS_PUBLIC_KEY } from 'src/shared/decorator/is-public.decorator';
import { Request } from 'express';
import { Permission } from 'src/models/authorization/permission.entity';
import { User } from 'src/models/user/user.entity';
import { size } from 'lodash';
import * as Mustache from 'mustache';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;
export const subjects = ['User', 'Permission', 'Role', 'all'] as const;

export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  public createAbility(rules: RawRuleOf<AppAbility>[]) {
    return createMongoAbility<AppAbility>(rules);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules: PolicyHandler[] =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const currentUser: any = context.switchToHttp().getRequest().user;
    const request: Request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const userPermissions = await this.permissionService.findByRoleId(
      currentUser.roleId,
    );

    const parsedUserPermission = this.parseConditions(
      userPermissions,
      currentUser,
    );

    try {
      const ability = this.createAbility(Object(parsedUserPermission));

      for await (const rule of rules) {
        if (size(rule?.conditions)) {
          const subId = request.params['id'];
          if (!subId) {
            continue;
          }

          const sub = await this.getSubjectById(subId, rule.subject);

          ForbiddenError.from(ability)
            .setMessage('You are not allowed to perform this action')
            .throwUnlessCan(
              rule.action as unknown as (typeof actions)[number],
              subject(rule.subject as any, sub),
            );
        } else {
          ForbiddenError.from(ability)
            .setMessage('You are not allowed to perform this action')
            .throwUnlessCan(
              rule.action as unknown as (typeof actions)[number],
              rule.subject as any,
            );
        }
      }
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }

    return true;
  }

  parseConditions(permissions: Permission[], user: User) {
    return permissions.map((permission) => {
      if (size(permission.conditions)) {
        const newConditions: Record<string, any> = {};
        if (permission.conditions['createdBy']) {
          newConditions['createdBy'] = Mustache.render(
            permission.conditions['createdBy'],
            user,
          );
        }

        return {
          ...permission,
          conditions: newConditions,
        };
      }
      return permission;
    });
  }

  async getSubjectById(id: string, subName: string) {
    const subject = await this.dataSource
      .getRepository(subName)
      .findOne({ where: { id } });
    if (!subject) throw new NotFoundException(`${subName} not found`);
    return subject;
  }
}
