import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Actions } from 'src/models/authorization/actions.enum';

export class UpdatePermissionRequestDto {
  @ApiPropertyOptional()
  @IsEnum(Actions)
  @IsOptional()
  public readonly action: Actions;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly subject: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  public readonly inverted: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public readonly conditions: any;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly reason: string;
}
