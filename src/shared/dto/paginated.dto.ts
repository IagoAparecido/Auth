import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  meta: {
    total: number;
  };

  constructor(data: T, total: number) {
    this.data = data;
    this.meta = { total };
  }
}
