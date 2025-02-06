import { USER_STATUS } from '@models/user/user-status';
import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  public roleId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  public acceptTerms: boolean;

  @ApiPropertyOptional({ enumName: 'userStatus', enum: USER_STATUS })
  @IsOptional()
  @IsNotEmpty()
  public status: USER_STATUS;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  public verified: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  public isActive: boolean;
}
