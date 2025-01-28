import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RelationRequestDto } from './relation-request.dto';

export class EditRelationRequestDto {
  @ApiPropertyOptional({ type: [RelationRequestDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => RelationRequestDto)
  @IsOptional()
  public relation: RelationRequestDto[];
}
