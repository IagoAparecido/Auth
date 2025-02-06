import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;
}
