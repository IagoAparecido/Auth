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
import { PaginatedDto } from '@shared/dto/paginated.dto';
import { ApiOkResponsePaginated } from '@shared/decorator/api-ok-response-paginated.decorator';
import { CheckPolicies } from '../decorators/policies.decorator';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@ApiUnauthorizedResponse({
  description: 'Unauthorized when credentials is invalid',
})
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Get()
  @ApiOperation({
    summary: 'Get all roles',
  })
  @ApiOkResponsePaginated(RoleResponseDto, 'List of roles')
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

    const [roles, total] = await this.roleService.findAll(page, limit);
    return new PaginatedDto(roles, total);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
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

  @CheckPolicies({ action: 'manage', subject: 'all' })
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

  @CheckPolicies({ action: 'manage', subject: 'all' })
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

  @CheckPolicies({ action: 'manage', subject: 'all' })
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

  @CheckPolicies({ action: 'manage', subject: 'all' })
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

  @CheckPolicies({ action: 'manage', subject: 'all' })
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
