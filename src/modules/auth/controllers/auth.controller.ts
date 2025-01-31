import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { Public } from 'src/shared/decorator/is-public.decorator';
import { Request as IRequest } from 'express';
import { User } from 'src/models/user/user.entity';
import { LoginRequestDto } from '../models/dto/login-request.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserRequestDto } from '../models/dto/create-user-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  signIn(@Request() req: IRequest) {
    return this.authService.signIn(req.user as unknown as User);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Create a new account',
  })
  @ApiBody({ type: CreateUserRequestDto })
  register(@Body() data: CreateUserRequestDto) {
    return this.authService.register(data);
  }
}
