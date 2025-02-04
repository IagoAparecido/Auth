import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ enumName: 'userType', enum: USER_TYPE })
  @IsNotEmpty()
  public application: USER_TYPE;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public roleId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public terms: boolean;
}
