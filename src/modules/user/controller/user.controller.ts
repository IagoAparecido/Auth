import { Controller, Get } from '@nestjs/common';
import { UserService } from '../provider/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
