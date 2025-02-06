import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './providers/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import jwt from 'src/config/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RmqModule } from '@modules/rmq/rmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCode } from '@models/registerCode/register-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisterCode]),
    ConfigModule.forFeature(jwt),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService) => configService.get('jwt'),
    }),
    UserModule,
    RmqModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    LocalAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
