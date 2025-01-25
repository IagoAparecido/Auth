import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './providers/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import jwt from 'src/config/jwt';

@Module({
  imports: [
    ConfigModule.forFeature(jwt),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService) => configService.get('jwt'),
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    jwtAuthGuard,
    LocalAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
