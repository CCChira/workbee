export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}
export interface PaginationOptions {
  page: number;
  limit: number;
}
export interface QueryOptions {
  filter?: Record<string, unknown>;
  sort?: SortOptions;
  pagination?: PaginationOptions;
}
export interface PaginatedResource<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
