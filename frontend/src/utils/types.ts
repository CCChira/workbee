import errors from '@/errors/responseErrors.ts';

export interface Pagination {}
export enum Roles {
  UNASSIGNED,
  CLIENT,
  EMPLOYEE,
  ADMIN,
}
export interface ErrorType {
  message: string;
  error: string;
  statusCode: errors;
}

export interface User {
  id: string;
  email: string;
  role: Roles;
  name?: string;
  createdAt: Date;
}
export interface PaginationSortingState {
  size: number;
  page: number;
  sortOrder: {
    property: string;
    direction: 'asc' | 'desc';
  };
}
export const defaultPagSort: PaginationSortingState = {
  size: 10,
  page: 1,
  sortOrder: {
    property: 'name',
    direction: 'asc',
  },
};
export type Action =
  | { type: 'SET_SIZE'; payload: number }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT_ORDER'; payload: { property: string; direction: 'asc' | 'desc' } };
export interface QueryResponse<DType> {
  data: DType[];
  dataSize: number;
  page: number;
  size: number;
}

export type FetchFunction<QueryResponse> = (pagSort: PaginationSortingState) => Promise<QueryResponse>;
