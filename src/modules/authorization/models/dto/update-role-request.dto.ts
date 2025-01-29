import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRoleRequestDto {
  @ApiProperty()
  @IsString()
  public readonly name: string;
}
