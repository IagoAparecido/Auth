import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user/user.entity';
import { UserService } from 'src/modules/user/providers/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = pass === user?.password;
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      username: user.username,
      roleId: user.roleId,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
