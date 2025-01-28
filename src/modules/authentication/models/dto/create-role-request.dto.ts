import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RelationRequestDto } from 'src/shared/dto/relation-request.dto';

export class CreateRoleRequestDto {
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiPropertyOptional({ type: [RelationRequestDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => RelationRequestDto)
  @IsOptional()
  public permissions: RelationRequestDto[];
}
