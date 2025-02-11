import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ enum: USER_TYPE, enumName: 'userType' })
  @IsNotEmpty()
  application: USER_TYPE;
}
