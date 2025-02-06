import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '@shared/dto/paginated.dto';

export const ApiOkResponsePaginated = <PaginatedDto extends Type<unknown>>(
  dataDto: PaginatedDto,
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedDto, dataDto),
    ApiOkResponse({
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                },
              },
            },
          },
        ],
      },
    }),
  );
