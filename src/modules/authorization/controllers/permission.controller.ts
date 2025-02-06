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
import { PermissionResponseDto } from '../models/dto/permission-response.dto';
import { CreatePermissionRequestDto } from '../models/dto/create-permission-request.dto';
import { UpdatePermissionRequestDto } from '../models/dto/update-permission-request.dto';
import { EditRelationRequestDto } from 'src/shared/dto/edit-relation-request.dto.ts';
import { PermissionService } from '../providers/permission.service';
import { PaginatedDto } from 'src/shared/dto/paginated.dto';
import { Public } from 'src/shared/decorator/is-public.decorator';
import { ApiOkResponsePaginated } from '@shared/decorator/api-ok-response-paginated.decorator';
import { CheckPolicies } from '../decorators/policies.decorator';

@ApiBearerAuth()
@ApiTags('Permissions')
@Controller('permisions')
@ApiUnauthorizedResponse({
  description: 'Unauthorized when credentials is invalid',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Get()
  @ApiOperation({
    summary: 'Get all permissions',
  })
  @ApiOkResponsePaginated(PermissionResponseDto, 'List of permission')
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
  public async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    limit = Number(limit) || Number(process.env.PAGINATION_LIMIT);
    page = page ? (page - 1) * limit : 0;

    const [permissions, total] = await this.permissionService.findAll(
      page,
      limit,
    );
    return new PaginatedDto(permissions, total);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Get('/users/:id')
  @ApiOperation({
    summary: 'Get all permission by user',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiNotFoundResponse({ description: 'Throws 404 when no user is found.' })
  @ApiOkResponse({
    description: 'List of permissions',
    type: [PermissionResponseDto],
  })
  public async findAllByUser(@Param('id') id: string) {
    return await this.permissionService.findByUserId(id);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Get('/:id')
  @ApiOperation({
    summary: 'Get a permission by id',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the permission' })
  @ApiOkResponse({
    description: 'One permission',
    type: PermissionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no permission is found.',
  })
  public async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(id);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Public()
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create a new permission',
  })
  @ApiCreatedResponse({
    description: 'Permission created successfully.',
    type: PermissionResponseDto,
  })
  public async create(@Body() data: CreatePermissionRequestDto) {
    return await this.permissionService.create(data);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a permission',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the permission' })
  @ApiOkResponse({ description: 'Permission deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no permission is found.',
  })
  public delete(@Param('id') id: string) {
    return this.permissionService.delete(id);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Patch('/:id')
  @ApiOperation({
    summary: 'Update a permission',
  })
  @ApiOkResponse({
    description: 'Permission updated successfully.',
    type: PermissionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no permission is found.',
  })
  public update(
    @Param('id') id: string,
    @Body() data: UpdatePermissionRequestDto,
  ) {
    return this.permissionService.update(id, data);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Post('/:id/roles')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add roles to permission',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the permission' })
  @ApiCreatedResponse({
    description: 'Roles added successfully.',
    type: PermissionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no permissions or roles are found.',
  })
  public async addChildren(
    @Param('id') id: string,
    @Body() data: EditRelationRequestDto,
  ) {
    return await this.permissionService.addRole(id, data);
  }

  @CheckPolicies({ action: 'manage', subject: 'all' })
  @Delete('/:id/roles')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Remove roles to permission',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the permission' })
  @ApiCreatedResponse({
    description: 'Roles removed successfully.',
    type: PermissionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no permission is found.',
  })
  public async removeChildren(
    @Param('id') id: string,
    @Body() data: EditRelationRequestDto,
  ) {
    return await this.permissionService.removeRole(id, data);
  }
}
