import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { Public } from 'src/shared/decorator/is-public.decorator';
import { Request as IRequest } from 'express';
import { User } from 'src/models/user/user.entity';
import { LoginRequestDto } from '../models/dto/login-request.dto';
import { ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';

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
}
