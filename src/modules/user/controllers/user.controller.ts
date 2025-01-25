import { Controller, Get } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { Public } from 'src/shared/decorator/is-public.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
