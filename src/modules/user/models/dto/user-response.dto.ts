import { USER_STATUS } from '@models/user/user-status';
import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public application: USER_TYPE;

  @ApiProperty()
  public terms: boolean;

  @ApiProperty()
  public isActive: boolean;

  @ApiProperty()
  public verified: boolean;

  @ApiProperty()
  public status: USER_STATUS;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
