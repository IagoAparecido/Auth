import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/models/authorization/permission.entity';
import { Role } from 'src/models/authorization/role.entity';
import { RoleService } from './providers/role.service';
import { PermissionService } from './providers/permission.service';
import { PermissionController } from './controllers/permission.controller';
import { RolesController } from './controllers/roles.controller';
import { User } from 'src/models/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [RoleService, PermissionService],
  controllers: [RolesController, PermissionController],
})
export class AuthorizationModule {}
