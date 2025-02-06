import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import { Public } from 'src/shared/decorator/is-public.decorator';
import { Request as IRequest } from 'express';
import { User } from 'src/models/user/user.entity';
import { LoginRequestDto } from '../models/dto/login-request.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserRequestDto } from '../../user/models/dto/create-user-request.dto';
import { LoginResponseDto } from '../models/dto/login-reponse.dto';
import { ForgotPasswordRequestDto } from '../models/dto/forgot-password-request.dto';
import { RegisterCodeRequestDto } from '../models/dto/register-code-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login to the application',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
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

  @Post('verify')
  @Public()
  @ApiOperation({
    description: 'Verify register code',
  })
  @ApiBody({ type: RegisterCodeRequestDto })
  @ApiBadRequestResponse({ description: 'Error to update user' })
  @ApiConflictResponse({ description: 'Invalid Code' })
  public async verifyCode(@Body() data: RegisterCodeRequestDto) {
    return await this.authService.verifyCode(data);
  }

  // @Public()
  // @Patch('change-password')
  // @ApiOperation({
  //   description: 'Change password',
  // })
  // public async changePassword() {
  //   return this.authService.forgotPasword(data);
  // }
}
