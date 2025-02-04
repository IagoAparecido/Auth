import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;

  @ApiProperty({ enum: USER_TYPE, enumName: 'userType' })
  @IsNotEmpty()
  public application: USER_TYPE;
}
