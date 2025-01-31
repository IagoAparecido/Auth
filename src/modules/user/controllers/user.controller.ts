import { Controller, Get } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { CheckPolicies } from 'src/modules/authorization/decorators/policies.decorator';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @CheckPolicies({ action: 'read', subject: 'User' })
  @Get()
  @ApiOperation({
    summary: 'Get all Users',
  })
  @ApiOkResponse({
    description: 'List of permission',
    // type: [PermissionResponseDto],
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
  async findAll() {
    return await this.userService.findAll();
  }
}
