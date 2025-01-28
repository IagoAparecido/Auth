import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Actions } from 'src/models/authorization/actions.enum';
import { Type } from 'class-transformer';
import { RelationRequestDto } from 'src/shared/dto/relation-request.dto';

export class CreatePermissionRequestDto {
  @ApiProperty()
  @IsEnum(Actions)
  public readonly action: Actions;

  @ApiProperty()
  @IsString()
  public readonly subject: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  public readonly inverted: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public readonly conditions: unknown;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly reason: string;

  @ApiPropertyOptional({ type: [RelationRequestDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => RelationRequestDto)
  @IsOptional()
  public roles: RelationRequestDto[];
}
