import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class RegisterCodeRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Min(100000)
  @Max(999999)
  public code: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public value: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(USER_TYPE)
  public application: USER_TYPE;
}
