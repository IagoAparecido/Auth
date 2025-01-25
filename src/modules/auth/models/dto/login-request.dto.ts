import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  public password: string;
}
