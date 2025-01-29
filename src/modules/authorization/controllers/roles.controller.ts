import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleResponseDto } from '../models/dto/role-response.dto';
import { CreateRoleRequestDto } from '../models/dto/create-role-request.dto';
import { UpdateRoleRequestDto } from '../models/dto/update-role-request.dto';
import { EditRelationRequestDto } from 'src/shared/dto/edit-relation-request.dto.ts';
import { RoleService } from '../providers/role.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@ApiUnauthorizedResponse({
  description: 'Unauthorized when credentials is invalid',
})
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all roles',
  })
  @ApiOkResponse({
    description: 'List of roles',
    type: [RoleResponseDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  public async findAllRoles(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    limit = Number(limit) || Number(process.env.PAGINATION_LIMIT);
    page = page ? (page - 1) * limit : 0;

    return await this.roleService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by id',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the role' })
  @ApiOkResponse({
    description: 'One role',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Throws 404 when no role is found.' })
  public async findOneRole(@Param('id') id: string) {
    return await this.roleService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
  })
  @ApiCreatedResponse({
    description: 'Role created successfully.',
    type: RoleResponseDto,
  })
  public async createRole(@Body() data: CreateRoleRequestDto) {
    return await this.roleService.create(data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a role',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the role' })
  @ApiOkResponse({ description: 'Role deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Throws 404 when no role is found.' })
  public deleteRole(@Param('id') id: string) {
    return this.roleService.delete(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role',
  })
  @ApiOkResponse({
    description: 'Role updated successfully.',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Throws 404 when no role is found.' })
  public updateRole(
    @Param('id') id: string,
    @Body() data: UpdateRoleRequestDto,
  ) {
    return this.roleService.update(id, data);
  }

  @Post(':roleId/permissions')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add permissions to role',
  })
  @ApiParam({ name: 'roleId', description: 'The UUID of the role' })
  @ApiCreatedResponse({
    description: 'Permissions added successfully.',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no role or permissions are found.',
  })
  public async addChildrenRoles(
    @Param('roleId') roleId: string,
    @Body() data: EditRelationRequestDto,
  ) {
    return await this.roleService.addPermission(roleId, data);
  }

  @Delete(':roleId/permissions')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Remove permissions to roles',
  })
  @ApiParam({ name: 'roleId', description: 'The UUID of the permission' })
  @ApiCreatedResponse({
    description: 'Permissions removed successfully.',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Throws 404 when no role is found.' })
  public async removeChildrenRoles(
    @Param('roleId') roleId: string,
    @Body() data: EditRelationRequestDto,
  ) {
    return await this.roleService.removePermission(roleId, data);
  }
}
