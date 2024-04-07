import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function PagSortApiQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description: 'Number of items per page',
    }),
    ApiQuery({
      name: 'sort:order',
      required: false,
      type: String,
      description: 'Sort column',
    }),
  );
}
