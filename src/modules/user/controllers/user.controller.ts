import { Controller, Get } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { CheckPolicies } from 'src/modules/authorization/decorators/policies.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @CheckPolicies({ action: 'read', subject: 'User' })
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
