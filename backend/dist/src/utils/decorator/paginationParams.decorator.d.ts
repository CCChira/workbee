export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}
export declare const PaginationParamsDecorator: (...dataOrPipes: any[]) => ParameterDecorator;
