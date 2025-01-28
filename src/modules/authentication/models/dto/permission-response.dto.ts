import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Actions } from 'src/models/authorization/actions.enum';

export class PermissionResponseDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public action: Actions;

  @ApiProperty()
  public subject: string;

  @ApiPropertyOptional()
  public inverted?: boolean;

  @ApiPropertyOptional()
  public conditions?: unknown;

  @ApiPropertyOptional()
  public reason?: string;
}
