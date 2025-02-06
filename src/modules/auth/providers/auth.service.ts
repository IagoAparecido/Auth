import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user/user.entity';
import { UserService } from 'src/modules/user/providers/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto } from '../../user/models/dto/create-user-request.dto';
import { queueKeys } from '@shared/contants/queue';
import { ClientProxy } from '@nestjs/microservices';
import { USER_TYPE } from '@models/user/user-types';
import { RegisterCodeRequestDto } from '../models/dto/register-code-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCode } from '@models/registerCode/register-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RegisterCode)
    private codeRepository: Repository<RegisterCode>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(queueKeys.QUEUE_NAME)
    private readonly client: ClientProxy,
  ) {}

  generateSixDigitCode() {
    const randomNumber = Math.floor(Math.random() * 999999) + 1;
    return String(randomNumber).padStart(6, '0');
  }

  async validateUser(
    username: string,
    pass: string,
    application: USER_TYPE,
  ): Promise<User> {
    const user = await this.usersService.findOne(username, application);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verified === false) {
      throw new NotFoundException('User not verified');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
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

  async register(data: CreateUserRequestDto) {
    const user = await this.usersService.create(data);

    this.client
      .send(queueKeys.SEND_CONFIRM_EMAIL, {
        email: user.username,
        code: this.generateSixDigitCode(),
        name: user.name,
      })
      .toPromise();
  }

  public async verifyCode(data: RegisterCodeRequestDto) {
    try {
      const codeValue = data.code;
      const registerCode = await this.codeRepository.findOne({
        where: { value: codeValue },
        relations: {
          user: true,
        },
      });
      if (!registerCode) throw new ConflictException('Ivalid code');

      const currentDate = new Date();
      if (currentDate > registerCode.expirationDate)
        throw new ConflictException('Code expired');

      if (
        registerCode.user.username === data.value &&
        registerCode.user.application === data.application
      ) {
        return await this.usersService.updateVerified(
          registerCode.user.id,
          true,
        );
      } else {
        throw new ConflictException('Invalid code');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
