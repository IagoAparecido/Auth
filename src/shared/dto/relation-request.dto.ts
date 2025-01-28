import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RelationRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  public id: string;
}
