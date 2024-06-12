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
  _count: {
    TaskAssignment: number;
  };
}
export interface PaginationSortingState {
  size: number;
  page: number;
  sortOrder: {
    property: string;
    direction: 'asc' | 'desc';
  };
  search?: { field: string; searchParam: string };
}
export const defaultPagSort: PaginationSortingState = {
  size: 10,
  page: 1,
  sortOrder: {
    property: 'name',
    direction: 'asc',
  },
};
export function customPagSort(size: number, defaultSort: string): PaginationSortingState {
  return {
    size: size ?? 10,
    page: 1,
    sortOrder: {
      property: defaultSort,
      direction: 'asc',
    },
  };
}
export type Action =
  | { type: 'SET_SIZE'; payload: number }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT_ORDER'; payload: { property: string; direction: 'asc' | 'desc' } }
  | { type: 'SET_SEARCH'; payload: { field: string; searchParam: string } };
export interface QueryResponse<DType> {
  data: DType[];
  dataSize: number;
  page: number;
  size: number;
}
export interface DeletionResponse {
  data: string[];
}
export type FetchFunction<QueryResponse> = (pagSort: PaginationSortingState) => Promise<QueryResponse>;
export interface Coordinates {
  lat: number;
  lng: number;
}
