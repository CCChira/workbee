import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { Request } from 'express';

export interface ISearch {
  field: string;
  searchParam: string;
}
export class Search {
  field: string;
  searchParam: string;
}
export const SearchDecorator = createParamDecorator(
  (validParams, ctx: ExecutionContext): ISearch => {
    const req: Request = ctx.switchToHttp().getRequest();
    const search = req.query['search'] as string;
    if (!search) return { field: '', searchParam: '' };

    const [field, searchParam] = search.split(':');
    if (!validParams.includes(field))
      throw new BadRequestException(`invalid sort property: ${field}`);
    return { field, searchParam };
  },
);
export function SearchApiQuery() {
  return applyDecorators(
    ApiBody({
      required: false,
      type: Search,
      description: 'search params',
    }),
  );
}
