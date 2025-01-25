import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '300s',
  },
} as JwtModuleOptions;

export default registerAs('jwt', () => jwtConfig);
