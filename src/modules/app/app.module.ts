import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthorizationModule } from '../authentication/authentication.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, AuthorizationModule],
})
export class AppModule {}
