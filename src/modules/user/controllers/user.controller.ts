import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { CheckPolicies } from 'src/modules/authorization/decorators/policies.decorator';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiOkResponsePaginated } from '@shared/decorator/api-ok-response-paginated.decorator';
import { PaginatedDto } from '@shared/dto/paginated.dto';
import { UserResponseDto } from '../models/dto/user-response.dto';
import { UpdateUserRequestDto } from '../models/dto/update-user-request.dto';

@ApiTags('Users')
@Controller('users')
@ApiUnauthorizedResponse({
  description: 'Unauthorized when credentials is invalid',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CheckPolicies({ action: 'read', subject: 'User' })
  @Get()
  @ApiOperation({
    summary: 'Get all Users',
  })
  @ApiOkResponsePaginated(UserResponseDto, 'List of users')
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
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    limit = Number(limit) || Number(process.env.PAGINATION_LIMIT);
    page = page ? (page - 1) * limit : 0;

    const [users, total] = await this.userService.findAll(page, limit);
    return new PaginatedDto(users, total);
  }

  @CheckPolicies({ action: 'read', subject: 'User' })
  @Get(':id')
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiOperation({
    summary: 'Get a User by id',
  })
  @ApiOkResponse({
    description: 'A User',
    type: [UserResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no user is found.',
  })
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @CheckPolicies({ action: 'delete', subject: 'User' })
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no user is found.',
  })
  public delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @CheckPolicies({ action: 'update', subject: 'User' })
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiOkResponse({
    description: 'user updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Throws 404 when no user is found.',
  })
  public update(@Param('id') id: string, @Body() data: UpdateUserRequestDto) {
    return this.userService.update(id, data);
  }
}
