import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from './permission-response.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class RoleResponseDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({ type: [PermissionResponseDto] })
  @IsArray()
  @ValidateNested()
  public permission?: PermissionResponseDto[];
}
