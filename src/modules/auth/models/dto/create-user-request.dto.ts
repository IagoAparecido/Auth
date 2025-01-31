import { USER_TYPE } from '@models/user/user-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public password: string;

  @ApiProperty()
  public application: USER_TYPE;
}
